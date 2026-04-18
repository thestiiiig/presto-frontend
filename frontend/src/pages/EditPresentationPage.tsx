import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import ConfirmModal from '../components/ConfirmModal';
import EditPresentationModal from '../components/EditPresentationModal';

interface Presentation {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  slides: object[];
}

function EditPresentationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    
    // Fetch the specific presentation on load
    useEffect(() => {
        const fetchPresentation = async () => {
            const token = localStorage.getItem('token');
            try {
                    const res = await fetch('http://localhost:5005/store', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                const all: Presentation[] = data.store?.presentations || [];
                const found = all.find((p) => p.id === id);
                if (!found) {
                    setError('Presentation not found.');
                    return;
                }
                setPresentation(found);
            } catch {
                setError('Failed to load presentation.');
            }
        };
        fetchPresentation();
    }, [id]);

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5005/store', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            const all: Presentation[] = data.store?.presentations || [];
            const updated = all.filter((p) => p.id !== id);

            await fetch('http://localhost:5005/store', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ store: { presentations: updated } }),
            });

            navigate('/dashboard');
        } catch {
            setError('Failed to delete presentation.');
        }
    };

    const handleEditSave = async (newName: string, newThumbnail: string) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5005/store', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            const all: Presentation[] = data.store?.presentations || [];

            // Update just this presentation's name and thumbnail
            const updated = all.map((p) =>
                p.id === id ? { ...p, name: newName, thumbnail: newThumbnail } : p
            );

            await fetch('http://localhost:5005/store', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ store: { presentations: updated } }),
            });

            // Update local state so header reflects new name immediately
            setPresentation((prev) =>
                prev ? { ...prev, name: newName, thumbnail: newThumbnail } : prev
            );
            setShowEditModal(false);
        } catch {
            setError('Failed to update presentation.');
        }
    }

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
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
        >
          ← Back
        </Button>
        <Heading 
            size="md"
            cursor="pointer"
            onClick={() => setShowEditModal(true)}
        >
          {presentation?.name || 'Loading...'} ✏️
        </Heading>
        <Button
          colorPalette="red"
          size="sm"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete Presentation
        </Button>
      </Flex>

      <Box p={8}>
        {error && <Text color="red.500">{error}</Text>}
        <Text color="gray.400">Slide editor coming soon...</Text>
      </Box>

      {showDeleteConfirm && (
        <ConfirmModal
        message="This will permanently delete the presentation."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      {showEditModal && presentation && (
        <EditPresentationModal
            initialName={presentation.name}
            initialThumbnail={presentation.thumbnail}
            onClose={() => setShowEditModal(false)}
            onSave={handleEditSave}
        />
      )}

    </Box>
  );
}

export default EditPresentationPage;