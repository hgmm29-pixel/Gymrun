import React, { useState, useEffect, useRef } from 'react';
import { Activity, Dumbbell } from 'lucide-react';
import { Message, ChatState } from './types.ts';
import ChatMessage from './components/ChatMessage.tsx';
import ChatInput from './components/ChatInput.tsx';
import WorkoutTimer from './components/WorkoutTimer.tsx';
import { initChatSession, sendMessageToGemini } from './services/geminiService.ts';

const App: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session on mount
  useEffect(() => {
    try {
      initChatSession();
    } catch (err) {
      setChatState(prev => ({ ...prev, error: "Error al inicializar el entrenador. Verifica tu API Key." }));
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSendMessage = async (text: string, imageFile?: File) => {
    let imageBase64: string | undefined;
    let mimeType: string | undefined;
    let imageUrlForUI: string | undefined;

    if (imageFile) {
      try {
        imageBase64 = await fileToBase64(imageFile);
        mimeType = imageFile.type;
        imageUrlForUI = URL.createObjectURL(imageFile);
      } catch (error) {
        console.error("Error reading file:", error);
        setChatState(prev => ({ ...prev, error: "Error al procesar la imagen." }));
        return;
      }
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      imageUrl: imageUrlForUI,
      timestamp: Date.now(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newUserMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const responseText = await sendMessageToGemini(text, imageBase64, mimeType);
      
      const newModelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, newModelMessage],
        isLoading: false,
      }));
    } catch (error: any) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Ocurrió un error inesperado.",
      }));
    }
  };

  return (
    <div className="relative flex flex-col h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 overflow-hidden">
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity"
        style={{ backgroundImage: 'url("https://picsum.photos/1920/1080")' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-slate-950/95 to-slate-950"></div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 py-4 px-6 flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg shadow-lg shadow-emerald-900/20">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-sm">AI Trainer Pro</h1>
              <p className="text-xs text-emerald-400 font-medium tracking-wider uppercase drop-shadow-sm">Alto Rendimiento</p>
            </div>
          </div>
          <div className="flex gap-4 text-slate-400">
            <WorkoutTimer />
            <div 
              className="flex items-center gap-1 text-xs font-medium bg-slate-800/80 backdrop-blur-sm px-2 py-1 rounded-md border border-slate-700/50 shadow-inner cursor-help"
              title="Modo de entrenamiento: Solo máquinas fijas"
            >
              <Dumbbell size={14} /> Máquinas
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-4xl mx-auto">
            
            {/* Welcome / Empty State */}
            {chatState.messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full mt-20 text-center opacity-80">
                <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-full mb-6 border border-slate-700/50 shadow-2xl shadow-emerald-900/10">
                  <Dumbbell size={48} className="text-emerald-500 drop-shadow-md" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">Sistema Listo</h2>
                <p className="text-slate-300 max-w-md leading-relaxed drop-shadow-sm">
                  Esperando activación. Escribe <span className="text-emerald-400 font-semibold">"Ya estoy en el gimnasio"</span> o pega tu último <span className="text-emerald-400 font-semibold">[RESUMEN]</span> para comenzar la sesión de hoy.
                </p>
              </div>
            )}

            {/* Messages List */}
            {chatState.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            
            {/* Loading Indicator */}
            {chatState.isLoading && (
              <div className="flex justify-start mb-6">
                <div className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-sm text-slate-400 px-5 py-3 rounded-2xl rounded-tl-none border border-slate-700/50 ml-16 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-sm ml-2">Analizando...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {chatState.error && (
              <div className="bg-red-900/40 backdrop-blur-sm border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-sm text-center mx-auto max-w-md shadow-lg">
                {chatState.error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={chatState.isLoading} />
      </div>
    </div>
  );
};

export default App;