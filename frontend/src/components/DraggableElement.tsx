import { useRef, useState, useEffect, useCallback } from 'react';
import { Box } from '@chakra-ui/react';

interface DraggableElementProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  slideRef: React.RefObject<HTMLDivElement>;
  onMove: (id: string, newX: number, newY: number) => void;
  onDoubleClick: (id: string) => void;
  onRightClick: (id: string) => void;
  children: React.ReactNode;
}

function DraggableElement({
  id, x, y, width, height, zIndex,
  slideRef, onMove, onDoubleClick, onRightClick, children,
}: DraggableElementProps) {

  const [isSelected, setIsSelected] = useState(false);

  const isDragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x, y });

  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCount = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
  };
  return (
    <Box
      position="absolute"
      left={`${x}%`}
      top={`${y}%`}
      width={`${width}%`}
      height={`${height}%`}
      zIndex={zIndex}
      pointerEvents="all"
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick(id);
      }}
    >
      {/* The actual element content */}
      {children}

    </Box>
  );
}

export default DraggableElement;