'use client';
import { useEffect, useRef, useState } from "react";
import { MenuOutlined } from '@ant-design/icons';
import { saveSelectedColumns } from "@/utils/localStorage";

interface Option {
    key: string;
    title: string;
    columnName: string;
}

interface ColumnSelectProps {
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    className?: string;
    type?: string;
}

const ColumnSelect: React.FC<ColumnSelectProps> = ({ options = [], value, onChange, className = '', type }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleDropdown = () => setIsOpen(prev => !prev);

    const handleSelect = (option: Option) => {
        let selectedColumns = []
        if (value.includes(option.key)) {
            selectedColumns = value.filter(v => v !== option.key);
        } else {
            selectedColumns = [...value, option.key];
        }
        onChange(selectedColumns);
        if (type) {
            saveSelectedColumns(type, selectedColumns)
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`select-none ${className}`} ref={dropdownRef}>
            <div
                className="border !h-8 border-gray-300 rounded-lg flex items-center justify-center w-10 cursor-pointer"
                onClick={toggleDropdown}
            >
                <MenuOutlined />
            </div>

            {isOpen && (
                <ul className="absolute min-w-52 border bg-white rounded-lg mt-1 
                    max-h-96 overflow-y-auto z-10 custom-scrollbar"
                >
                    {options.map(option => (
                        <li
                            key={option.key}
                            className={`p-2 pr-4 ${value.includes(option.key)
                                ? "bg-blue-50 hover:bg-blue-100"
                                : "hover:bg-gray-50"}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option.columnName || option.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ColumnSelect;
