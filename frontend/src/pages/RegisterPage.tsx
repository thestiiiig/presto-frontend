import { BACKEND_URL } from '../config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { KeyboardEvent } from 'react';
import ErrorPopup from '../components/ErrorPopup';
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Text,
  VStack
} from '@chakra-ui/react';

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/admin/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed.');
        return;
      }
      // Store the token for future API calls
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleRegister();
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
          <Heading>Register</Heading>

          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
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
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <Button
            w="full"
            colorPalette="blue"
            onClick={handleRegister}
          >
                        Register
          </Button>

          <Text fontSize="sm">
                        Already have an account?{' '}
            <Text
              as="span"
              color="blue.500"
              cursor="pointer"
              onClick={() => navigate('/login')}
            >
                        Login
            </Text>
          </Text>

        </VStack>
      </Box>
    </Center>
  );
}

export default RegisterPage;