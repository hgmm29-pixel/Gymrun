import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, ImagePlus, X, Loader2 } from 'lucide-react';
import RestTimer from './RestTimer.tsx';

interface ChatInputProps {
  onSendMessage: (text: string, imageFile?: File) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so the same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSend = () => {
    if ((text.trim() || selectedImage) && !isLoading) {
      onSendMessage(text.trim(), selectedImage || undefined);
      setText('');
      setSelectedImage(null);
      setImagePreview(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border-t border-slate-800/50 p-4 z-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Rest Timer for between sets */}
        <RestTimer />

        {/* Image Preview Area */}
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <div className="relative rounded-lg overflow-hidden border border-emerald-500/30 bg-slate-800/90 backdrop-blur-sm shadow-lg">
              <img src={imagePreview} alt="Preview" className="h-24 w-auto object-cover opacity-90" />
              <button
                onClick={removeImage}
                className="absolute top-1 right-1 bg-slate-900/80 text-slate-300 hover:text-white rounded-full p-1 transition-colors"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end gap-2 bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-2 focus-within:border-emerald-500/50 transition-colors shadow-inner">
          
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
            disabled={isLoading}
          />
          
          {/* Attachment Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-3 text-slate-400 hover:text-emerald-400 transition-colors rounded-xl hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            title="Adjuntar foto de máquina o resumen"
          >
            <ImagePlus size={22} />
          </button>

          {/* Text Input */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Ej: Ya estoy en el gimnasio..."
            disabled={isLoading}
            className="flex-1 max-h-[120px] min-h-[44px] bg-transparent text-slate-100 placeholder-slate-400 resize-none outline-none py-3 px-2 leading-relaxed"
            rows={1}
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={(!text.trim() && !selectedImage) || isLoading}
            className={`p-3 rounded-xl flex-shrink-0 transition-all duration-200 ${
              (!text.trim() && !selectedImage) || isLoading
                ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20'
            }`}
          >
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
          </button>
        </div>
        <div className="text-center mt-2">
           <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold drop-shadow-sm">
             Escribe "termine por hoy" para finalizar la sesión
           </span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;