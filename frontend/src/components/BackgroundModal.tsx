import { useState } from 'react';
import type { ChangeEvent } from 'react';

import {
  Box, Button, Flex, Heading, Input, Text, VStack,
} from '@chakra-ui/react';

interface BackgroundModalProps {
    currentBackground: string;
    defaultBackground: string;
    onClose: () => void;
    onApplyToSlide: (background: string) => void;
    onApplyAsDefault: (background: string) => void;
}

type BackgroundType = 'solid' | 'gradient' | 'image';

function BackgroundModal({
  currentBackground, defaultBackground, onClose, onApplyToSlide, onApplyAsDefault,
}: BackgroundModalProps) {
  const [bgType, setBgType] = useState<BackgroundType>('solid');
  const [solidColor, setSolidColor] = useState('#ffffff');
  const [gradientFrom, setGradientFrom] = useState('#ffffff');
  const [gradientTo, setGradientTo] = useState('#000000');
  const [imageUrl, setImageUrl] = useState('');

  const getBackground = () => {
    if (bgType === 'solid') return solidColor;
    if (bgType === 'gradient') return `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`;
    if (bgType === 'image') return `url(${imageUrl})`;
    return '#ffffff';
  };
  const preview = getBackground();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
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
      <Box bg="white" borderRadius="xl" boxShadow="lg" p={6} w="100%" maxW="480px" mx={4}>
        <VStack gap={4}>
          <Heading size="md">Background Settings</Heading>
          <Box w="full">
            <Text fontSize="sm" color="gray.600" mb={1}>Background type</Text>
            <Flex gap={2}>
              {(['solid', 'gradient', 'image'] as BackgroundType[]).map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant={bgType === type ? 'solid' : 'outline'}
                  colorPalette="blue"
                  onClick={() => setBgType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </Flex>
          </Box>
          {bgType === 'solid' && (
            <Box w="full">
              <Text fontSize="sm" color="gray.600" mb={1}>Colour</Text>
              <Flex gap={2} align="center">
                <Input
                  placeholder="#ffffff"
                  value={solidColor}
                  onChange={(e) => setSolidColor(e.target.value)}
                />
                <input
                  type="color"
                  value={solidColor}
                  onChange={(e) => setSolidColor(e.target.value)}
                  style={{ width: '40px', height: '40px', cursor: 'pointer', border: 'none' }}
                />
              </Flex>
            </Box>
          )}
          {bgType === 'gradient' && (
            <Flex gap={4} w="full">
              <Box flex={1}>
                <Text fontSize="sm" color="gray.600" mb={1}>From</Text>
                <Flex gap={2} align="center">
                  <Input
                    placeholder="#ffffff"
                    value={gradientFrom}
                    onChange={(e) => setGradientFrom(e.target.value)}
                  />
                  <input
                    type="color"
                    value={gradientFrom}
                    onChange={(e) => setGradientFrom(e.target.value)}
                    style={{ width: '40px', height: '40px', cursor: 'pointer', border: 'none' }}
                  />
                </Flex>
              </Box>
              <Box flex={1}>
                <Text fontSize="sm" color="gray.600" mb={1}>To</Text>
                <Flex gap={2} align="center">
                  <Input
                    placeholder="#000000"
                    value={gradientTo}
                    onChange={(e) => setGradientTo(e.target.value)}
                  />
                  <input
                    type="color"
                    value={gradientTo}
                    onChange={(e) => setGradientTo(e.target.value)}
                    style={{ width: '40px', height: '40px', cursor: 'pointer', border: 'none' }}
                  />
                </Flex>
              </Box>
            </Flex>
          )}
          {bgType === 'image' && (
            <Box w="full">
              <Text fontSize="sm" color="gray.600" mb={1}>Image URL</Text>
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl.startsWith('data:') ? '' : imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Flex align="center" w="full" gap={2} my={2}>
                <Box flex={1} h="1px" bg="gray.200" />
                <Text fontSize="xs" color="gray.400">OR</Text>
                <Box flex={1} h="1px" bg="gray.200" />
              </Flex>
              <Text fontSize="sm" color="gray.600" mb={1}>Upload from device</Text>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ width: '100%' }}
              />
            </Box>
          )}
          <Box w="full">
            <Text fontSize="sm" color="gray.600" mb={1}>Preview</Text>
            <Box
              w="100%"
              h="100px"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              style={{
                background: preview,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Box>
          <Box w="full" bg="gray.50" borderRadius="md" p={3}>
            <Text fontSize="xs" color="gray.500">Current slide background:</Text>
            <Box overflowX="auto" whiteSpace="nowrap" mb={2}>
              <Text fontSize="xs" fontWeight="bold">
                {currentBackground || 'default'}
              </Text>
            </Box>
            <Text fontSize="xs" color="gray.500">Default background:</Text>
            <Box overflowX="auto" whiteSpace="nowrap">
              <Text fontSize="xs" fontWeight="bold">
                {defaultBackground || 'white'}
              </Text>
            </Box>
          </Box>
          <Flex gap={3} w="full" direction="column">
            <Button colorPalette="blue" onClick={() => onApplyToSlide(preview)}>
                            Apply to this slide only
            </Button>
            <Button colorPalette="purple" onClick={() => onApplyAsDefault(preview)}>
                            Set as default for all slides
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

export default BackgroundModal;
