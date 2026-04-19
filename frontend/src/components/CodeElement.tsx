import { Box } from '@chakra-ui/react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import c from 'react-syntax-highlighter/dist/esm/languages/hljs/c';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('c', c);

const detectLanguage = (code: string): string => {
  if (
    /\bdef\b/.test(code) ||
    /\belif\b/.test(code) ||
    /\bprint\s*\(/.test(code) ||
    /\bimport\s+\w/.test(code) ||
    /\bTrue\b|\bFalse\b|\bNone\b/.test(code)
  ) return 'python';

  if (
    /#include/.test(code) ||
    /\bprintf\s*\(/.test(code) ||
    /\bint\s+main\s*\(/.test(code) ||
    /\bstruct\b/.test(code) ||
    /\bvoid\b/.test(code)
  ) return 'c';

  return 'javascript';
};

interface CodeElementProps {
  id: string;
  code: string;
  fontSize: number;
  width: number;
  height: number;
  x: number;
  y: number;
  zIndex: number;
  onDoubleClick: (id: string) => void;
  onRightClick: (id: string) => void;
}

function CodeElement({
  id, code, fontSize,
  onDoubleClick, onRightClick,
}: CodeElementProps) {
  const language = detectLanguage(code);

  return (
    <Box
      width="100%"
      height="100%"
      overflow="auto"
      border="1px solid"
      borderColor="gray.300"
      style={{ cursor: 'default', boxSizing: 'border-box', fontSize: `${fontSize}em` }}
      onDoubleClick={() => onDoubleClick(id)}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick(id);
      }}
    >
      <SyntaxHighlighter
        language={language}
        style={atomOneDark}
        customStyle={{
          margin: 0,
          padding: '8px',
          height: '100%',
          fontSize: 'inherit',
          fontFamily: 'monospace',
          whiteSpace: 'pre',
          overflow: 'auto',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
}

export default CodeElement;