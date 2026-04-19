import { Box } from '@chakra-ui/react';

interface TextElementProps {
  id: string;
  text: string;
  fontSize: number;
  color: string;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
  onDoubleClick: (id: string) => void;
  onRightClick: (id: string) => void;
}

function TextElement({
  id, text, fontSize, color, width, height, x, y, zIndex,
  onDoubleClick, onRightClick,
}: TextElementProps) {
  return (
    <Box
      position="absolute"
      left={`${x}%`}
      top={`${y}%`}
      width={`${width}%`}
      height={`${height}%`}
      zIndex={zIndex}
      border="1px solid"
      borderColor="gray.300"
      overflow="auto"
      pointerEvents="all"
      style={{
        fontSize: `${fontSize}em`,
        color: color,
        textAlign: 'left',
        padding: '4px',
        boxSizing: 'border-box',
        cursor: 'default',
        userSelect: 'none',
      }}
      onDoubleClick={() => onDoubleClick(id)}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick(id);
      }}
    >
      {text}
    </Box>
  );
}

export default TextElement;