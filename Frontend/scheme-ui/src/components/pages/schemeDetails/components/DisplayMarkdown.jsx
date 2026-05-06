import React from 'react';

const DisplayMarkdown = ({ content }) => {
    if (!content) return null;

    // Helper to decode HTML entities
    const decodeHtmlEntities = (text) => {
        if (typeof text !== 'string') return '';
        return text
            .replace(/&lt;br&gt;/g, '')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&#39;/g, "'")
            .replace(/<br>/g, '\n');
    };

    // Helper for bold text (**text**)
    const formatLine = (text) => {
        if (typeof text !== 'string') return text;
        const parts = text.split(/\*\*(.*?)\*\*/g);
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                return <strong key={index} className="text-gray-900 font-bold">{part}</strong>;
            }
            return part;
        });
    };

    // --- LOGIC FOR ARRAYS (documentsRequired, etc.) ---
    if (Array.isArray(content)) {
        return (
            <ul className="space-y-3 list-none">
                {content.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                        <span className="leading-relaxed">{formatLine(decodeHtmlEntities(item))}</span>
                    </li>
                ))}
            </ul>
        );
    }

    // --- LOGIC FOR SINGLE STRINGS (description, etc.) ---
    const formatContent = (text) => {
        const lines = text.split('\n');
        const result = [];
        let listItems = [];

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            // Handle Bullets in string
            if (trimmedLine.startsWith('•') || trimmedLine.startsWith('●') || trimmedLine.startsWith('-')) {
                listItems.push(
                    <li key={`li-${index}`} className="mb-2">
                        {formatLine(trimmedLine.replace(/^[•●-]\s*/, ''))}
                    </li>
                );
            } else {
                // If we were in a list and hit a normal paragraph, push the list first
                if (listItems.length > 0) {
                    result.push(<ul key={`ul-${index}`} className="list-disc ml-6 mb-4">{listItems}</ul>);
                    listItems = [];
                }
                result.push(<p key={index} className="mb-4 leading-relaxed">{formatLine(trimmedLine)}</p>);
            }
        });

        if (listItems.length > 0) {
            result.push(<ul key="final-ul" className="list-disc ml-6 mb-4">{listItems}</ul>);
        }

        return result;
    };

    const decodedContent = decodeHtmlEntities(content);
    return (
        <div className="prose max-w-none text-gray-600">
            {formatContent(decodedContent)}
        </div>
    );
};

export default DisplayMarkdown;