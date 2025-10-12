import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';

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
            await signInWithGoogle();
            onClose(); 
        } catch (error) {
            setError("Gagal login dengan Google. Silakan coba lagi.");
            console.error(error);
        }
    };

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
                maxWidth: '400px',
                width: '90%',
                border: '1px solid #333'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {isLogin ? 'Masuk' : 'Daftar'}
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

                {error && (
                    <div style={{
                        backgroundColor: '#ff4444',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #555',
                                backgroundColor: '#111',
                                color: 'white',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #555',
                                backgroundColor: '#111',
                                color: 'white',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    {!isLogin && (
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Konfirmasi Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #555',
                                    backgroundColor: '#111',
                                    color: 'white',
                                    fontSize: '16px'
                                }}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor: loading ? '#666' : '#8eb940',
                            color: loading ? '#999' : '#000',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer'
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
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#fff', 
                        color: '#000',
                        border: '1px solid #555', 
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px' 
                    }}
                >
                    <svg className="w-5 h-5" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" style={{height: '20px', width: '20px'}}>
                        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 256S109.8 0 244 0c73 0 134.3 29.3 179.8 74.4L373.3 125.7C341.3 97.4 297.8 77.6 244 77.6c-94.2 0-170.9 76.7-170.9 170.9s76.7 170.9 170.9 170.9c98.2 0 150-70.2 155-108.2H244v-62h238.3c2.6 13.2 4.7 26.6 4.7 41.2z"></path>
                    </svg>
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
                            background: 'none',
                            border: 'none',
                            color: '#8eb940',
                            cursor: 'pointer',
                            fontSize: '14px',
                            textDecoration: 'underline'
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