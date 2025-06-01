import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, MinusSquare, RotateCcw } from 'lucide-react';

const CHATBOT_URL = "https://solveease-rogue.tech/chat/stream";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your portfolio assistant. How can I help you today?", sender: "bot" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); // Add a ref for the input element

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, streamedResponse]);

  // Focus on input when streaming stops
  useEffect(() => {
    if (!isStreaming && isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isStreaming, isOpen, isMinimized]);

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    if (!isOpen) {
      // Focus input when opening chat
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Toggle minimize state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      // Focus input when un-minimizing
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Clear chat history and start new conversation
  const clearChat = () => {
    setMessages([
      { id: 1, text: "Hi there! I'm your portfolio assistant. How can I help you today?", sender: "bot" }
    ]);
    sessionStorage.removeItem("chat_thread_id");
    console.log("Chat cleared - new conversation will start");
  };

  // Send a message and handle streaming response
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isStreaming) return;

    // Add user message
    const userMessage = inputMessage;
    setMessages(prev => [
      ...prev,
      { id: prev.length + 1, text: userMessage, sender: "user" }
    ]);
    setInputMessage("");
    
    // Start streaming indicator
    setIsStreaming(true);
    setStreamedResponse("");

    try {
      // Create a new empty bot message placeholder to show streaming response
      setMessages(prev => [
        ...prev,
        { id: prev.length + 1, text: "", sender: "bot", streaming: true }
      ]);

      const response = await streamResponse(userMessage);
      
      // When streaming is done, update the last message with the complete response
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = {
          ...newMessages[lastIndex],
          text: response,
          streaming: false
        };
        return newMessages;
      });
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { id: prev.length + 1, text: "Sorry, I'm having trouble connecting. Please try again later.", sender: "bot" }
      ]);
      console.error("Error streaming response:", error);
    } finally {
      setIsStreaming(false);
      setStreamedResponse("");
    }
  };

  // Simulate streaming response from backend API
  const streamResponse = async (userMessage) => {
    return await fetchStreamingResponse(userMessage);
  };
  
  const fetchStreamingResponse = async (userMessage) => {
    let sessionId = sessionStorage.getItem("chat_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("chat_session_id", sessionId);
    }

    let threadId = sessionStorage.getItem("chat_thread_id") || "";
  
    try {
      const endpoint = CHATBOT_URL;

      const headers = {
        'Content-Type': 'application/json',
      };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          message: userMessage,
          id: sessionId,
          thread_id: threadId
         }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let accumulatedText = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6);
              const data = JSON.parse(jsonStr);
              
              if (data.type === 'chunk' && data.content) {
                accumulatedText += data.content;
                
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastIndex = newMessages.length - 1;
                  if (newMessages[lastIndex]?.streaming) {
                    newMessages[lastIndex] = {
                      ...newMessages[lastIndex],
                      text: accumulatedText
                    };
                  }
                  return newMessages;
                });
              }
              else if (data.type === 'start') {
                console.log('Stream started for thread:', data.thread_id);
                if (data.thread_id) {
                  sessionStorage.setItem("chat_thread_id", data.thread_id);
                }
              }
              else if (data.type === 'end') {
                console.log('Stream ended. Full response:', data.full_response);
                if (data.thread_id) {
                  sessionStorage.setItem("chat_thread_id", data.thread_id);
                }
                accumulatedText = data.full_response || accumulatedText;
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e, 'Line:', line);
            }
          }
        }
      }
      
      return accumulatedText;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  const colors = {
    primary: "#374151",
    secondary: "#F3F4F6",
    accent: "#0EA5E9",
    text: {
      light: "#F9FAFB",
      dark: "#1F2937",
    },
    background: {
      light: "#FFFFFF",
      darker: "#F3F4F6",
    }
  };

  return (
    <div className="fixed bottom-14 left-4 z-50">
      {/* Chat button */}
      <button 
        onClick={toggleChat}
        className="bg-gray-700 hover:bg-gray-800 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
        style={{ backgroundColor: colors.primary }}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div 
          className={`absolute bottom-16 left-0 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col ${
            isMinimized ? 'h-12 w-64' : 'h-126 w-90'
          } transition-all duration-300`}
        >
          {/* Chat header */}
          <div 
            className="text-white p-3 rounded-t-lg flex justify-between items-center"
            style={{ backgroundColor: colors.primary }}
          >
            <h3 className="font-medium">Portfolio Assistant</h3>
            <div className="flex gap-2">
              <button onClick={clearChat} className="hover:text-gray-300" aria-label="Clear chat" title="Start new conversation">
                <RotateCcw size={18} />
              </button>
              <button onClick={toggleMinimize} className="hover:text-gray-300" aria-label="Minimize chat">
                <MinusSquare size={18} />
              </button>
              <button onClick={toggleChat} className="hover:text-gray-300" aria-label="Close chat">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages area - only shown when not minimized */}
          {!isMinimized && (
            <div 
              className="flex-1 p-4 overflow-y-auto"
              style={{ backgroundColor: colors.background.light }}
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`mb-3 ${
                    msg.sender === "user" 
                      ? "text-right" 
                      : "text-left"
                  }`}
                >
                  <div 
                    className={`inline-block px-3 py-2 rounded-lg ${
                      msg.sender === "user" 
                        ? "text-white" 
                        : "text-gray-800"
                    }`}
                    style={{ 
                      backgroundColor: msg.sender === "user" ? colors.accent : colors.secondary,
                      color: msg.sender === "user" ? colors.text.light : colors.text.dark,
                    }}
                  >
                    {msg.text}
                    {msg.streaming && (
                      <span className="inline-block w-2 h-4 ml-1 bg-gray-500 animate-pulse"></span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Message input - only shown when not minimized */}
          {!isMinimized && (
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex">
              <input
                ref={inputRef} // Add ref to input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderColor: colors.primary, outlineColor: colors.accent }}
                disabled={isStreaming}
                autoFocus // Auto-focus when rendered
              />
              <button 
                type="submit"
                className="text-white rounded-r-lg px-3 py-2"
                style={{ 
                  backgroundColor: isStreaming ? '#9CA3AF' : colors.accent,
                  cursor: isStreaming ? 'not-allowed' : 'pointer'
                }}
                disabled={!inputMessage.trim() || isStreaming}
              >
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}