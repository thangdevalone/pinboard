import * as React from 'react';

interface SimpleControlsProps {
  currentVideoCount: number;
  onVideoCountChange: (count: number) => void;
}

const SimpleControls: React.FC<SimpleControlsProps> = ({
  currentVideoCount,
  onVideoCountChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Video Count:
          </label>
          <div className="flex gap-1">
            {[1, 2, 4, 8, 12, 16, 20].map((count) => (
              <button
                key={count}
                onClick={() => onVideoCountChange(count)}
                className={`
                  px-3 py-1 text-sm rounded transition-colors
                  ${currentVideoCount === count
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleControls;
