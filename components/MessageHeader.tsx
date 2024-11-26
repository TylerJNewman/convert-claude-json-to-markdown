import { UserCircle2, Bot } from 'lucide-react';

interface MessageHeaderProps {
  isHuman: boolean;
  timestamp?: string;
}

export default function MessageHeader({ isHuman }: MessageHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-4 p-2 bg-gray-100 rounded-md shadow-sm">
      {isHuman ? (
        <UserCircle2 className="h-6 w-6 text-gray-600" />
      ) : (
        <Bot className="h-6 w-6 text-indigo-600" />
      )}
      <span className="font-medium text-gray-900">
        {isHuman ? 'Human' : 'Assistant'}
      </span>
    </div>
  );
} 