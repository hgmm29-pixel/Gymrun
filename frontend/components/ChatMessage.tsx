import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types.ts';
import { User, Bot, Image as ImageIcon } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mx-3 
          ${isUser ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-emerald-400 border border-emerald-500/30'}`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-4 rounded-2xl shadow-sm
            ${isUser 
              ? 'bg-emerald-600 text-white rounded-tr-none' 
              : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
            
            {/* Image Attachment */}
            {message.imageUrl && (
              <div className="mb-3 relative rounded-lg overflow-hidden border border-slate-600/50">
                <img 
                  src={message.imageUrl} 
                  alt="Uploaded content" 
                  className="max-w-full h-auto max-h-64 object-contain bg-slate-900"
                />
                <div className="absolute top-2 right-2 bg-black/50 p-1 rounded text-white backdrop-blur-sm">
                  <ImageIcon size={16} />
                </div>
              </div>
            )}

            {/* Text Content with Markdown Support */}
            {message.text && (
              <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <span className="text-xs text-slate-500 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;