import * as React from "react";

interface SimpleControlsProps {
  currentVideoCount: number;
  onVideoCountChange: (count: number) => void;
}

const SimpleControls: React.FC<SimpleControlsProps> = ({
  currentVideoCount,
  onVideoCountChange,
}) => {
  return (
    <div className="flex gap-2">
      {[1, 2, 4, 8, 12, 16, 20].map((count) => (
        <button
          key={count}
          onClick={() => onVideoCountChange(count)}
          className={`
                  px-3 py-1 text-sm rounded transition-colors cursor-pointer
                  ${
                    currentVideoCount === count
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-200"
                  }
                `}
        >
          {count}
        </button>
      ))}
    </div>
  );
};

export default SimpleControls;
