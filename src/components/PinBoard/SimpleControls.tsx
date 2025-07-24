import * as React from 'react';

interface SimpleControlsProps {
  gridSize: number;
  maxVideos: number;
  presenterMode: boolean;
  onGridSizeChange: (size: number) => void;
  onMaxVideosChange: (count: number) => void;
  onPresenterModeChange: (enabled: boolean) => void;
}

const SimpleControls: React.FC<SimpleControlsProps> = ({
  gridSize,
  maxVideos,
  presenterMode,
  onGridSizeChange,
  onMaxVideosChange,
  onPresenterModeChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Grid Size:
          </label>
          <div className="flex gap-1">
            {[3, 4, 5, 6].map((size) => (
              <button
                key={size}
                onClick={() => onGridSizeChange(size)}
                className={`
                  px-3 py-1 text-sm rounded transition-colors
                  ${gridSize === size
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {size}×{size}
              </button>
            ))}
          </div>
        </div>

        {/* Max Videos Control */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Max Videos:
          </label>
          <div className="flex gap-1">
            {[12, 16, 20, 24].map((count) => (
              <button
                key={count}
                onClick={() => onMaxVideosChange(count)}
                className={`
                  px-3 py-1 text-sm rounded transition-colors
                  ${maxVideos === count
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Presenter Mode Toggle */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Presenter Mode:
          </label>
          <button
            onClick={() => onPresenterModeChange(!presenterMode)}
            className={`
              px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2
              ${presenterMode
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <span>{presenterMode ? '🎤' : '📺'}</span>
            {presenterMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleControls;
