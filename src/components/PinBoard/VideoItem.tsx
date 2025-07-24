import {motion} from 'framer-motion';
import type {VideoItemProps} from './types';
import * as React from 'react';
import {Pin} from 'lucide-react';

const VideoItem: React.FC<VideoItemProps> = (props) => {
  const {video, isPinned, onClick, onPinClick, className = ''} = props;

  const handleClick = () => {
    onClick?.();
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPinClick?.();
  };

  const itemVariants = {
    unpinned: {
      scale: 1,
      opacity: 1
    },
    pinned: {
      scale: 1,
      opacity: 1
    }
  };

  return (
    <motion.div
      layout
      variants={itemVariants}
      animate={isPinned ? "pinned" : "unpinned"}
      onClick={handleClick}
      className={`
        relative rounded-lg overflow-hidden select-none
        ${isPinned
        ? 'w-full h-full bg-gray-900'
        : 'w-full h-full bg-gray-800 hover:bg-gray-700'
      }
        transition-colors duration-200
        ${className}
      `}
      whileHover={!isPinned ? {scale: 1.05} : {}}
      whileTap={{scale: 0.98}}
    >
      <div className={`
        relative w-full h-full flex items-center justify-center
        ${video.color || 'bg-gradient-to-br from-blue-500 to-purple-600'}
      `}>
        <div className="absolute inset-0 bg-black bg-opacity-20"/>

        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          {video.participant || video.title}
        </div>

        {/* Pin Icon - Always visible, different styles for pinned/unpinned */}
        <button
          onClick={handlePinClick}
          className={`
            absolute top-3 right-3 p-2 rounded-full transition-all duration-200 cursor-pointer
            ${isPinned
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-black bg-opacity-40 hover:bg-black hover:bg-opacity-60 text-white'
            }
          `}
        >
          <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`}/>
        </button>

      </div>
    </motion.div>
  );
};

export default VideoItem;
