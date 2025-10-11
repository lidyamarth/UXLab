"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { getUserSimulationHistory } from '../../lib/firestore';

const UserDashboard = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen && user) {
        setLoading(true);
        const simulationHistory = await getUserSimulationHistory(user.uid);
        setHistory(simulationHistory);
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, user]);

  if (!isOpen) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, color: 'white'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a', borderRadius: '20px', padding: '40px',
        width: '90%', maxWidth: '600px', border: '1px solid #333',
        maxHeight: '80vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dashboard Pengguna</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#888',
            fontSize: '24px', cursor: 'pointer'
          }}>
            ×
          </button>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', color: '#8eb940', marginBottom: '8px' }}>Informasi Akun</h3>
          <p>Email: {user?.email}</p>
        </div>

        <div>
          <h3 style={{ fontSize: '18px', color: '#8eb940', marginBottom: '16px' }}>Riwayat Simulasi</h3>
          {loading ? (
            <p>Memuat riwayat...</p>
          ) : history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.map((item) => (
                <div key={item.id} style={{
                  background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px',
                  padding: '16px', border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <p style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{item.lawId}</p>
                  {item.reactionTime && <p>Waktu Reaksi: {item.reactionTime} ms</p>}
                  {item.gameMode && <p>Mode: {item.gameMode}</p>}
                  <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '8px' }}>
                    {new Date(item.timestamp).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>Anda belum menyelesaikan simulasi apapun.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;