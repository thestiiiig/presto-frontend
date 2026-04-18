import { useState } from 'react';
import {
  Box, Button, Flex, Heading, Input, Text, Textarea, VStack,
} from '@chakra-ui/react';

interface AddTextModalProps {
  onClose: () => void;
  onAdd: (text: string, fontSize: number, color: string, width: number, height: number) => void;
  initialValues?: {
    text: string;
    fontSize: number;
    color: string;
    width: number;
    height: number;
  };
}

function AddTextModal({ onClose, onAdd, initialValues }: AddTextModalProps) {
  const [text, setText] = useState(initialValues?.text || '');
  const [fontSize, setFontSize] = useState(String(initialValues?.fontSize || '1'));
  const [color, setColor] = useState(initialValues?.color || '#000000');
  const [width, setWidth] = useState(String(initialValues?.width || '30'));
  const [height, setHeight] = useState(String(initialValues?.height || '20'));

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(
      text,
      parseFloat(fontSize) || 1,
      color,
      parseFloat(width) || 30,
      parseFloat(height) || 20,
    );
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
          <Heading size="md">{initialValues ? 'Edit Text Box' : 'Add Text Box'}</Heading>

          <Box w="full">
            <Text fontSize="sm" color="gray.600" mb={1}>Text content</Text>
            <Textarea
              placeholder="Enter text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Box>

          <Box w="full">
            <Text fontSize="sm" color="gray.600" mb={1}>Font size (em)</Text>
            <Input
              type="number"
              placeholder="e.g. 1.5"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              min="0.1"
              step="0.1"
            />
          </Box>

          <Box w="full">
            <Text fontSize="sm" color="gray.600" mb={1}>Text colour (HEX)</Text>
            <Flex gap={2} align="center">
              <Input
                placeholder="#000000"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: '40px', height: '40px', cursor: 'pointer', border: 'none' }}
              />
            </Flex>
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

export default AddTextModal;
