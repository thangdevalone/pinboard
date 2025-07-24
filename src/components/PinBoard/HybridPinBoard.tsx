import * as React from 'react';
import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import VideoItem from './VideoItem';
import SimpleControls from './SimpleControls';
import type {IPinnedVideo, IVideoItem} from './types';

interface HybridPinBoardProps {
  gridSize?: number;
  maxVideos?: number;
  videos?: IVideoItem[];
  onVideoPin?: (video: IVideoItem) => void;
  onVideoUnpin?: (video: IVideoItem) => void;
  className?: string;
}

const HybridPinBoard: React.FC<HybridPinBoardProps> = (props) => {
  const {
    gridSize: initialGridSize = 4,
    maxVideos: initialMaxVideos = 16,
    videos: initialVideos = [],
    onVideoPin,
    onVideoUnpin,
    className = ''
  } = props;

  const [gridSize, setGridSize] = useState(initialGridSize);
  const [maxVideos, setMaxVideos] = useState(initialMaxVideos);
  const [videos, setVideos] = useState<IVideoItem[]>([]);
  const [pinnedVideo, setPinnedVideo] = useState<IPinnedVideo | null>(null);
  const [primaryVideo, setPrimaryVideo] = useState<IVideoItem | null>(null);
  const [presenterMode, setPresenterMode] = useState(true);

  useEffect(() => {
    if (initialVideos.length > 0) {
      const newVideos = initialVideos.slice(0, maxVideos);
      setVideos(newVideos);

      if (presenterMode) {
        const primaryCandidate = newVideos.find(v => v.isPresenter);
        if (primaryCandidate) {
          setPrimaryVideo(primaryCandidate);
        }
      } else {
        setPrimaryVideo(null);
      }
    } else {
      generateDefaultVideos();
    }
  }, [initialVideos, maxVideos, presenterMode]);

  const generateDefaultVideos = () => {
    const defaultVideos: IVideoItem[] = [];
    const participants = [
      'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson',
      'Emma Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor',
      'Ivy Chen', 'Jack Anderson', 'Kate Thompson', 'Liam Garcia',
      'Maya Patel', 'Noah Kim', 'Olivia Zhang', 'Paul Rodriguez'
    ];

    const colors = [
      'bg-gradient-to-br from-blue-500 to-purple-600',
      'bg-gradient-to-br from-green-500 to-blue-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-orange-500 to-red-600',
      'bg-gradient-to-br from-teal-500 to-green-600',
      'bg-gradient-to-br from-indigo-500 to-purple-600'
    ];

    for (let i = 0; i < Math.min(maxVideos, participants.length); i++) {
      defaultVideos.push({
        id: `video-${i + 1}`,
        title: `Video ${i + 1}`,
        participant: participants[i],
        duration: `${Math.floor(Math.random() * 30 + 5)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        isAudioMuted: Math.random() > 0.7,
        isVideoMuted: Math.random() > 0.8,
        isPresenter: i === 1,
        color: colors[i % colors.length]
      });
    }

    setVideos(defaultVideos);

    // Auto-set primary video only if presenter mode is enabled
    if (presenterMode) {
      const primaryCandidate = defaultVideos.find(v => v.isPresenter);
      if (primaryCandidate) {
        setPrimaryVideo(primaryCandidate);
      }
    }
  };

  const handlePresenterModeToggle = (enabled: boolean) => {
    setPresenterMode(enabled);

    if (enabled) {
      // When enabling presenter mode, find and set presenter as primary video
      const presenterVideo = videos.find(v => v.isPresenter);
      if (presenterVideo) {
        setPrimaryVideo(presenterVideo);
      }
    } else {
      // When disabling presenter mode, clear primary video
      setPrimaryVideo(null);
    }
  };

  const handleVideoClick = (video: IVideoItem) => {
    if (primaryVideo?.id === video.id) {
      return;
    }

    if (pinnedVideo?.id === video.id) {
      // Unpin current video
      setPinnedVideo(null);
      onVideoUnpin?.(video);
    } else {
      // Pin new video
      const newPinnedVideo: IPinnedVideo = {
        ...video,
        pinnedAt: new Date()
      };
      setPinnedVideo(newPinnedVideo);
      onVideoPin?.(video);
    }
  };
  const otherVideos = videos.filter(video =>
    video.id !== primaryVideo?.id && video.id !== pinnedVideo?.id
  );

  const hasDualView = primaryVideo && pinnedVideo;
  const hasLargeView = primaryVideo || pinnedVideo;

  return (
    <div className={`w-full max-w-7xl mx-auto p-4 ${className}`}>
      <SimpleControls
        gridSize={gridSize}
        maxVideos={maxVideos}
        presenterMode={presenterMode}
        onGridSizeChange={setGridSize}
        onMaxVideosChange={setMaxVideos}
        onPresenterModeChange={handlePresenterModeToggle}
      />

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Video Meeting ({videos.length} participants)
            {primaryVideo && (
              <span className="ml-2 text-sm text-green-600">
                - {primaryVideo.participant}
                {primaryVideo.isPresenter && " (Presenter)"}
              </span>
            )}
            {pinnedVideo && (
              <span className="ml-2 text-sm text-blue-600">
                - {pinnedVideo.participant} pinned
              </span>
            )}
          </h3>
        </div>

        <motion.div
          layout
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            gridTemplateRows: hasLargeView
              ? `repeat(${gridSize - 1}, minmax(0, 1fr)) auto`
              : `repeat(${gridSize}, minmax(0, 1fr))`
          }}
        >
          <AnimatePresence>
            {primaryVideo && (
              <motion.div
                key={`primary-${primaryVideo.id}`}
                layout
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.8}}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                className="relative"
                style={{
                  gridColumn: hasDualView
                    ? `1 / ${Math.ceil(gridSize / 2) + 1}`
                    : `1 / ${gridSize + 1}`,
                  gridRow: `1 / ${gridSize}`,
                  minHeight: '400px'
                }}
              >
                <VideoItem
                  video={primaryVideo}
                  isPinned={true}
                  onPinClick={() => handleVideoClick(primaryVideo)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pinned Video Area */}
          <AnimatePresence>
            {pinnedVideo && (
              <motion.div
                key={`pinned-${pinnedVideo.id}`}
                layout
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.8}}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                className="relative"
                style={{
                  gridColumn: hasDualView
                    ? `${Math.ceil(gridSize / 2) + 1} / ${gridSize + 1}` // Right half when dual view
                    : `1 / ${gridSize + 1}`, // Full width when solo
                  gridRow: `1 / ${gridSize}`,
                  minHeight: '400px'
                }}
              >
                <VideoItem
                  video={pinnedVideo}
                  isPinned={true}
                  onPinClick={() => handleVideoClick(pinnedVideo)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid Items (when no large view) */}
          {!hasLargeView && (
            <AnimatePresence>
              {videos.map((video, index) => {
                if (index >= gridSize * gridSize) return null;

                return (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.8}}
                    transition={{duration: 0.4, ease: [0.4, 0, 0.2, 1]}}
                    className="relative min-h-[120px]"
                  >
                    <VideoItem
                      video={video}
                      isPinned={false}
                      onPinClick={() => handleVideoClick(video)}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}


          {hasLargeView && otherVideos.length > 0 && (
            <motion.div
              layout
              className="flex gap-2 overflow-x-auto pb-2 video-strip-scrollbar"
              style={{
                gridColumn: `1 / ${gridSize + 1}`,
                gridRow: gridSize,
                minHeight: '80px'
              }}
            >
              <AnimatePresence>
                {otherVideos.map((video) => (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{opacity: 0, x: 20}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: -20}}
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                      delay: 0.1
                    }}
                    className="flex-shrink-0 w-32 h-24"
                  >
                    <VideoItem
                      video={video}
                      isPinned={false}
                      onPinClick={() => handleVideoClick(video)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HybridPinBoard;
