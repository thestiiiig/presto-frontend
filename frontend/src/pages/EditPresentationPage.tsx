import { useState, useEffect, useCallback } from "react";
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

interface Slide {
    id: string;
    elements: object[];
    background: string;
}

interface Presentation {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  slides: Slide[];
}

function EditPresentationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [error, setError] = useState('');
    
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
                // new Slide structure
                const migratedSlides: Slide[] = found.slides.map((s, i) => ({
                    id: (s as Slide).id || `slide-${i}-${Date.now()}`,
                    elements: (s as Slide).elements || [],
                    background: (s as Slide).background || '',
                }));
                setPresentation({ ...found, slides: migratedSlides });
            } catch {
                setError('Failed to load presentation.');
            }
        };
        fetchPresentation();
    }, [id]);

    // Save entire presentation back to store
    const savePresentation = async (updated: Presentation) => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5005/store', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const all: Presentation[] = data.store?.presentations || [];
        const updatedAll = all.map((p) => p.id === id ? updated : p);
        await fetch('http://localhost:5005/store', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
            body: JSON.stringify({ store: { presentations: updatedAll } }),
        });
    };

    // Add a new slide at the end
    const handleAddSlide = async () => {
        if (!presentation) return;
        const newSlide: Slide = {
            id: `slide-${Date.now()}`,
            elements: [],
            background: '',
        };
        const updated = {
            ...presentation,
            slides: [...presentation.slides, newSlide],
        };
        try {
            await savePresentation(updated);
            setPresentation(updated);
            // Navigate to the new slide
            setCurrentSlideIndex(updated.slides.length - 1);
        } catch {
            setError('Failed to add slide.');
        }
    };

    // Keyboard navigation 
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!presentation) return;
        if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
            setCurrentSlideIndex((prev) => prev - 1);
        }
        if (e.key === 'ArrowRight' && currentSlideIndex < presentation.slides.length - 1) {
            setCurrentSlideIndex((prev) => prev + 1);
        }
    }, [currentSlideIndex, presentation]);

    // Attach and detach keyboard listener
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

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
        if (!presentation) return;
        const updated = { ...presentation, name: newName, thumbnail: newThumbnail };
        try {
            await savePresentation(updated);
            setPresentation(updated);
            setShowEditModal(false);
        } catch {
            setError('Failed to update presentation.');
        }
    }

    const handleDeleteSlide = async () => {
        if (!presentation) return;

        // Only slide — show error
        if (presentation.slides.length === 1) {
            setError('Cannot delete the only slide. Delete the presentation instead.');
            return;
        }

        const updatedSlides = presentation.slides.filter((_, i) => i !== currentSlideIndex);
        const updated = { ...presentation, slides: updatedSlides };

        try {
            await savePresentation(updated);
            setPresentation(updated);
            // Go to previous slide if possible, otherwise stay at 0
            setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } catch {
            setError('Failed to delete slide.');
        }
        };

    const currentSlide = presentation?.slides[currentSlideIndex];
    const totalSlides = presentation?.slides.length || 0;
    const isFirst = currentSlideIndex === 0;
    const isLast = currentSlideIndex === totalSlides - 1;

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
        {error && <Text color="red.500" mb={4}>{error}</Text>}

        {/* Slide canvas - 16:9 ratio using paddingTop trick */}
        <Box
          position="relative"
          w="100%"
          paddingTop="56.25%"
          bg={currentSlide?.background || 'white'}
          borderRadius="lg"
          boxShadow="md"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
        >
          {/* Inner content sits inside absolute box to fill canvas */}
          <Box
            position="absolute"
            inset={0}
          >
            {/* Slide number - bottom left */}
            <Text
              position="absolute"
              bottom={3}
              left={3}
              fontSize="sm"
              color="gray.400"
            >
              {currentSlideIndex + 1}
            </Text>
          </Box>
        </Box>

        {/* Controls below canvas */}
        <Flex justify="center" align="center" gap={4} mt={4}>
            {/* Left group - navigation */}
            <Flex gap={4} align="center">
                <Button
                onClick={() => setCurrentSlideIndex((prev) => prev - 1)}
                disabled={isFirst}
                colorPalette={isFirst ? 'gray' : 'blue'}
                variant={isFirst ? 'outline' : 'solid'}
                size="sm"
                >
                ‹
                </Button>
                <Button
                onClick={handleAddSlide}
                colorPalette="blue"
                size="sm"
                >
                +
                </Button>
                <Button
                onClick={() => setCurrentSlideIndex((prev) => prev + 1)}
                disabled={isLast}
                colorPalette={isLast ? 'gray' : 'blue'}
                variant={isLast ? 'outline' : 'solid'}
                size="sm"
                >
                ›
                </Button>
            </Flex>

            {/* Right group - destructive action */}
            <Button
                colorPalette="red"
                variant="outline"
                size="sm"
                onClick={handleDeleteSlide}
            >
                🗑 Delete Slide
            </Button>
        </Flex>

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