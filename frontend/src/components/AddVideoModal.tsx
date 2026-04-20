import { useState } from 'react';
import {
  Box, Button, Flex, Heading, Input, Text, VStack,
} from '@chakra-ui/react';

interface AddVideoModalProps {
  onClose: () => void;
  onAdd: (_url: string, _autoplay: boolean, _width: number, _height: number) => void;
  initialValues?: {
    url: string;
    autoplay: boolean;
    width: number;
    height: number;
  };
}

function AddVideoModal({ onClose, onAdd, initialValues }: AddVideoModalProps) {
  const [url, setUrl] = useState(initialValues?.url || '');
  const [autoplay, setAutoplay] = useState(initialValues?.autoplay || false);
  const [width, setWidth] = useState(String(initialValues?.width || '50'));
  const [height, setHeight] = useState(String(initialValues?.height || '30'));
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!url.trim()) {
      setError('Please provide a YouTube embed URL.');
      return;
    }
    if (!url.includes('youtube.com/embed')) {
      setError('Please use a YouTube embed URL e.g. https://www.youtube.com/embed/dQw4w9WgXcQ');
      return;
    }
    onAdd(url, autoplay, parseFloat(width) || 50, parseFloat(height) || 30);
  };

  return (
    <Box
      position="fixed"
      inset={0}
      bg="blackAlpha.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
    >
      <Box bg="white" borderRadius="xl" boxShadow="lg" p={6} w="100%" maxW="420px" mx={4}>
        <VStack gap={4}>
          <Heading size="md">{initialValues ? 'Edit Video' : 'Add Video'}</Heading>

          {error && <Text color="red.500" fontSize="sm">{error}</Text>}

          <Box w="full">
            <Text fontSize="sm" color="gray.600" mb={1}>YouTube Embed URL</Text>
            <Input
              placeholder="https://www.youtube.com/embed/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Box>

          {/* Autoplay checkbox */}
          <Flex w="full" align="center" gap={2}>
            <input
              type="checkbox"
              id="autoplay"
              checked={autoplay}
              onChange={(e) => setAutoplay(e.target.checked)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <Text
              fontSize="sm"
              color="gray.600"
              cursor="pointer"
              onClick={() => setAutoplay((prev) => !prev)}
            >
              Autoplay
            </Text>
          </Flex>

          <Flex gap={4} w="full">
            <Box flex={1}>
              <Text fontSize="sm" color="gray.600" mb={1}>Width (%)</Text>
              <Input
                type="number"
                placeholder="e.g. 50"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                min="1"
                max="100"
              />
            </Box>
            <Box flex={1}>
              <Text fontSize="sm" color="gray.600" mb={1}>Height (%)</Text>
              <Input
                type="number"
                placeholder="e.g. 30"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="1"
                max="100"
              />
            </Box>
          </Flex>

          <Flex gap={3} w="full">
            <Button colorPalette="blue" onClick={handleAdd}>
              {initialValues ? 'Save' : 'Add'}
            </Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
}

export default AddVideoModal;