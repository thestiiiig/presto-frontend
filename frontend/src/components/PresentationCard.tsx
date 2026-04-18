import { Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface PresentationCardProps {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  slideCount: number;
}

function PresentationCard({ id, name, description, thumbnail, slideCount }: PresentationCardProps) {
  const navigate = useNavigate();
  
  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      overflow="hidden"
      cursor="pointer"
      w="100%"
      minW="100px"
      onClick={() => navigate(`/presentation/${id}`)}
    >
      {/* Thumbnail - 2:1 ratio */}
      <Box
        w="100%"
        paddingTop="50%"
        position="relative"
        bg="gray.200"
        backgroundImage={thumbnail ? `url(${thumbnail})` : undefined}
        backgroundSize="cover"
        backgroundPosition="center"
      />

      {/* Card info */}
      <Box p={3}>
        <Text fontWeight="bold" fontSize="sm" truncate>
          {name}
        </Text>
        {description && (
          <Text fontSize="xs" color="gray.500" mt={1} truncate>
            {description}
          </Text>
        )}
        <Text fontSize="xs" color="gray.400" mt={1}>
          {slideCount} {slideCount === 1 ? 'slide' : 'slides'}
        </Text>
      </Box>
    </Box>
  );
}

export default PresentationCard;