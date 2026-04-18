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

      </Box>
    </Box>
  );
}

export default EditPresentationModal;