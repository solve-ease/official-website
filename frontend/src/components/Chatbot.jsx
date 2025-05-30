import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, MinusSquare } from 'lucide-react';

const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL

// Main ChatBot component
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

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, streamedResponse]);

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  // Toggle minimize state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
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

      // Simulate streaming from a backend API (replace with actual fetch to your endpoint)
      // In a real implementation, you'd use fetch with streaming API or a WebSocket
      const response = await streamResponse(userMessage);
      
      // When streaming is done, update the last message with the complete response
      setMessages(prev => {
        const newMessages = [...prev];
        // Remove the streaming placeholder message
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex] = {
          ...newMessages[lastIndex],
          text: response,
          streaming: false
        };
        return newMessages;
      });
    } catch (error) {
      // Handle errors by adding an error message
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
  
    try {
      
      
      const endpoint = CHATBOT_URL+'/chat-response';

      // Set up headers
      const headers = {
        'Content-Type': 'application/json',
      };
      
      
      // Connect to the backend API
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          message: [{ content: userMessage }],
          id: sessionId
         }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      
      // Set up event source for streaming
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let accumulatedText = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });
        
        // Process SSE format - each chunk might contain multiple events
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6); // Remove 'data: ' prefix
              const data = JSON.parse(jsonStr);
              
              if (data.text) {
                accumulatedText += data.text;
                
                // Update the streaming message in real-time
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
            } catch (e) {
              console.error('Error parsing SSE data:', e);
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


  // Modified color scheme based on the provided image
  const colors = {
    primary: "#374151", // Dark gray/slate for primary button
    secondary: "#F3F4F6", // Light gray for background
    accent: "#0EA5E9", // Blue accent for highlights
    text: {
      light: "#F9FAFB", // White text on dark backgrounds
      dark: "#1F2937", // Dark text on light backgrounds
    },
    background: {
      light: "#FFFFFF", // White background
      darker: "#F3F4F6", // Slightly darker background for contrast
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
            isMinimized ? 'h-12 w-64' : 'h-126 w-90'  /*dimensions of the chatbot popup*/
          } transition-all duration-300`}
        >
          {/* Chat header */}
          <div 
            className="text-white p-3 rounded-t-lg flex justify-between items-center"
            style={{ backgroundColor: colors.primary }}
          >
            <h3 className="font-medium">Portfolio Assistant</h3>
            <div className="flex gap-2">
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
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderColor: colors.primary, outlineColor: colors.accent }}
                disabled={isStreaming}
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