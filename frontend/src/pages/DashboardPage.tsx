import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import ErrorPopup from '../components/ErrorPopup';
import NewPresentationModal from '../components/NewPresentationModal';
import PresentationCard from '../components/PresentationCard';

interface Presentation {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  slides: object[];
}

function DashboardPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [error, setError] = useState('');

  // Fetch presentations on load
  useEffect(() => {
    const fetchPresentations = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5005/store', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        setPresentations((data.store?.presentations || []).reverse());
      } catch {
        setError('Failed to load presentations.');
      }
    };
    fetchPresentations();
  }, []);

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

  const handleCreate = async (name: string, description: string, thumbnail: string) => {
    if (!name.trim()) {
      setError('Presentation name is required.');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      // Get existing store
      const getRes = await fetch('http://localhost:5005/store', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const getData = await getRes.json();
      const existingPresentations = getData.store?.presentations || [];

      const newPresentation: Presentation = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        thumbnail: thumbnail.trim(),
        slides: [{}],
      };

      const updatedPresentations = [...existingPresentations, newPresentation];

      const putRes = await fetch('http://localhost:5005/store', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          store: { presentations: updatedPresentations },
        }),
      });

      if (!putRes.ok) {
        setError('Failed to create presentation.');
        return;
      }

      setPresentations([...updatedPresentations].reverse());
      setShowModal(false);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {error && <ErrorPopup message={error} onClose={() => setError('')} />}
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
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">My Presentations</Heading>
          <Button colorPalette="blue" onClick={() => setShowModal(true)}>
            + New Presentation
          </Button>
        </Flex>

        {presentations.length === 0 ? (
          <Text color="gray.500">No presentations yet. Create one to get started!</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
            {presentations.map((p) => (
              <PresentationCard
                key={p.id}
                id={p.id}
                name={p.name}
                description={p.description}
                thumbnail={p.thumbnail}
                slideCount={p.slides.length}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>

      {showModal && (
        <NewPresentationModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}

    </Box>
  );
}

export default DashboardPage;