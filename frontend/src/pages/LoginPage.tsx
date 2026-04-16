import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                //onKeyDown={handleKeyDown}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                //onKeyDown={handleKeyDown}
            />
            <button /*onClick={handleLogin}*/>Login</button>
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