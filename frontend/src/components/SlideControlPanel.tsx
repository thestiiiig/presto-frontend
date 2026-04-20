import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';

interface Slide {
  id: string;
  background: string;
}

interface SlideControlPanelProps {
  slides: Slide[];
  currentSlideIndex: number;
  defaultBackground: string;
  onSelectSlide: (index: number) => void;
  onClose: () => void;
}

function SlideControlPanel({
  slides, currentSlideIndex, defaultBackground, onSelectSlide, onClose,
}: SlideControlPanelProps) {
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
        maxW="600px"
        mx={4}
        maxH="80vh"
        display="flex"
        flexDirection="column"
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Slides</Heading>
          <Button size="sm" variant="outline" onClick={onClose}>✕ Close</Button>
        </Flex>

        <Box overflowY="auto" flex={1}>
          <Flex wrap="wrap" gap={4}>
            {slides.map((slide, index) => (
              <Box
                key={slide.id}
                w="160px"
                cursor="pointer"
                borderRadius="md"
                border="2px solid"
                borderColor={index === currentSlideIndex ? 'blue.500' : 'gray.200'}
                overflow="hidden"
                onClick={() => {
                  onSelectSlide(index);
                  onClose();
                }}
                _hover={{ borderColor: 'blue.300' }}
              >
                {/* Slide thumbnail - 16:9 ratio */}
                <Box
                  w="100%"
                  paddingTop="56.25%"
                  position="relative"
                  style={{
                    background: slide.background || defaultBackground || 'white',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <Box p={2} bg="white">
                  <Text fontSize="xs" color="gray.600" fontWeight="medium">
                    Slide {index + 1}
                  </Text>
                </Box>
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

export default SlideControlPanel;