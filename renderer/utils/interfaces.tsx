
export interface Chat {
    id: string;
    title: string;
    isActive: boolean;
    messages: Message[];
    createdAt: number;
}

export interface ChatListProps {
    chats: Chat[];
    onCreateChat: () => void;
    onRemoveChat: (id: string) => void;
    onSelectChat: (id: string) => void;
    onUpdateTitle: (id: string, title: string) => void;
}

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    error: boolean;
}

export interface ChatWindowProps {
    isActive: boolean;
    messages: Message[];
    onSendMessage: (message: string, model: string) => void;
}

export interface EditableChatTitleProps {
    chat: Chat;
    onSelect: () => void;
    onRemoveChat: (id: string) => void;
    onUpdateTitle: (id: string, newTitle: string) => void;
}