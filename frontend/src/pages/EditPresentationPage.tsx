import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import ConfirmModal from '../components/ConfirmModal';

interface Presentation {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  slides: object[];
}

function EditPresentationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState('');

    return (
        <Box minH="100vh" bg="gray.50">

            <Flex as="header"
                px={6}
                py={4}
                bg="white"
                boxShadow="sm"
                justify="space-between"
                align="center"
            >
                <Button
                    variant="outline"
                    size="sm"
                    //onClick={() => navigate('/dashboard')}
                    >
                    ← Back
                </Button>
                <Heading /*size="md">{presentation?.name || 'Loading...'} */>  </Heading>
                <Button
                    colorPalette="red"
                    size="sm"
                    //onClick={() => setShowDeleteConfirm(true)}
                    >
                    Delete Presentation
                </Button>

            </Flex>

            <Box p={8}>
                {error && <Text color="red.500">{error}</Text>}
                <Text color="gray.400">Slide editor coming soon...</Text>
            </Box>
        </Box>
    )
}

export default EditPresentationPage;