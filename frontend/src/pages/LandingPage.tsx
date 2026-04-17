import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to Presto 🪄</h1>
      <p>The lightweight, modern presentation tool.</p>
      <Button onClick={() => navigate('/login')}>Login</Button>
      <Button onClick={() => navigate('/register')}>Register</Button>
    </div>
  );
}

export default LandingPage;