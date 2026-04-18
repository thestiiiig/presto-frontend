import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';

interface NewPresentationModalProps {
  onClose: () => void;
  onCreate: (name: string, description: string, thumbnail: string) => void;
}

function NewPresentationModal({ onClose, onCreate }: NewPresentationModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const handleCreate = () => {
    onCreate(name, description, thumbnail);
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
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="lg"
        p={6}
        w="100%"
        maxW="420px"
        mx={4}
      >
        <VStack gap={4}>
          <Heading size="md">New Presentation</Heading>
          <Input
            placeholder="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="Thumbnail URL (optional)"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />
          <Flex gap={3} w="full">
                <Button colorPalette="blue" onClick={handleCreate}>
                Create
                </Button>
                <Button variant="outline" onClick={onClose}>
                Cancel
                </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
}

export default NewPresentationModal;