import React from 'react';
import { EditableChatTitleProps } from '../utils/interfaces';
import { MdOutlineEdit } from "react-icons/md";
import { CiCircleRemove } from "react-icons/ci";

const EditableChatTitle: React.FC<EditableChatTitleProps> = ({ chat, onSelect, onUpdateTitle, onRemoveChat }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [title, setTitle] = React.useState(chat.title);

    const handleBlur = () => {
        setIsEditing(false);
        const trimmed = title.trim();
        if (trimmed.length === 0) {
            setTitle(chat.title);
        } else if (trimmed !== chat.title) {
            onUpdateTitle(chat.id, trimmed);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        } else if (e.key === 'Escape') {
            setTitle(chat.title);
            setIsEditing(false);
        }
    };

    return (
        <div
            className={`
                cursor-pointer px-4 py-3 m-2 rounded-md select-none flex items-center
                ${chat.isActive ? 
                    'bg-green-600 text-white shadow-lg' : 
                    'bg-green-900 text-black hover:bg-green-600 transition-colors'
                }
            `}
            onClick={() => {
                if (!isEditing) onSelect();
            }}
            title={chat.title}
        >
            {isEditing ? (
                <input
                    autoFocus
                    className="bg-green-600 text-black w-full outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    maxLength={50}
                />
            ) : (
                <div className="flex justify-between w-full">
                    <span className='w-4/5 truncate'>{chat.title}</span>
                    <div className='flex w-1/5'>
                        <span className='my-auto mx-1' onClick={() => setIsEditing(true)}>
                            <MdOutlineEdit />
                        </span>
                        <span className='my-auto mx-1' onClick={() => onRemoveChat(chat.id)}>
                            <CiCircleRemove />
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditableChatTitle;