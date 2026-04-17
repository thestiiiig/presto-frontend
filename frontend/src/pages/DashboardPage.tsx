import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      await fetch('http://localhost:5005/admin/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch {
      // Even if the request fails we still logout
    }

    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <header>
        <h1>Presto 🪄</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <main>
        <p>Welcome to your dashboard</p>
      </main>
    </div>
  );
}

export default DashboardPage;