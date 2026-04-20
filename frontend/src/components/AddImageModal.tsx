import { useState } from 'react';
import type { ChangeEvent } from 'react';
import {
  Box, Button, Flex, Heading, Input, Text, VStack,
} from '@chakra-ui/react';

interface AddImageModalProps {
  onClose: () => void;
  onAdd: (_src: string, _alt: string, _width: number, _height: number) => void;
  initialValues?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

function AddImageModal({ onClose, onAdd, initialValues }: AddImageModalProps) {
  const [src, setSrc] = useState(initialValues?.src || '');
  const [alt, setAlt] = useState(initialValues?.alt || '');
  const [width, setWidth] = useState(String(initialValues?.width || '30'));
  const [height, setHeight] = useState(String(initialValues?.height || '20'));
  const [error, setError] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!src.trim()) {
      setError('Please provide an image URL or upload a file.');
      return;
    }
    onAdd(src, alt, parseFloat(width) || 30, parseFloat(height) || 20);
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
          <Heading size="md">{initialValues ? 'Edit Image' : 'Add Image'}</Heading>

          {error && <Text color="red.500" fontSize="sm">{error}</Text>}

          <Box w="full">
            <Text fontSize="sm" color="gray.600" mb={1}>Image URL</Text>
            <Input
              placeholder="https://example.com/image.png"
              value={src.startsWith('data:') ? '' : src}
              onChange={(e) => setSrc(e.target.value)}
            />
          </Box>

          <Flex align="center" w="full" gap={2}>
            <Box flex={1} h="1px" bg="gray.200" />
            <Text fontSize="xs" color="gray.400">OR</Text>
            <Box flex={1} h="1px" bg="gray.200" />
          </Flex>

          <Box w="full">
            <Text fontSize="sm" color="gray.600" mb={1}>Upload from device</Text>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ width: '100%' }}
            />
          </Box>

          {src && (
            <Box w="full">
              <Text fontSize="sm" color="gray.600" mb={1}>Preview</Text>
              <Box
                w="100%"
                h="120px"
                bg="gray.100"
                borderRadius="md"
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <img
                  src={src}
                  alt="preview"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </Box>
            </Box>
          )}

          <Box w="full">
            <Text fontSize="sm" color="gray.600" mb={1}>Alt text (description)</Text>
            <Input
              placeholder="e.g. A photo of a sunset"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
          </Box>

          <Flex gap={4} w="full">
            <Box flex={1}>
              <Text fontSize="sm" color="gray.600" mb={1}>Width (%)</Text>
              <Input
                type="number"
                placeholder="e.g. 30"
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
                placeholder="e.g. 20"
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

export default AddImageModal;