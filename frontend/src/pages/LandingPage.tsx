import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, Heading, HStack, Text } from '@chakra-ui/react';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Center minH="100vh" bg="gray.50">
      <Box textAlign="center" p={10}>
        <Heading size="2xl" mb={4}>
          Welcome to Presto 🪄
        </Heading>
        <Text fontSize="lg" color="gray.600" mb={8}>
          The lightweight, modern presentation tool.
        </Text>
        <HStack gap={4} justify="center">
          <Button
            colorPalette="blue"
            size="lg"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            colorPalette="blue"
            variant="outline"
            size="lg"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </HStack>
      </Box>
    </Center>
  );
}

export default LandingPage;