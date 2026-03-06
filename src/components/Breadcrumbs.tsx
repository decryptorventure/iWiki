import React from 'react';
import { ChevronRight, Home, Folder } from 'lucide-react';
import { useNavigate } from '../context/AppContext';

interface BreadcrumbsProps {
    items: string[];
    folderIds?: string[];
}

export default function Breadcrumbs({ items, folderIds = [] }: BreadcrumbsProps) {
    const navigate = useNavigate();

    return (
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
            <button
                onClick={() => navigate('dashboard')}
                className="flex items-center gap-1.5 hover:text-orange-500 transition-colors"
            >
                <Home size={14} />
                <span>Trang chủ</span>
            </button>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight size={12} className="text-gray-300" />
                    <button
                        onClick={() => folderIds[index] ? navigate(`folder-${folderIds[index]}`) : null}
                        className={`transition-colors truncate max-w-[150px] ${index === items.length - 1
                            ? 'text-gray-900 cursor-default font-medium'
                            : 'hover:text-orange-500 flex items-center gap-1.5'
                            }`}
                    >
                        {index !== items.length - 1 && <Folder size={13} className="text-gray-300" />}
                        <span>{item}</span>
                    </button>
                </React.Fragment>
            ))}
        </nav>
    );
}
