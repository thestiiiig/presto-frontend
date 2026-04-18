import {
  Box,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

function ErrorPopup({ message, onClose }: ErrorPopupProps) {
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
        maxW="380px"
        mx={4}
      >
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontWeight="bold" color="red.500">Error</Text>
          <Button
            size="xs"
            variant="ghost"
            onClick={onClose}
            aria-label="Close error"
          >
            ✕
          </Button>
        </Flex>
        <Text fontSize="sm" color="gray.700">{message}</Text>
      </Box>
    </Box>
  );
}

export default ErrorPopup;