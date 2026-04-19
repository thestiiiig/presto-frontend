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
    onDoubleClick: (id: string) => void;
    onRightClick: (id: string) => void;
}

function ImageElement({
    id, src, alt, width, height, x, y, zIndex,
    onDoubleClick, onRightClick,
}: ImageElementProps) {
    return (
        <Box
        position="absolute"
        left={`${x}%`}
        top={`${y}%`}
        width={`${width}%`}
        height={`${height}%`}
        zIndex={zIndex}
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
        pointerEvents="all"
        style={{ cursor: 'default', boxSizing: 'border-box' }}
        onDoubleClick={() => onDoubleClick(id)}
        onContextMenu={(e) => {
            e.preventDefault();
            onRightClick(id);
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