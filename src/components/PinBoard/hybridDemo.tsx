import HybridPinBoard from './HybridPinBoard';
import type {IVideoItem} from './types';

export const HybridPinBoardDemo = () => {
  const customVideos: IVideoItem[] = [
    {
      id: 'host',
      title: 'Meeting Host',
      participant: 'Sarah Wilson (Host)',
      isPresenter: false,
      color: 'bg-gradient-to-br from-purple-500 to-pink-600'
    },
    {
      id: 'presenter',
      title: 'Presenter',
      participant: 'John Smith (Presenter)',
      isPresenter: true,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600'
    },
    {
      id: 'screenshare',
      title: 'Screen Share',
      participant: 'Emily Chen (Screen Share)',
      isPresenter: false,
      color: 'bg-gradient-to-br from-green-500 to-teal-600'
    },
    {
      id: 'participant2',
      title: 'Designer',
      participant: 'Mike Johnson',
      isPresenter: false,
      color: 'bg-gradient-to-br from-orange-500 to-red-600'
    },
    {
      id: 'participant3',
      title: 'Developer',
      participant: 'Lisa Park',
      isPresenter: false,
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600'
    },
    {
      id: 'participant4',
      title: 'Product Manager',
      participant: 'David Brown',
      isPresenter: false,
      color: 'bg-gradient-to-br from-teal-500 to-green-600'
    },
    {
      id: 'participant5',
      title: 'QA Engineer',
      participant: 'Anna Garcia',
      isPresenter: false,
      color: 'bg-gradient-to-br from-pink-500 to-rose-600'
    },
    {
      id: 'participant6',
      title: 'Marketing',
      participant: 'Tom Wilson',
      isPresenter: false,
      color: 'bg-gradient-to-br from-yellow-500 to-orange-600'
    },
    {
      id: 'participant7',
      title: 'Sales',
      participant: 'Rachel Green',
      isPresenter: false,
      color: 'bg-gradient-to-br from-cyan-500 to-blue-600'
    },
    {
      id: 'participant8',
      title: 'Support',
      participant: 'Kevin Lee',
      isPresenter: false,
      color: 'bg-gradient-to-br from-red-500 to-pink-600'
    },
    {
      id: 'participant9',
      title: 'HR',
      participant: 'Jessica Wang',
      isPresenter: false,
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600'
    },
    {
      id: 'participant10',
      title: 'Finance',
      participant: 'Robert Kim',
      isPresenter: false,
      color: 'bg-gradient-to-br from-violet-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        <HybridPinBoard
          gridSize={4}
          maxVideos={20}
          videos={customVideos}
          className="mb-8"
        />
      </div>
    </div>
  );
};

export default HybridPinBoardDemo;
