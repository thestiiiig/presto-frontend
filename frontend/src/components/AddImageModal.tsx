import { useState } from 'react';
import {
  Box, Button, Flex, Heading, Input, Text, VStack,
} from '@chakra-ui/react';

interface AddImageModalProps {
  onClose: () => void;
  onAdd: (src: string, alt: string, width: number, height: number) => void;
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

      </Box>
    </Box>
  );
}

export default AddImageModal;