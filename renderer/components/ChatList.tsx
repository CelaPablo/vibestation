import React from 'react';
import { ChatListProps } from '../utils/interfaces';
import EditableChatTitle from './EditableChatTitle';

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat, onCreateChat, onUpdateTitle, onRemoveChat }) => {
    return (
        <div className="w-1/5 bg-black h-screen overflow-y-auto border-r border-gray-800 flex flex-col">
            <h2 className="mx-auto text-white font-bold text-xl p-4">
                Vibest<span className='text-green-600'>A</span>t<span className='text-green-600'>I</span>on
            </h2>

            <button
                onClick={onCreateChat}
                className="m-4 p-2 border border-green-600 hover:bg-green-700 text-white rounded-md transition"
            >
                + New chat
            </button>

            <div className="flex-grow overflow-y-auto">
                {chats.map((chat) => (
                    <EditableChatTitle
                        key={chat.id}
                        chat={chat}
                        onSelect={() => onSelectChat(chat.id)}
                        onUpdateTitle={onUpdateTitle}
                        onRemoveChat={onRemoveChat}
                    />
                ))}
            </div>
        </div>
    );;
};

export default ChatList;
