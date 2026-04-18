import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';

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
    <Box minH="100vh" bg="gray.50">
      <Flex
        as="header"
        px={6}
        py={4}
        bg="white"
        boxShadow="sm"
        justify="space-between"
        align="center"
      >
        <Heading size="md">Presto 🪄</Heading>
        <Button
          colorPalette="red"
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Flex>

      <Box as="main" p={8}>
        <Text color="gray.600">Welcome to your dashboard</Text>
      </Box>
    </Box>
  );
}

export default DashboardPage;