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
  id: _id, url, autoplay,
  onDoubleClick, onRightClick,
}: VideoElementProps) {
  const finalUrl = autoplay
    ? `${url}${url.includes('?') ? '&' : '?'}autoplay=1`
    : url;

  return (
    <Box
      width="100%"
      height="100%"
      overflow="hidden"
      style={{ cursor: 'default', boxSizing: 'border-box' }}
      onDoubleClick={() => onDoubleClick(_id)}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick(_id);
      }}
    >
      <iframe
        src={finalUrl}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title={`video-${_id}`}
      />
    </Box>
  );
}

export default VideoElement;