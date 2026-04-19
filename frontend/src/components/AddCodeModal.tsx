import { useState } from 'react';
import {
  Box, Button, Flex, Heading, Input, Text, Textarea, VStack,
} from '@chakra-ui/react';

interface AddCodeModalProps {
  onClose: () => void;
  onAdd: (code: string, fontSize: number, width: number, height: number) => void;
  initialValues?: {
    code: string;
    fontSize: number;
    width: number;
    height: number;
  };
}

function AddCodeModal({ onClose, onAdd, initialValues }: AddCodeModalProps) {
  const [code, setCode] = useState(initialValues?.code || '');
  const [fontSize, setFontSize] = useState(String(initialValues?.fontSize || '1'));
  const [width, setWidth] = useState(String(initialValues?.width || '50'));
  const [height, setHeight] = useState(String(initialValues?.height || '30'));
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!code.trim()) {
      setError('Please enter some code.');
      return;
    }
    onAdd(code, parseFloat(fontSize) || 1, parseFloat(width) || 50, parseFloat(height) || 30);
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
          <Heading size="md">{initialValues ? 'Edit Code Block' : 'Add Code Block'}</Heading>

          {error && <Text color="red.500" fontSize="sm">{error}</Text>}

          <Box w="full">
            <Text fontSize="sm" color="gray.600" mb={1}>Code</Text>
            <Textarea
              placeholder="Enter your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fontFamily="monospace"
              rows={8}
            />
          </Box>

          <Box w="full">
            <Text fontSize="sm" color="gray.600" mb={1}>Font size (em)</Text>
            <Input
              type="number"
              placeholder="e.g. 1"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              min="0.1"
              step="0.1"
            />
          </Box>

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

export default AddCodeModal;