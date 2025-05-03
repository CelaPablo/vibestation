import React, { useState, useEffect, useRef } from 'react';
import { ChatWindowProps } from '../utils/interfaces';

const MODELS = {
    "gpt-4": "gpt-4",
    "gpt-4o": "gpt-4o",
    "claude-3-opus": "claude-3-opus-20240229",
    "claude-3-sonnet": "claude-3-sonnet-20240229"
  } as const;
  

const ChatWindow: React.FC<ChatWindowProps> = ({ isActive, messages, onSendMessage }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [selectedModel, setSelectedModel] = useState<keyof typeof MODELS>("gpt-4");

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input.trim(), selectedModel);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col flex-grow bg-black h-screen p-6 w-4/5">
            <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as keyof typeof MODELS)}
                className="mb-4 p-2 rounded bg-gray-900 text-white border border-green-600"
              >
                {Object.keys(MODELS).map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>

            <div className="flex-grow overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-900">
                {messages.length === 0 && (
                    <p className="text-gray-500 text-center mt-10 select-none">
                        No messages to display
                    </p>
                )}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`w-full mb-3 p-3 rounded-lg break-words
                            ${msg.sender === 'user'
                                ? 'bg-gray-800 border border-green-800 text-white self-end rounded-br-none'
                                : msg.error ?
                                    'border border-red-500 text-red-500 bg-red-100 self-start rounded-bl-none'
                                    :'border border-white text-gray-300 self-start rounded-bl-none'
                            }
                        `}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    disabled={!isActive}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything ..."
                    className="flex-grow bg-gray-800 text-white p-3 rounded-md border border-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="bg-green-700 hover:bg-green-600 text-white font-semibold px-5 rounded-md transition-colors"
                    aria-label="Ask anything ..."
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;