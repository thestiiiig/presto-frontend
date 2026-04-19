import { Box } from '@chakra-ui/react';

interface VideoElementProps {
  id: string;
  url: string;
  autoplay: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
  onDoubleClick: (id: string) => void;
  onRightClick: (id: string) => void;
}

function VideoElement({
  id, url, autoplay, width, height, x, y, zIndex,
  onDoubleClick, onRightClick,
}: VideoElementProps) {

  // Append autoplay parameter to URL if needed
  const finalUrl = autoplay
    ? `${url}${url.includes('?') ? '&' : '?'}autoplay=1`
    : url;

  return (
    <Box
      position="absolute"
      left={`${x}%`}
      top={`${y}%`}
      width={`${width}%`}
      height={`${height}%`}
      zIndex={zIndex}
      overflow="hidden"
      pointerEvents="all"
      style={{ cursor: 'default', boxSizing: 'border-box' }}
      onDoubleClick={() => onDoubleClick(id)}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick(id);
      }}
    >
      <iframe
        src={finalUrl}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title={`video-${id}`}
      />
    </Box>
  );
}

export default VideoElement;