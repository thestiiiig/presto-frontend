import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { KeyboardEvent } from 'react';
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Text,
  VStack
} from '@chakra-ui/react';
import ErrorPopup from '../components/ErrorPopup';

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Center minH="100vh" bg="gray.50">
      {error && <ErrorPopup message={error} onClose={() => setError('')} />}
      <Box
        p={8}
        w="100%"
        maxW="400px"
        bg="white"
        borderRadius="xl"
        boxShadow="lg"
      >

        <VStack gap={4}>
          <Heading>Login</Heading>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <Button
            w="full"
            colorPalette="blue"
            onClick={handleLogin}
          >
                        Login
          </Button>

          <Text fontSize="sm">
                        Don&apos;t have an account?{' '}
            <Text
              as="span"
              color="blue.500"
              cursor="pointer"
              onClick={() => navigate('/register')}
            >
                        Register
            </Text>
          </Text>

        </VStack>
      </Box>
    </Center>
  );
}

export default LoginPage;