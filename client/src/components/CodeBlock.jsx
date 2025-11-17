import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ text }) => {
  // 1. Split text by triple backticks (```)
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="text-gray-700 text-sm leading-relaxed">
      {parts.map((part, index) => {
        // 2. Check if this part is a code block
        if (part.startsWith("```") && part.endsWith("```")) {
          // Remove the backticks
          // Format: ```language \n code ```
          const content = part.slice(3, -3).trim();
          // (Optional) Extract language if you want to get fancy later
          
          return (
            <div key={index} className="my-4 rounded-md overflow-hidden shadow-sm">
              <SyntaxHighlighter 
                language="javascript" 
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: '1rem', fontSize: '0.9rem' }}
              >
                {content}
              </SyntaxHighlighter>
            </div>
          );
        } 
        
        // 3. If not code, render normal text (preserving line breaks)
        return (
            <span key={index} style={{ whiteSpace: 'pre-wrap' }}>
                {part}
            </span>
        );
      })}
    </div>
  );
};

export default CodeBlock;