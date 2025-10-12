import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import Image from "next/image";

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, signup, signInWithGoogle } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isLogin && password !== confirmPassword) {
            return setError('Password tidak cocok');
        }

        try {
            setError('');
            setLoading(true);
            
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            
            onClose();
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            switch (err.code) {
                case 'auth/user-not-found':
                    setError('Email tidak terdaftar.');
                    break;
                case 'auth/wrong-password':
                    setError('Password salah.');
                    break;
                case 'auth/email-already-in-use':
                    setError('Email ini sudah digunakan.');
                    break;
                default:
                    setError('Gagal untuk autentikasi. Coba lagi.');
                    break;
            }
        }
        
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        try {
            setError(''); 
            await signInWithGoogle();
            onClose(); 
        } catch (error) {
            setError("Gagal login dengan Google. Silakan coba lagi.");
            console.error("Google Sign-In Error:", error);
        }
    };

    if (!isOpen) return null;

    const sharedStyles = {
        width: '100%',
        padding: '12px',
        borderRadius: '12px',
        fontSize: '16px',
        border: '1px solid #555',
        boxSizing: 'border-box'
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, color: 'white'
        }}>
            <div style={{
                backgroundColor: '#1a1a1a', borderRadius: '20px', padding: '40px',
                maxWidth: '400px', width: '90%', border: '1px solid #333'
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {isLogin ? 'Masuk' : 'Daftar'}
                    </h2>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', color: '#888',
                        fontSize: '24px', cursor: 'pointer'
                    }}>
                        ×
                    </button>
                </div>  

                {error && (
                    <div style={{
                        backgroundColor: '#ff4444', color: 'white', padding: '12px',
                        borderRadius: '8px', marginBottom: '20px', fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Email</label>
                        <input
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ ...sharedStyles, backgroundColor: '#111', color: 'white' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Password</label>
                        <input
                            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ ...sharedStyles, backgroundColor: '#111', color: 'white' }}
                        />
                    </div>

                    {!isLogin && (
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Konfirmasi Password</label>
                            <input
                                type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{ ...sharedStyles, backgroundColor: '#111', color: 'white' }}
                            />
                        </div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        style={{
                            ...sharedStyles,
                          backgroundColor: '#8eb940',
                          boxShadow: '4px 4px 20px rgba(255,255,255,0.10), inset 0 4px 24px rgba(232,244,98,1), inset 4px 0 24px rgba(232,244,98,1)',
                          color: '#000000', border: '2.5px solid #555', fontSize: '15px',
                          cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Loading...' : (isLogin ? 'Masuk' : 'Daftar')}
                    </button>
                </form>

                <div style={{ margin: '20px 0', textAlign: 'center', color: '#888', fontSize: '14px' }}>
                    Atau
                </div>

                <button
                    onClick={handleGoogleSignIn} 
                    style={{
                        ...sharedStyles,
                        backgroundColor: '#fff', 
                        color: '#000',
                        fontWeight: '400',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px' 
                    }}
                >
                    <Image
                        src="/google.svg" alt="Google logo"
                        width={20} height={20}
                    />
                    Masuk dengan Google
                </button>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setEmail('');
                            setPassword('');
                            setConfirmPassword('');
                        }}
                        style={{
                            background: 'none', border: 'none', color: '#8eb940',
                            cursor: 'pointer', fontSize: '14px', textDecoration: 'underline'
                        }}
                    >
                        {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;