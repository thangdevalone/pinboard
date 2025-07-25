import * as React from 'react';
import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import VideoItem from './VideoItem';
import type {IPinnedVideo, IVideoItem} from './types';
import {X} from 'lucide-react';

interface HybridPinBoardProps {
  videos?: IVideoItem[];
  currentVideoCount?: number;
  onVideoPin?: (video: IVideoItem) => void;
  onVideoUnpin?: (video: IVideoItem) => void;
  className?: string;
}

const calculateGridSize = (videoCount: number): number => {
  if (videoCount <= 1) return 1;
  if (videoCount <= 4) return 2;
  if (videoCount <= 9) return 3;
  if (videoCount <= 16) return 4;
  if (videoCount <= 25) return 5;
  return 6;
};

const HybridPinBoard: React.FC<HybridPinBoardProps> = (props) => {
  const {
    videos: initialVideos = [],
    currentVideoCount: initialVideoCount = 8,
    onVideoPin,
    onVideoUnpin,
  } = props;
  const [currentVideoCount, setCurrentVideoCount] = useState(8);
  const [videos, setVideos] = useState<IVideoItem[]>([]);
  const [pinnedVideo, setPinnedVideo] = useState<IPinnedVideo | null>(null);
  const [presenterVideo, setPresenterVideo] = useState<IVideoItem | null>(null);
  const [showExpandedVideoList, setShowExpandedVideoList] = useState(false);

  useEffect(() => {
    setCurrentVideoCount(initialVideoCount);
  }, [initialVideoCount]);

  const gridSize = calculateGridSize(currentVideoCount);

  useEffect(() => {
    if (initialVideos.length > 0) {
      const newVideos = initialVideos.slice(0, currentVideoCount);
      setVideos(newVideos);
    }
  }, [initialVideos, currentVideoCount]);

  const handlePinVideo = (video: IVideoItem) => {
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

  const handlePresentVideo = (video: IVideoItem) => {
    if (presenterVideo?.id === video.id) {
      // Remove presenter
      setPresenterVideo(null);
    } else {
      // Set as presenter
      setPresenterVideo(video);
    }
  };
  const otherVideos = videos.filter(video =>
    video.id !== presenterVideo?.id && video.id !== pinnedVideo?.id
  );

  const hasDualView = presenterVideo && pinnedVideo;
  const hasLargeView = presenterVideo || pinnedVideo;

  const videoItemWidth = 140;
  const containerPadding = 48;

  const availableWidth = typeof window !== 'undefined'
    ? window.innerWidth - containerPadding
    : 1200;

  const maxVisibleVideos = Math.floor(availableWidth / videoItemWidth);
  const canShowMoreButton = otherVideos.length > maxVisibleVideos;

  const actualVisibleVideos = canShowMoreButton ? maxVisibleVideos - 1 : maxVisibleVideos;
  const stripVideos = otherVideos.slice(0, actualVisibleVideos);
  const hasMoreVideos = otherVideos.length > actualVisibleVideos;
  const remainingVideos = otherVideos.slice(actualVisibleVideos);

  console.log(videos);

  return (

    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Video Meeting ({currentVideoCount} participants)
          {presenterVideo && (
            <span className="ml-2 text-sm text-green-600">
                - {presenterVideo.participant} (Presenter)
              </span>
          )}
          {pinnedVideo && (
            <span className="ml-2 text-sm text-blue-600">
                - {pinnedVideo.participant} (Pinned)
              </span>
          )}
        </h3>
      </div>

      <motion.div
        layout
        className={showExpandedVideoList ? "flex gap-3" : "grid gap-3"}
        style={showExpandedVideoList ? {} : {
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: hasLargeView
            ? `repeat(${gridSize - 1}, minmax(0, 1fr)) auto`
            : `repeat(${gridSize}, minmax(0, 1fr))`
        }}
      >
        <AnimatePresence>
          {presenterVideo && (
            <motion.div
              key={`presenter-${presenterVideo.id}`}
              layout
              initial={{opacity: 0, scale: 0.8}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.8}}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
              className={`relative aspect-video ${showExpandedVideoList ? 'flex-1' : 'w-full'}`}
              style={showExpandedVideoList ? {} : {
                gridColumn: hasDualView
                  ? `1 / ${Math.ceil(gridSize / 2) + 1}`
                  : `1 / ${gridSize + 1}`,
                gridRow: `1 / ${gridSize}`
              }}
            >
              <VideoItem
                video={presenterVideo}
                isPresenter={true}
                onPinClick={() => handlePinVideo(presenterVideo)}
                onPresentClick={() => handlePresentVideo(presenterVideo)}
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
              className={`relative aspect-video ${showExpandedVideoList ? 'flex-1' : 'w-full'}`}
              style={showExpandedVideoList ? {} : {
                gridColumn: hasDualView
                  ? `${Math.ceil(gridSize / 2) + 1} / ${gridSize + 1}` // Right half when dual view
                  : `1 / ${gridSize + 1}`, // Full width when solo
                gridRow: `1 / ${gridSize}`
              }}
            >
              <VideoItem
                video={pinnedVideo}
                isPinned={true}
                onPinClick={() => handlePinVideo(pinnedVideo)}
                onPresentClick={() => handlePresentVideo(pinnedVideo)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid Items (when no large view and not expanded) */}
        {!hasLargeView && !showExpandedVideoList && (
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
                    isPresenter={false}
                    onPinClick={() => handlePinVideo(video)}
                    onPresentClick={() => handlePresentVideo(video)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}


        {hasLargeView && otherVideos.length > 0 && !showExpandedVideoList && (
          <motion.div
            layout
            className="flex flex-row gap-2 overflow-x-auto pb-2 video-strip-scrollbar"
            style={{
              gridColumn: `1 / ${gridSize + 1}`,
              gridRow: gridSize,
              minHeight: '80px'
            }}
          >
            <AnimatePresence>
              {stripVideos.map((video) => (
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
                  className="flex-shrink-0 w-32 h-24 aspect-video"
                >
                  <VideoItem
                    video={video}
                    isPinned={pinnedVideo?.id === video.id}
                    isPresenter={presenterVideo?.id === video.id}
                    onPinClick={() => handlePinVideo(video)}
                    onPresentClick={() => handlePresentVideo(video)}
                  />
                </motion.div>
              ))}

              {/* More button - show when there are more videos */}
              {hasMoreVideos && (
                <motion.div
                  layout
                  initial={{opacity: 0, x: 20}}
                  animate={{opacity: 1, x: 0}}
                  exit={{opacity: 0, x: -20}}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                    delay: 0.1
                  }}
                  className="flex-shrink-0 w-32 h-24 aspect-video"
                >
                  <button
                    onClick={() => setShowExpandedVideoList(true)}
                    className="w-full h-full bg-gray-700 hover:bg-gray-600 rounded-lg flex flex-col items-center justify-center text-white transition-colors"
                  >
                    <span className="text-2xl mb-1">⋯</span>
                    <span className="text-xs">+{remainingVideos.length} More</span>
                  </button>
                </motion.div>
              )}


            </AnimatePresence>


          </motion.div>
        )}

        {/* Expanded video list - 2 columns on the right side */}
        {hasLargeView && showExpandedVideoList && (
          <motion.div
            layout
            initial={{opacity: 0, x: 50}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 50}}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="grid grid-cols-2 gap-2 overflow-y-auto pb-2 video-strip-scrollbar bg-gray-800 rounded-lg p-3 flex-shrink-0"

          >
            <AnimatePresence>
              {otherVideos.map((video) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{opacity: 0, scale: 0.8}}
                  animate={{opacity: 1, scale: 1}}
                  exit={{opacity: 0, scale: 0.8}}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="w-30 h-20"
                >
                  <VideoItem
                    video={video}
                    isPinned={pinnedVideo?.id === video.id}
                    isPresenter={presenterVideo?.id === video.id}
                    onPinClick={() => handlePinVideo(video)}
                    onPresentClick={() => handlePresentVideo(video)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.div
              layout
              initial={{opacity: 0, scale: 0.8}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.8}}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="col-span-2 h-12 mt-2"
            >
              <button
                onClick={() => setShowExpandedVideoList(false)}
                className="w-full h-full bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4"/>
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default HybridPinBoard;
