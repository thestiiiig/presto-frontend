import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import ConfirmModal from '../components/ConfirmModal';
import EditPresentationModal from '../components/EditPresentationModal';
import AddTextModal from "../components/AddTextModal";
import TextElement from '../components/TextElement';
import AddImageModal from "../components/AddImageModal";
import ImageElement from "../components/ImageElement";
import AddVideoModal from '../components/AddVideoModal';
import VideoElement from '../components/VideoElement';
import AddCodeModal from "../components/AddCodeModal";
import CodeElement from "../components/CodeElement";
import DraggableElement from "../components/DraggableElement";
import BackgroundModal from '../components/BackgroundModal';
import SlideControlPanel from '../components/SlideControlPanel';

interface TextElementData {
    id: string;
    type: 'text';
    text: string;
    fontSize: number;
    color: string;
    fontFamily: string;
    width: number;
    height: number;
    x: number;
    y: number;
    zIndex: number;
}

interface ImageElementData {
    id: string;
    type: 'image';
    src: string;
    alt: string;
    width: number;
    height: number;
    x: number;
    y: number;
    zIndex: number;
}

interface VideoElementData {
  id: string;
  type: 'video';
  url: string;
  autoplay: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
}

interface CodeElementData {
  id: string;
  type: 'code';
  code: string;
  fontSize: number;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
}

type SlideElement = TextElementData | ImageElementData | VideoElementData | CodeElementData;

interface Slide {
    id: string;
    elements: SlideElement[];
    background: string;
    isCustomBackground: boolean;
}

interface Presentation {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    slides: Slide[];
    defaultBackground: string;
}

function EditPresentationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteSlideConfirm, setShowDeleteSlideConfirm] = useState(false);
  const [showAddText, setShowAddText] = useState(false);
  const [editingElement, setEditingElement] = useState<{ id: string; type: 'text' } | null>(null);
  const [showAddImage, setShowAddImage] = useState(false);
  const [editingImageElement, setEditingImageElement] = useState<{ id: string; type: 'image' } | null>(null);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [editingVideoElement, setEditingVideoElement] = useState<{ id: string; type: 'video' } | null>(null);
  const [showAddCode, setShowAddCode] = useState(false);
  const [editingCodeElement, setEditingCodeElement] = useState<{ id: string; type: 'code' } | null>(null);
  const [error, setError] = useState('');
  const slideRef = useRef<HTMLDivElement>(null);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [showSlidePanel, setShowSlidePanel] = useState(false);

  // Fetch the specific presentation on load
  useEffect(() => {
    const fetchPresentation = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5005/store', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const all: Presentation[] = data.store?.presentations || [];
        const found = all.find((p) => p.id === id);
        if (!found) {
          setError('Presentation not found.');
          return;
        }
        // new Slide structure
        const migratedSlides: Slide[] = found.slides.map((s, i) => ({
          id: (s as Slide).id || `slide-${i}-${Date.now()}`,
          elements: (s as Slide).elements || [],
          background: (s as Slide).background || '',
          isCustomBackground: (s as Slide).isCustomBackground || false,
        }));
        setPresentation({ ...found, slides: migratedSlides });
      } catch {
        setError('Failed to load presentation.');
      }
    };
    fetchPresentation();
  }, [id]);

  // Save entire presentation back to store
  const savePresentation = async (updated: Presentation) => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5005/store', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const all: Presentation[] = data.store?.presentations || [];
    const updatedAll = all.map((p) => p.id === id ? updated : p);
    await fetch('http://localhost:5005/store', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ store: { presentations: updatedAll } }),
    });
  };

  // Add a new slide at the end
  const handleAddSlide = async () => {
    if (!presentation) return;
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      elements: [],
      background: presentation.defaultBackground || '',
      isCustomBackground: false,
    };
    const updated = {
      ...presentation,
      slides: [...presentation.slides, newSlide],
    };
    try {
      await savePresentation(updated);
      setPresentation(updated);
      // Navigate to the new slide
      setCurrentSlideIndex(updated.slides.length - 1);
    } catch {
      setError('Failed to add slide.');
    }
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!presentation) return;
    if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
    if (e.key === 'ArrowRight' && currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  }, [currentSlideIndex, presentation]);

  // Attach and detach keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5005/store', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const all: Presentation[] = data.store?.presentations || [];
      const updated = all.filter((p) => p.id !== id);

      await fetch('http://localhost:5005/store', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ store: { presentations: updated } }),
      });

      navigate('/dashboard');
    } catch {
      setError('Failed to delete presentation.');
    }
  };

  const handleEditSave = async (newName: string, newThumbnail: string) => {
    if (!presentation) return;
    const updated = { ...presentation, name: newName, thumbnail: newThumbnail };
    try {
      await savePresentation(updated);
      setPresentation(updated);
      setShowEditModal(false);
    } catch {
      setError('Failed to update presentation.');
    }
  }

  const handleDeleteSlide = async () => {
    if (!presentation) return;
    const updatedSlides = presentation.slides.filter((_, i) => i !== currentSlideIndex);
    const updated = { ...presentation, slides: updatedSlides };
    try {
      await savePresentation(updated);
      setPresentation(updated);
      setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } catch {
      setError('Failed to delete slide.');
    }
  };

  const handleAddText = async (text: string, fontSize: number, color: string, fontFamily: string, width: number, height: number) => {
    if (!presentation) return;
    const currentSlide = presentation.slides[currentSlideIndex];
    const newElement: TextElementData = {
      id: `text-${Date.now()}`,
      type: 'text',
      text,
      fontSize,
      color,
      fontFamily,
      width,
      height,
      x: 0,
      y: 0,
      zIndex: currentSlide.elements.length + 1,
    };
    const updatedSlides = presentation.slides.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    );
    const updated = { ...presentation, slides: updatedSlides };
    try {
      await savePresentation(updated);
      setPresentation(updated);
      setShowAddText(false);
    } catch {
      setError('Failed to add text element.');
    }
  };

  const handleAddImage = async (src: string, alt: string, width: number, height: number) => {
    if (!presentation) return;
    const currentSlide = presentation.slides[currentSlideIndex];
    const newElement: ImageElementData = {
      id: `image-${Date.now()}`,
      type: 'image',
      src,
      alt,
      width,
      height,
      x: 0,
      y: 0,
      zIndex: currentSlide.elements.length + 1,
    };
    const updatedSlides = presentation.slides.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    );
    const updated = { ...presentation, slides: updatedSlides };
    try {
      await savePresentation(updated);
      setPresentation(updated);
      setShowAddImage(false);
    } catch {
      setError('Failed to add image element.');
    }
  };
  const handleSaveImageEdit = async (src: string, alt: string, width: number, height: number) => {
    if (!presentation || !editingImageElement) return;
    const updatedSlides = presentation.slides.map((slide, i) =>
      i === currentSlideIndex
        ? {
          ...slide,
          elements: slide.elements.map((el) =>
            el.id === editingImageElement.id
              ? { ...el, src, alt, width, height }
              : el
          ),
        }
        : slide
    );
    const updated = { ...presentation, slides: updatedSlides };
    try {
      await savePresentation(updated);
      setPresentation(updated);
      setShowAddImage(false);
      setEditingImageElement(null);
    } catch {
      setError('Failed to update image element.');
    }
  };

  const handleAddVideo = async (url: string, autoplay: boolean, width: number, height: number) => {
    if (!presentation) return;
    const currentSlide = presentation.slides[currentSlideIndex];
    const newElement: VideoElementData = {
      id: `video-${Date.now()}`,
      type: 'video',
      url,
      autoplay,
      width,
      height,
      x: 0,
      y: 0,
      zIndex: currentSlide.elements.length + 1,
    };
    const updatedSlides = presentation.slides.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    );
    const updated = { ...presentation, slides: updatedSlides };
    try {
      await savePresentation(updated);
      setPresentation(updated);
      setShowAddVideo(false);
    } catch {
      setError('Failed to add video element.');
    }
  };

  const handleSaveVideoEdit = async (url: string, autoplay: boolean, width: number, height: number) => {
    if (!presentation || !editingVideoElement) return;
    const updatedSlides = presentation.slides.map((slide, i) =>
      i === currentSlideIndex
        ? {
          ...slide,
          elements: slide.elements.map((el) =>
            el.id === editingVideoElement.id
              ? { ...el, url, autoplay, width, height }
              : el
          ),
        }
        : slide
    );
    const updated = { ...presentation, slides: updatedSlides };
    try {
      await savePresentation(updated);
      setPresentation(updated);
      setShowAddVideo(false);
      setEditingVideoElement(null);
    } catch {
      setError('Failed to update video element.');
    }
  };

  const handleAddCode = async (code: string, fontSize: number, width: number, height: number) => {
    if (!presentation) return;
    const currentSlide = presentation.slides[currentSlideIndex];
    const newElement: CodeElementData = {
      id: `code-${Date.now()}`,
      type: 'code',
      code,
      fontSize,
      width,
      height,
      x: 0,
      y: 0,
      zIndex: currentSlide.elements.length + 1,
    };
    const updatedSlides = presentation.slides.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    );
    const updated = { ...presentation, slides: updatedSlides };
    try {
      await savePresentation(updated);
      setPresentation(updated);
      setShowAddCode(false);
    } catch {
      setError('Failed to add code element.');
    }
  };

  const handleSaveCodeEdit = async (code: string, fontSize: number, width: number, height: number) => {
    if (!presentation || !editingCodeElement) return;
    const updatedSlides = presentation.slides.map((slide, i) =>
      i === currentSlideIndex
        ? {
          ...slide,
          elements: slide.elements.map((el) =>
            el.id === editingCodeElement.id
              ? { ...el, code, fontSize, width, height }
              : el
          ),
        }
        : slide
    );
    const updated = { ...presentation, slides: updatedSlides };
    try {
      await savePresentation(updated);
      setPresentation(updated);
      setShowAddCode(false);
      setEditingCodeElement(null);
    } catch {
      setError('Failed to update code element.');
    }
  };

  const handleDeleteElement = async (elementId: string) => {
    if (!presentation) return;
    const updatedSlides = presentation.slides.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, elements: slide.elements.filter((el) => el.id !== elementId) }
        : slide
    );
    const updated = { ...presentation, slides: updatedSlides };
    try {
      await savePresentation(updated);
      setPresentation(updated);
    } catch {
      setError('Failed to delete element.');
    }
  };

  const handleEditElement = (elementId: string) => {
    const el = presentation?.slides[currentSlideIndex]?.elements.find(
      (e) => e.id === elementId
    );
    if (!el) return;
    if (el.type === 'text') {
      setEditingElement({ id: elementId, type: 'text' });
      setShowAddText(true);
    } else if (el.type === 'image') {
      setEditingImageElement({ id: elementId, type: 'image' });
      setShowAddImage(true);
    } else if (el.type === 'video') {
      setEditingVideoElement({ id: elementId, type: 'video' });
      setShowAddVideo(true);
    } else if (el.type === 'code') {
      setEditingCodeElement({ id: elementId, type: 'code' });
      setShowAddCode(true);
    }
  };

  const handleSaveTextEdit = async (
    text: string, fontSize: number, color: string, fontFamily: string, width: number, height: number
  ) => {
    if (!presentation || !editingElement) return;
    const updatedSlides = presentation.slides.map((slide, i) =>
      i === currentSlideIndex
        ? {
          ...slide,
          elements: slide.elements.map((el) =>
            el.id === editingElement.id
              ? { ...el, text, fontSize, color, fontFamily, width, height }
              : el
          ),
        }
        : slide
    );
    const updated = { ...presentation, slides: updatedSlides };
    try {
      await savePresentation(updated);
      setPresentation(updated);
      setShowAddText(false);
      setEditingElement(null);
    } catch {
      setError('Failed to update element.');
    }
  };

  const currentSlide = presentation?.slides[currentSlideIndex];
  const totalSlides = presentation?.slides.length || 0;
  const isFirst = currentSlideIndex === 0;
  const isLast = currentSlideIndex === totalSlides - 1;
  const editingElementData = editingElement
    ? (currentSlide?.elements.find((e) => e.id === editingElement.id) as TextElementData | undefined)
    : undefined;

  const handleMoveElement = async (elementId: string, newX: number, newY: number) => {
    if (!presentation) return;
    const updatedSlides = presentation.slides.map((slide, i) =>
      i === currentSlideIndex
        ? {
          ...slide,
          elements: slide.elements.map((el) =>
            el.id === elementId ? { ...el, x: newX, y: newY } : el
          ),
        }
        : slide
    );
    const updated = { ...presentation, slides: updatedSlides };
    // Update local state immediately for smooth dragging
    setPresentation(updated);
    // Save to backend after move
    try {
      await savePresentation(updated);
    } catch {
      setError('Failed to move element.');
    }
  };

  const handleResizeElement = async (
    elementId: string, newX: number, newY: number, newWidth: number, newHeight: number
  ) => {
    if (!presentation) return;
    const updatedSlides = presentation.slides.map((slide, i) =>
      i === currentSlideIndex
        ? {
          ...slide,
          elements: slide.elements.map((el) =>
            el.id === elementId
              ? { ...el, x: newX, y: newY, width: newWidth, height: newHeight }
              : el
          ),
        }
        : slide
    );
    const updated = { ...presentation, slides: updatedSlides };
    setPresentation(updated);
    try {
      await savePresentation(updated);
    } catch {
      setError('Failed to resize element.');
    }
  };
    // Apply background to current slide only
  const handleApplyBackgroundToSlide = async (background: string) => {
    if (!presentation) return;
    const updatedSlides = presentation.slides.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, background, isCustomBackground: true }
        : slide
    );
    const updated = { ...presentation, slides: updatedSlides };
    try {
      await savePresentation(updated);
      setPresentation(updated);
      setShowBackgroundModal(false);
    } catch {
      setError('Failed to update background.');
    }
  };

  // Set as default — applies to all slides that haven't been individually modified
  const handleApplyDefaultBackground = async (background: string) => {
    if (!presentation) return;
    const updatedSlides = presentation.slides.map((slide) =>
      slide.isCustomBackground
        ? slide
        : { ...slide, background }
    );
    const updated = { ...presentation, slides: updatedSlides, defaultBackground: background };
    try {
      await savePresentation(updated);
      setPresentation(updated);
      setShowBackgroundModal(false);
    } catch {
      setError('Failed to update default background.');
    }
  };
  return (
    <Box minH="100vh" bg="gray.50">

      <Flex
        as="header"
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
          onClick={() => navigate('/dashboard')}
        >
          ← Back
        </Button>
        <Heading
          size="md"
          cursor="pointer"
          onClick={() => setShowEditModal(true)}
        >
          {presentation?.name || 'Loading...'} ✏️
        </Heading>
        <Button
          colorPalette="red"
          size="sm"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete Presentation
        </Button>
      </Flex>

      <Box p={8}>
        {error && <Text color="red.500" mb={4}>{error}</Text>}
        <Flex gap={2} mb={4}>
          <Button
            size="sm"
            colorPalette="blue"
            variant="outline"
            onClick={() => {setEditingElement(null); setShowAddText(true);}}
          >
            + Text
          </Button>

          <Button
            size="sm"
            colorPalette="green"
            variant="outline"
            onClick={() => { setEditingImageElement(null); setShowAddImage(true); }}
          >
            + Image
          </Button>

          <Button
            size="sm"
            colorPalette="purple"
            variant="outline"
            onClick={() => { setEditingVideoElement(null); setShowAddVideo(true); }}
          >
            + Video
          </Button>

          <Button
            size="sm"
            colorPalette="orange"
            variant="outline"
            onClick={() => { setEditingCodeElement(null); setShowAddCode(true); }}
          >
            + Code
          </Button>
          <Button
            size="sm"
            colorPalette="teal"
            variant="outline"
            onClick={() => setShowBackgroundModal(true)}
          >
            🎨 Background
          </Button>
          <Button
            size="sm"
            colorPalette="gray"
            variant="outline"
            onClick={() => setShowSlidePanel(true)}
          >
            🗂 Slide Control Panel
          </Button>
        </Flex>
        {/* Slide canvas - 16:9 ratio using paddingTop trick */}
        <Box
          position="relative"
          w="100%"
          paddingTop="56.25%"
          borderRadius="lg"
          boxShadow="md"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
          style={{
            background: currentSlide?.background || presentation?.defaultBackground || 'white',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Inner content sits inside absolute box to fill canvas */}
          <Box
            ref={slideRef}
            position="absolute"
            inset={0}
          >
            {currentSlide?.elements.map((el) => {
              if (el.type === 'text') {
                const e = el as TextElementData;
                return (
                  <DraggableElement
                    key={e.id}
                    id={e.id}
                    x={e.x}
                    y={e.y}
                    width={e.width}
                    height={e.height}
                    zIndex={e.zIndex}
                    slideRef={slideRef}
                    onMove={handleMoveElement}
                    onResize={handleResizeElement}
                    onDoubleClick={handleEditElement}
                    onRightClick={handleDeleteElement}
                  >
                    <TextElement
                      id={e.id}
                      text={e.text}
                      fontSize={e.fontSize}
                      color={e.color}
                      fontFamily={e.fontFamily}
                      width={e.width}
                      height={e.height}
                      x={0}
                      y={0}
                      zIndex={e.zIndex}
                      onDoubleClick={() => {}}
                      onRightClick={() => {}}
                    />
                  </DraggableElement>
                );
              } else if (el.type === 'image') {
                const e = el as ImageElementData;
                return (
                  <DraggableElement
                    key={e.id}
                    id={e.id}
                    x={e.x}
                    y={e.y}
                    width={e.width}
                    height={e.height}
                    zIndex={e.zIndex}
                    slideRef={slideRef}
                    onMove={handleMoveElement}
                    onResize={handleResizeElement}
                    onDoubleClick={handleEditElement}
                    onRightClick={handleDeleteElement}
                  >
                    <ImageElement
                      id={e.id}
                      src={e.src}
                      alt={e.alt}
                      width={e.width}
                      height={e.height}
                      x={0}
                      y={0}
                      zIndex={e.zIndex}
                      onDoubleClick={() => {}}
                      onRightClick={() => {}}
                    />
                  </DraggableElement>
                );
              } else if (el.type === 'video') {
                const e = el as VideoElementData;
                return (
                  <DraggableElement
                    key={e.id}
                    id={e.id}
                    x={e.x}
                    y={e.y}
                    width={e.width}
                    height={e.height}
                    zIndex={e.zIndex}
                    slideRef={slideRef}
                    onMove={handleMoveElement}
                    onResize={handleResizeElement}
                    onDoubleClick={handleEditElement}
                    onRightClick={handleDeleteElement}
                  >
                    <VideoElement
                      id={e.id}
                      url={e.url}
                      autoplay={e.autoplay}
                      width={e.width}
                      height={e.height}
                      x={0}
                      y={0}
                      zIndex={e.zIndex}
                      onDoubleClick={() => {}}
                      onRightClick={() => {}}
                    />
                  </DraggableElement>
                );
              } else if (el.type === 'code') {
                const e = el as CodeElementData;
                return (
                  <DraggableElement
                    key={e.id}
                    id={e.id}
                    x={e.x}
                    y={e.y}
                    width={e.width}
                    height={e.height}
                    zIndex={e.zIndex}
                    slideRef={slideRef}
                    onMove={handleMoveElement}
                    onResize={handleResizeElement}
                    onDoubleClick={handleEditElement}
                    onRightClick={handleDeleteElement}
                  >
                    <CodeElement
                      id={e.id}
                      code={e.code}
                      fontSize={e.fontSize}
                      width={e.width}
                      height={e.height}
                      x={0}
                      y={0}
                      zIndex={e.zIndex}
                      onDoubleClick={() => {}}
                      onRightClick={() => {}}
                    />
                  </DraggableElement>
                );
              }
            })}
            {/* Slide number - bottom left */}
            <Text
              position="absolute"
              bottom={3}
              left={3}
              fontSize="sm"
              color="gray.400"
            >
              {currentSlideIndex + 1}
            </Text>
          </Box>
        </Box>

        {/* Controls below canvas */}
        <Flex justify="center" align="center" gap={4} mt={4}>
          {/* Left group - navigation */}
          <Flex gap={4} align="center">
            <Button
              onClick={() => setCurrentSlideIndex((prev) => prev - 1)}
              disabled={isFirst}
              colorPalette={isFirst ? 'gray' : 'blue'}
              variant={isFirst ? 'outline' : 'solid'}
              size="sm"
            >
                ‹
            </Button>
            <Button
              onClick={handleAddSlide}
              colorPalette="blue"
              size="sm"
            >
                +
            </Button>
            <Button
              onClick={() => setCurrentSlideIndex((prev) => prev + 1)}
              disabled={isLast}
              colorPalette={isLast ? 'gray' : 'blue'}
              variant={isLast ? 'outline' : 'solid'}
              size="sm"
            >
                ›
            </Button>
          </Flex>

          {/* Right group - destructive action */}
          <Button
            colorPalette="red"
            variant="outline"
            size="sm"
            onClick={() => {
              if (presentation && presentation.slides.length === 1) {
                setError('Cannot delete the only slide. Delete the presentation instead.');
                return;
              }
              setShowDeleteSlideConfirm(true);
            }}
          >
                🗑 Delete Slide
          </Button>
        </Flex>

      </Box>

      {showDeleteConfirm && (
        <ConfirmModal
          message="This will permanently delete the presentation."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      {showEditModal && presentation && (
        <EditPresentationModal
          initialName={presentation.name}
          initialThumbnail={presentation.thumbnail}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
        />
      )}
      {showDeleteSlideConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this slide?"
          onConfirm={() => {
            setShowDeleteSlideConfirm(false);
            handleDeleteSlide();
          }}
          onCancel={() => setShowDeleteSlideConfirm(false)}
        />
      )}

      {showAddText && (
        <AddTextModal
          onClose={() => {setShowAddText(false); setEditingElement(null);}}
          onAdd={editingElement ? handleSaveTextEdit : handleAddText}
          initialValues={editingElementData ? {
            text: editingElementData.text,
            fontSize: editingElementData.fontSize,
            color: editingElementData.color,
            fontFamily: editingElementData.fontFamily,
            width: editingElementData.width,
            height: editingElementData.height,
          } : undefined}
        />
      )}

      {showAddImage && (
        <AddImageModal
          onClose={() => { setShowAddImage(false); setEditingImageElement(null); }}
          onAdd={editingImageElement ? handleSaveImageEdit : handleAddImage}
          initialValues={
            editingImageElement
              ? (() => {
                const e = currentSlide?.elements.find(
                  (el) => el.id === editingImageElement.id
                ) as ImageElementData | undefined;
                return e ? { src: e.src, alt: e.alt, width: e.width, height: e.height } : undefined;
              })()
              : undefined
          }
        />
      )}
      {showAddVideo && (
        <AddVideoModal
          onClose={() => { setShowAddVideo(false); setEditingVideoElement(null); }}
          onAdd={editingVideoElement ? handleSaveVideoEdit : handleAddVideo}
          initialValues={
            editingVideoElement
              ? (() => {
                const e = currentSlide?.elements.find(
                  (el) => el.id === editingVideoElement.id
                ) as VideoElementData | undefined;
                return e ? { url: e.url, autoplay: e.autoplay, width: e.width, height: e.height } : undefined;
              })()
              : undefined
          }
        />
      )}
      {showAddCode && (
        <AddCodeModal
          onClose={() => { setShowAddCode(false); setEditingCodeElement(null); }}
          onAdd={editingCodeElement ? handleSaveCodeEdit : handleAddCode}
          initialValues={
            editingCodeElement
              ? (() => {
                const e = currentSlide?.elements.find(
                  (el) => el.id === editingCodeElement.id
                ) as CodeElementData | undefined;
                return e ? { code: e.code, fontSize: e.fontSize, width: e.width, height: e.height } : undefined;
              })()
              : undefined
          }
        />
      )}
      {showBackgroundModal && (
        <BackgroundModal
          currentBackground={currentSlide?.background || ''}
          defaultBackground={presentation?.defaultBackground || ''}
          onClose={() => setShowBackgroundModal(false)}
          onApplyToSlide={handleApplyBackgroundToSlide}
          onApplyAsDefault={handleApplyDefaultBackground}
        />
      )}
      {showSlidePanel && presentation && (
        <SlideControlPanel
          slides={presentation.slides}
          currentSlideIndex={currentSlideIndex}
          defaultBackground={presentation.defaultBackground || ''}
          onSelectSlide={setCurrentSlideIndex}
          onClose={() => setShowSlidePanel(false)}
        />
      )}
    </Box>
  );
}

export default EditPresentationPage;