import { useRef, useState, useEffect, useCallback } from 'react';
import type { RefObject, ReactNode } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { Box } from '@chakra-ui/react';

interface DraggableElementProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  slideRef: RefObject<HTMLDivElement | null>;
  onMove: (id: string, newX: number, newY: number) => void;
  onResize: (id: string, newX: number, newY: number, newWidth: number, newHeight: number) => void;
  onDoubleClick: (id: string) => void;
  onRightClick: (id: string) => void;
  children: ReactNode;
}

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

function DraggableElement({
  id, x, y, width, height, zIndex,
  slideRef, onMove, onResize, onDoubleClick, onRightClick, children,
}: DraggableElementProps) {

  const [isSelected, setIsSelected] = useState(false);


  const isDragging = useRef(false);
  const isResizing = useRef<Corner | null>(null);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x, y });
  const startSize = useRef({ width, height });

  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCount = useRef(0);

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    clickCount.current += 1;

    if (clickCount.current === 1) {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
        setIsSelected(true);
      }, 500);
    } else if (clickCount.current === 2) {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      clickCount.current = 0;
      setIsSelected(false);
      onDoubleClick(id);
    }

    isDragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { x, y };
    startSize.current = { width, height };
  };

  const handleCornerMouseDown = (e: ReactMouseEvent, corner: Corner) => {
    e.stopPropagation();
    e.preventDefault();
    isResizing.current = corner;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { x, y };
    startSize.current = { width, height };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!slideRef.current) return;
    const rect = slideRef.current.getBoundingClientRect();

    // Calculate how much mouse has moved in pixels
    const deltaPxX = e.clientX - startMouse.current.x;
    const deltaPxY = e.clientY - startMouse.current.y;

    // Convert to percentage
    const deltaPercentX = (deltaPxX / rect.width) * 100;
    const deltaPercentY = (deltaPxY / rect.height) * 100;

    // Handle resizing
    if (isResizing.current) {
      let newX = startPos.current.x;
      let newY = startPos.current.y;
      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;

      const corner = isResizing.current;

      if (corner === 'bottom-right') {
        newWidth = startSize.current.width + deltaPercentX;
        newHeight = startSize.current.height + deltaPercentY;
      } else if (corner === 'bottom-left') {
        newX = startPos.current.x + deltaPercentX;
        newWidth = startSize.current.width - deltaPercentX;
        newHeight = startSize.current.height + deltaPercentY;
      } else if (corner === 'top-right') {
        newY = startPos.current.y + deltaPercentY;
        newWidth = startSize.current.width + deltaPercentX;
        newHeight = startSize.current.height - deltaPercentY;
      } else if (corner === 'top-left') {
        newX = startPos.current.x + deltaPercentX;
        newY = startPos.current.y + deltaPercentY;
        newWidth = startSize.current.width - deltaPercentX;
        newHeight = startSize.current.height - deltaPercentY;
      }

      // Minimum size 1%
      newWidth = Math.max(1, newWidth);
      newHeight = Math.max(1, newHeight);

      // Clamp to slide bounds
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);
      if (newX + newWidth > 100) newWidth = 100 - newX;
      if (newY + newHeight > 100) newHeight = 100 - newY;

      onResize(id, newX, newY, newWidth, newHeight);
      return;
    }

    // Handle moving
    if (!isDragging.current) return;
    let newX = startPos.current.x + deltaPercentX;
    let newY = startPos.current.y + deltaPercentY;
    newX = Math.max(0, Math.min(newX, 100 - width));
    newY = Math.max(0, Math.min(newY, 100 - height));
    onMove(id, newX, newY);
  }, [id, width, height, slideRef, onMove, onResize]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    isResizing.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleClickOutside = () => setIsSelected(false);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const cornerPositions: { top?: string; bottom?: string; left?: string; right?: string; corner: Corner }[] = [
    { top: '0%', left: '0%', corner: 'top-left' },
    { top: '0%', left: '100%', corner: 'top-right' },
    { top: '100%', left: '0%', corner: 'bottom-left' },
    { top: '100%', left: '100%', corner: 'bottom-right' },
  ];

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
      {/* Inner box clips children to element bounds */}
      <Box
        position="absolute"
        inset={0}
        overflow="hidden"
      >
        {children}
      </Box>

      {/* Corner handles */}
      {isSelected && cornerPositions.map(({ top, left, corner }, i) => (
        <Box
          key={i}
          position="absolute"
          width="8px"
          height="8px"
          bg="blue.500"
          border="1px solid white"
          style={{
            top,
            left,
            transform: 'translate(-50%, -50%)',
            cursor: 'nwse-resize',
            zIndex: 9999,
          }}
          onMouseDown={(e) => handleCornerMouseDown(e, corner)}
        />
      ))}
    </Box>
  );
}

export default DraggableElement;