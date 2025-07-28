import * as React from "react";
import HybridPinBoard from "./HybridPinBoard";
import SimpleControls from "./SimpleControls.tsx";
import type { IVideoItem } from "./types";

const sampleVideos: IVideoItem[] = [
  {
    id: "host",
    title: "Meeting Host",
    participant: "Sarah Wilson (Host)",
    isPresenter: false,
    color: "bg-gradient-to-br from-purple-500 to-pink-600",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "presenter",
    title: "Presenter",
    participant: "John Smith (Presenter)",
    isPresenter: true,
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "screenshare",
    title: "Screen Share",
    participant: "Emily Chen",
    isPresenter: false,
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: "participant2",
    title: "Designer",
    participant: "Mike Johnson",
    isPresenter: false,
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: "participant3",
    title: "Developer",
    participant: "Lisa Park",
    isPresenter: false,
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: "participant4",
    title: "Product Manager",
    participant: "David Brown",
    isPresenter: false,
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    id: "participant5",
    title: "QA Engineer",
    participant: "Anna Garcia",
    isPresenter: false,
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
  {
    id: "participant6",
    title: "Marketing",
    participant: "Tom Wilson",
    isPresenter: false,
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  },
  {
    id: "participant7",
    title: "Sales",
    participant: "Rachel Green",
    isPresenter: false,
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  },
  {
    id: "participant8",
    title: "Support",
    participant: "Kevin Lee",
    isPresenter: false,
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  },
  {
    id: "participant9",
    title: "HR",
    participant: "Jessica Wang",
    isPresenter: false,
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  },
  {
    id: "participant10",
    title: "Finance",
    participant: "Robert Kim",
    isPresenter: false,
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
  },
];

const getRandomVideos = (count: number): IVideoItem[] => {
  const result: IVideoItem[] = [];

  for (let i = 0; i < count; i++) {
    const base = sampleVideos[i % sampleVideos.length];
    result.push({
      ...base,
      id: `${base.id}-${i}`, // ensure unique ID
      title: `${base.title} ${i + 1}`,
      participant: `${base.participant} ${i + 1}`,
      isPresenter: i === 1,
    });
  }

  return result;
};

export const HybridPinBoardDemo = () => {
  const [currentVideoCount, setCurrentVideoCount] = React.useState(8);
  const [customVideos, setCustomVideos] = React.useState<IVideoItem[]>([]);

  const handleVideoCountChange = (count: number) => {
    setCurrentVideoCount(count);
  };

  React.useEffect(() => {
    setCustomVideos(getRandomVideos(currentVideoCount));
  }, [currentVideoCount]);

  console.log(customVideos);

  return (
    <div className="md:p-4 p-2 space-y-2">
      <SimpleControls
        currentVideoCount={currentVideoCount}
        onVideoCountChange={handleVideoCountChange}
      />
      <HybridPinBoard
        currentVideoCount={currentVideoCount}
        videos={customVideos}
        className="mb-8"
      />
    </div>
  );
};

export default HybridPinBoardDemo;
