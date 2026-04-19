import { useRef, useState, useEffect, useCallback } from 'react';
import { Box } from '@chakra-ui/react';

interface DraggableElementProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  slideRef: React.RefObject<HTMLDivElement | null>;
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

    clickCount.current += 1;

    if (clickCount.current === 1) {
      // Start timer 
      // if second click comes within 500ms its double click
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
        // Single click select  element
        setIsSelected(true);
      }, 500);
    } else if (clickCount.current === 2) {
      // double click clear timer, trigger edit
      if (clickTimer.current) clearTimeout(clickTimer.current);
      clickCount.current = 0;
      setIsSelected(false);
      onDoubleClick(id);
    }

    isDragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { x, y };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    if (!slideRef.current) return;

    // slide dimensions in pixels
    const rect = slideRef.current.getBoundingClientRect();

    // Calculate how much mouse has moved in pixels
    const deltaPxX = e.clientX - startMouse.current.x;
    const deltaPxY = e.clientY - startMouse.current.y;

    // Convert to percentage
    const deltaPercentX = (deltaPxX / rect.width) * 100;
    const deltaPercentY = (deltaPxY / rect.height) * 100;

    // Calculate new position
    let newX = startPos.current.x + deltaPercentX;
    let newY = startPos.current.y + deltaPercentY;

    // stays within slide bounds
    newX = Math.max(0, Math.min(newX, 100 - width));
    newY = Math.max(0, Math.min(newY, 100 - height));

    onMove(id, newX, newY);
  }, [id, width, height, slideRef, onMove]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
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

  const cornerPositions = [
    { top: 0, left: 0 },                    // top left
    { top: 0, left: `${width}%` },          // top right  
    { top: `${height}%`, left: 0 },         // bottom left
    { top: `${height}%`, left: `${width}%` }, // bottom right
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
      {children}

      {isSelected && cornerPositions.map((corner, i) => (
        <Box
          key={i}
          position="absolute"
          width="8px"
          height="8px"
          bg="blue.500"
          border="1px solid white"
          style={{
            top: corner.top,
            left: corner.left,
            transform: 'translate(-50%, -50%)',
            cursor: 'grab',
          }}
        />
      ))}
    </Box>
  );
}

export default DraggableElement;