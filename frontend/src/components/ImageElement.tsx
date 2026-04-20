import { Box } from '@chakra-ui/react';

interface ImageElementProps {
    id: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    x: number;
    y: number;
    zIndex: number;
    onDoubleClick: (_id: string) => void;
    onRightClick: (_id: string) => void;
}

function ImageElement({
  id: _id, src, alt,
  onDoubleClick, onRightClick,
}: ImageElementProps) {
  return (
    <Box
      width="100%"
      height="100%"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={{ cursor: 'default', boxSizing: 'border-box' }}
      onDoubleClick={() => onDoubleClick(_id)}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick(_id);
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}

export default ImageElement;