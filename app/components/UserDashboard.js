import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { getUserStats, getSimulationResults } from '../../lib/firestore';

const UserDashboard = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentSimulations, setRecentSimulations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const [userStats, simulations] = await Promise.all([
            getUserStats(currentUser.uid),
            getSimulationResults(currentUser.uid)
          ]);
          
          setStats(userStats);
          setRecentSimulations(simulations.slice(0, 5)); // Get last 5 simulations
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      loadDashboardData();
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      color: 'white'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '1px solid #333'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Dashboard Pengguna
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading...</p>
          </div>
        ) : (
          <div>
            {/* User Info */}
            <div style={{
              backgroundColor: '#222',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#8eb940' }}>
                Informasi Pengguna
              </h3>
              <p><strong>Email:</strong> {currentUser?.email}</p>
              <p><strong>Bergabung:</strong> {new Date(currentUser?.metadata?.creationTime).toLocaleDateString('id-ID')}</p>
            </div>

            {/* Statistics */}
            <div style={{
              backgroundColor: '#222',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#8eb940' }}>
                Statistik Belajar
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8eb940' }}>
                    {stats?.totalSimulations || 0}
                  </div>
                  <div style={{ fontSize: '14px', color: '#888' }}>
                    Total Simulasi
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8eb940' }}>
                    {stats?.lawsStudied || 0}
                  </div>
                  <div style={{ fontSize: '14px', color: '#888' }}>
                    Laws Dipelajari
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Simulations */}
            <div style={{
              backgroundColor: '#222',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#8eb940' }}>
                Simulasi Terbaru
              </h3>
              {recentSimulations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recentSimulations.map((sim, index) => (
                    <div key={index} style={{
                      backgroundColor: '#333',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>
                          {sim.lawId?.charAt(0).toUpperCase() + sim.lawId?.slice(1)}'s Law
                        </div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          {new Date(sim.timestamp).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {sim.reactionTime && (
                          <div style={{ fontSize: '14px', color: '#8eb940' }}>
                            {sim.reactionTime}ms
                          </div>
                        )}
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          {sim.completed ? '✓ Selesai' : '○ Belum selesai'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
                  Belum ada simulasi yang diselesaikan
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
