export interface IVideoItem {
  id: string;
  title: string;
  thumbnail?: string;
  duration?: string;
  participant?: string;
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  isPresenter?: boolean; // Indicates if this is a presenter
  color?: string;
  videoUrl?: string; // URL for video stream
}

export interface IPinnedVideo extends IVideoItem {
  pinnedAt: Date;
}

export interface VideoPinBoardProps {
  maxVideos?: number;
  videos?: IVideoItem[];
  onVideoPin?: (video: IVideoItem) => void;
  onVideoUnpin?: (video: IVideoItem) => void;
  className?: string;
}

export interface VideoItemProps {
  video: IVideoItem;
  isPinned?: boolean;
  isPresenter?: boolean;
  onClick?: () => void;
  onPinClick?: () => void;
  onPresentClick?: () => void;
  className?: string;
}

export interface IPinItem {
  id: string;
  content: string;
  color?: string;
  icon?: string;
}

export interface IGridPosition {
  row: number;
  col: number;
}

export interface IPinnedItem extends IPinItem {
  position: IGridPosition;
}

export interface IPinBoardProps {
  gridSize?: number;
  maxItems?: number;
  items?: IPinItem[];
  onItemPin?: (item: IPinItem, position: IGridPosition) => void;
  onItemUnpin?: (item: IPinItem) => void;
  onItemMove?: (item: IPinItem, fromPosition: IGridPosition, toPosition: IGridPosition) => void;
  className?: string;
}

export interface IGridCellProps {
  position: IGridPosition;
  item?: IPinnedItem;
  onDrop: (item: IPinItem, position: IGridPosition) => void;
  onRemove: (item: IPinItem) => void;
}

export interface IPinItemProps {
  item: IPinItem;
  isDragging?: boolean;
  isPinned?: boolean;
}

export interface IControlsProps {
  gridSize: number;
  maxItems: number;
  onGridSizeChange: (size: number) => void;
  onMaxItemsChange: (count: number) => void;
}
