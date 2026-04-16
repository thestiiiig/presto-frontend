import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');

        try {
            const response = await fetch('http://localhost:5005/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            // store the token for future API calls
            localStorage.setItem('token', data.token);
            navigate('/dashboard')
        } catch {
            setError('Something went wrong. Please try again.');
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') handleLogin();
    };

    return (
        <div className='form-group'>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleLogin}>Login</button>
            <p>
                Don't have an account?{' '}
                <span onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: 'blue' }}>
                Register
                </span>
            </p>
            </div>

    );
}

export default LoginPage;