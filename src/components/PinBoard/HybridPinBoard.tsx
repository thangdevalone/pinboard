import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import VideoItem from "./VideoItem";
import type { IPinnedVideo, IVideoItem } from "./types";

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
  if (videoCount <= 16) return 4;
  if (videoCount <= 25) return 6;
  return 6;
};

// Responsive grid columns based on screen size
const getResponsiveGridColumns = (hasLargeView: boolean, gridSize: number): string => {
  if (hasLargeView) {
    // When there's presenter or pinned video, use fixed layout
    return `repeat(${gridSize}, minmax(0, 1fr))`;
  } else {
    // When no large view, use responsive columns
    return `repeat(auto-fit, minmax(200px, 1fr))`;
  }
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
  const pinBoardRef = useRef<HTMLDivElement>(null);
  const [pinboardSize, setPinboardSize] = useState<number>(0);
  const presenterRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  const gridSize = useMemo(() => calculateGridSize(currentVideoCount), [currentVideoCount]);
  
  useEffect(() => {
    setCurrentVideoCount(initialVideoCount);
  }, [initialVideoCount]);

  // Resize observer to track pinboard size changes
  useEffect(() => {
    if (pinBoardRef.current) {
      const updateSize = () => {
        if (pinBoardRef.current) {
          setPinboardSize(pinBoardRef.current.offsetHeight);
        }
      };

      // Initial size
      updateSize();

      // Create ResizeObserver for better performance
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === pinBoardRef.current) {
            updateSize();
          }
        }
      });

      resizeObserverRef.current.observe(pinBoardRef.current);

      // Fallback for older browsers
      const handleResize = () => {
        updateSize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (initialVideos.length > 0) {
      const newVideos = initialVideos.slice(0, currentVideoCount);
      setVideos(newVideos);
    }
  }, [initialVideos, currentVideoCount]);

  const handlePinVideo = useCallback((video: IVideoItem) => {
    if (pinnedVideo?.id === video.id) {
      setPinnedVideo(null);
      onVideoUnpin?.(video);
      // Close expanded video list when unpinning
      if (showExpandedVideoList) {
        setShowExpandedVideoList(false);
      }
    } else {
      const newPinnedVideo: IPinnedVideo = {
        ...video,
        pinnedAt: new Date(),
      };
      setPinnedVideo(newPinnedVideo);
      onVideoPin?.(video);
    }
  }, [pinnedVideo?.id, onVideoUnpin, onVideoPin, showExpandedVideoList]);

  const handlePresentVideo = useCallback((video: IVideoItem) => {
    if (presenterVideo?.id === video.id) {
      setPresenterVideo(null);
      if (showExpandedVideoList) {
        setShowExpandedVideoList(false);
      }
    } else {
      setPresenterVideo(video);
    }
  }, [presenterVideo?.id, showExpandedVideoList]);

  const handleToggleExpandedList = useCallback(() => {
    setShowExpandedVideoList(prev => !prev);
  }, []);

  const otherVideos = useMemo(() => 
    videos.filter(
      (video) => video.id !== presenterVideo?.id && video.id !== pinnedVideo?.id
    ), [videos, presenterVideo?.id, pinnedVideo?.id]
  );

  const hasDualView = useMemo(() => presenterVideo && pinnedVideo, [presenterVideo, pinnedVideo]);
  const hasLargeView = useMemo(() => presenterVideo || pinnedVideo, [presenterVideo, pinnedVideo]);

  const stripVideos = useMemo(() => 
    otherVideos.slice(
      0,
      hasLargeView ? gridSize - 1 : gridSize * gridSize
    ), [otherVideos, hasLargeView, gridSize]
  );
  
  const hasMoreVideos = useMemo(() => 
    otherVideos.length > stripVideos.length, [otherVideos.length, stripVideos.length]
  );

  // Memoize grid styles to prevent unnecessary re-renders
  const gridStyles = useMemo(() => {
    if (hasLargeView) {
      if (hasDualView) {
        // When both presenter and pinned, use 2-row layout
        return {
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(2, minmax(0, 1fr))`,
          aspectRatio: "16/9",
        };
      } else {
        // When only one large view, use single row
        return {
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSize - 1}, minmax(0, 1fr)) auto`,
          aspectRatio: "16/9",
        };
      }
    } else {
      // When no large view, use responsive columns
      return {
        gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
        gridTemplateRows: `repeat(auto-fit, minmax(150px, 1fr))`,
        aspectRatio: "auto",
      };
    }
  }, [gridSize, hasLargeView, hasDualView]);

  return (
    <div className={`flex gap-2 ${showExpandedVideoList ? 'md:flex-row flex-col' : 'flex-col'}`}>
      <motion.div
        layout
        ref={pinBoardRef}
        className={`grid flex-1 gap-1`}
        style={gridStyles}
      >
                  <AnimatePresence>
            {presenterVideo && (
              <motion.div
                key={`presenter-${presenterVideo.id}`}
                ref={presenterRef}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="relative w-full h-full"
                style={{
                  gridColumn: hasDualView
                    ? `1 / ${Math.ceil(gridSize / 2) + 1}`
                    : `1 / ${gridSize + 1}`,
                  gridRow: hasDualView ? `1 / 2` : `1 / ${gridSize}`,
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
                ref={pinnedRef}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="relative w-full h-full"
                style={{
                  gridColumn: hasDualView
                    ? `${Math.ceil(gridSize / 2) + 1} / ${gridSize + 1}`
                    : `1 / ${gridSize + 1}`,
                  gridRow: hasDualView ? `2 / 3` : `1 / ${gridSize}`,
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
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="relative w-full h-full"
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

        {(pinnedVideo || presenterVideo) &&
          otherVideos.length > 0 &&
          !showExpandedVideoList && (
            <AnimatePresence>
              {stripVideos.map((video) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                    delay: 0.1,
                  }}
                  className="w-full h-full"
                  style={{
                    gridRow: hasDualView ? `3 / ${gridSize + 1}` : `auto`,
                  }}
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                    delay: 0.1,
                  }}
                  className="w-full h-full"
                  style={{
                    gridRow: hasDualView ? `3 / ${gridSize + 1}` : `auto`,
                  }}
                >
                  <button
                    onClick={handleToggleExpandedList}
                    className="w-full h-full bg-gray-700 hover:bg-gray-600 rounded-lg flex flex-col items-center justify-center text-white transition-colors"
                  >
                    <span className="text-2xl mb-1">⋯</span>
                    <span className="text-xs">
                      +{otherVideos.length - stripVideos.length} More
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
      </motion.div>

      {/* Expanded video list - responsive layout */}
      <AnimatePresence>
        {showExpandedVideoList && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="w-full md:w-80"
          >
            {/* Mobile: Horizontal scroll below main grid */}
            <div className="md:hidden flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              <AnimatePresence>
                {otherVideos.map((video) => (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="w-40 aspect-video flex-shrink-0"
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
            </div>

            {/* Desktop: Vertical scroll beside main grid */}
            <div className="hidden md:block">
              <div 
                className="custom-scrollbar overflow-y-auto"
                style={{
                  maxHeight: pinboardSize,
                }}
              >
                <div className="grid grid-cols-1 gap-2">
                  <AnimatePresence>
                    {otherVideos.map((video) => (
                      <motion.div
                        key={video.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="w-full aspect-video"
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
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HybridPinBoard;
