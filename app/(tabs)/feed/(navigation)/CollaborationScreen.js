import DUMMY_POSTS from '@/app/constants/my/DUMMY_POSTS';
import FeedScreen from './FeedScreen';

const CollaborationScreen = ({ styles }) => {
  return <FeedScreen styles={styles} data={DUMMY_POSTS} />;
};

export default CollaborationScreen;
