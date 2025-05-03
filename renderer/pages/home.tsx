import React, { useState, useEffect } from 'react';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { Chat, Message } from '../utils/interfaces';

const STORAGE_KEY = 'my-chat-app-chats';

export default function HomePage() {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Chat[] = JSON.parse(stored);
        setChats(parsed);
      } catch {
        setChats([]);
      }
    } else {
      createNewChat();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  const activeChat = chats.find((chat) => chat.isActive);

  const handleSelectChat = (id: string) => {
    setChats((prev) =>
      prev.map((chat) => ({
        ...chat,
        isActive: chat.id === id,
      }))
    );
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New chat',
      isActive: true,
      messages: [],
      createdAt: Date.now(),
    };
    setChats((prev) =>
      [
        newChat,
        ...prev.map((chat) => ({ ...chat, isActive: false })),
      ].sort((a, b) => b.createdAt - a.createdAt)
    );
  };

  const removeChat = (id) => {
    let newChats = chats.filter(chat => chat.id !== id);
    setChats(newChats);
  }

  const handleUpdateTitle = (id: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const handleSendMessage = async (message: string, model: string) => {
    if (!activeChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      error: false
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, userMessage],
          };
        }
        return chat;
      })
    );

    let aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      sender: 'ai',
      error: false
    }

    try {
      const data = await window.electron.generateText(model, message);
      aiMessage.text = data.text;
      aiMessage.error = data.error;
    } catch (error) {
      aiMessage.text = error.toString();
      aiMessage.error = true;
    }

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, aiMessage],
          };
        }
        return chat;
      })
    );
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <ChatList
        chats={chats.sort((a, b) => b.createdAt - a.createdAt)}
        onSelectChat={handleSelectChat}
        onCreateChat={createNewChat}
        onUpdateTitle={handleUpdateTitle}
        onRemoveChat={removeChat}
      />
      <ChatWindow
        isActive={!!activeChat?.id}
        messages={activeChat?.messages ?? []}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};
