import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';

interface EditPresentationModalProps {
  initialName: string;
  initialThumbnail: string;
  onClose: () => void;
  onSave: (name: string, thumbnail: string) => void;
}

function EditPresentationModal({ initialName, initialThumbnail, onClose, onSave }: EditPresentationModalProps) {
  const [name, setName] = useState(initialName);
  const [thumbnail, setThumbnail] = useState(initialThumbnail);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name, thumbnail);
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
          <Heading size="md">Edit Presentation</Heading>
          <Input
            placeholder="Presentation name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Thumbnail URL (optional)"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />
          <Flex gap={3} w="full">
            <Button
              colorPalette="blue"
              onClick={handleSave}
            >
              Save
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

export default EditPresentationModal;