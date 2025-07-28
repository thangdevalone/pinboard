import {motion} from 'framer-motion';
import type {VideoItemProps} from './types';
import * as React from 'react';
import {Pin, Presentation} from 'lucide-react';

const VideoItem: React.FC<VideoItemProps> = (props) => {
  const {video, isPinned, isPresenter, onClick, onPinClick, onPresentClick, className = ''} = props;

  const handleClick = () => {
    onClick?.();
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPinClick?.();
  };

  const handlePresentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPresentClick?.();
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
        relative rounded-lg overflow-hidden select-none w-full h-full bg-black
        ${isPinned
        ? 'bg-black'
        : 'bg-black hover:bg-gray-900'
      }
        transition-colors duration-200
        ${className}
      `}
    >
      {/* Container chiếm hết không gian với background đen */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        {/* Video container với aspect ratio 16:9 */}
        <div className="relative w-full h-full flex items-center justify-center">
          {video.videoUrl ? (
            <video
              className="w-full h-full object-contain"
              src={video.videoUrl}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <div className={`
              w-full h-full flex items-center justify-center
              ${video.color || 'bg-gradient-to-br from-blue-500 to-purple-600'}
            `}>
              <div className="absolute inset-0 bg-black bg-opacity-20"/>
            </div>
          )}
        </div>

        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded line-clamp-1">
          {video.participant || video.title}
        </div>

        {/* Control buttons - Pin and Present */}
        <div className="absolute top-3 right-3 flex gap-2">
          {/* Present button */}
          <button
            onClick={handlePresentClick}
            className={`
              p-2 rounded-full transition-all duration-200 cursor-pointer
              ${isPresenter
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-black bg-opacity-40 hover:bg-black hover:bg-opacity-60 text-white'
              }
            `}
          >
            <Presentation className={`w-4 h-4 ${isPresenter ? 'fill-current' : ''}`}/>
          </button>

          {/* Pin button */}
          <button
            onClick={handlePinClick}
            className={`
              p-2 rounded-full transition-all duration-200 cursor-pointer
              ${isPinned
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-black bg-opacity-40 hover:bg-black hover:bg-opacity-60 text-white'
              }
            `}
          >
            <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`}/>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const MemoizedVideoItem = React.memo(VideoItem);

export default MemoizedVideoItem;
