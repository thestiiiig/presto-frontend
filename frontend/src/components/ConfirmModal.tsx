import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg="blackAlpha.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={100}
    >
      <Box
        bg="white"
        borderRadius="xl"
        p={8}
        maxW="400px"
        w="100%"
        textAlign="center"
      >
        <Heading size="md" mb={4}>Are you sure?</Heading>
        <Text color="gray.500" mb={6}>{message}</Text>
        <Flex gap={4} justify="center">
          <Button colorPalette="red" onClick={onConfirm}>
            Yes
          </Button>
          <Button variant="outline" onClick={onCancel}>
            No
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

export default ConfirmModal;