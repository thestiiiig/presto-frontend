import { Box } from '@chakra-ui/react';

interface TextElementProps {
  id: string;
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
  onDoubleClick: (id: string) => void;
  onRightClick: (id: string) => void;
}

function TextElement({
  id, text, fontSize, color, fontFamily,
  onDoubleClick, onRightClick,
}: TextElementProps) {
  return (
    <Box
      width="100%"
      height="100%"
      border="1px solid"
      borderColor="gray.300"
      overflow="auto"
      style={{
        fontSize: `${fontSize}em`,
        color: color,
        fontFamily: fontFamily,
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