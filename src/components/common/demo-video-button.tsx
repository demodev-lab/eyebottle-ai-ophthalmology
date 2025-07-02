import { Play } from 'lucide-react';

interface DemoVideoButtonProps {
  url: string;
  title?: string;
  className?: string;
}

export function DemoVideoButton({ 
  url, 
  title = "데모영상", 
  className = "" 
}: DemoVideoButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${className}`}
    >
      <div className="relative mr-2">
        <Play className="w-5 h-5 fill-current" />
        <div className="absolute inset-0 bg-white/20 rounded-full transform scale-0 group-hover:scale-110 transition-transform duration-300"></div>
      </div>
      <span className="font-medium">{title}</span>
    </a>
  );
} 