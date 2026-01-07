import FeedItem from '@/app/components/feed/FeedItem';
import DUMMY_POSTS from '@/app/constants/my/DUMMY_POSTS';
import { FlatList, View } from 'react-native';

const CollaborationScreen = ({ styles }) => (
  <FlatList
    style={styles.feedContentBox}
    data={DUMMY_POSTS}
    renderItem={({ item }) => <FeedItem post={item} isFeed={true} />}
    keyExtractor={item => item.id.toString()}
    ItemSeparatorComponent={() => <View style={styles.postItemSeparator} />}
    contentContainerStyle={{ paddingBottom: 60 }}
  />
);

export default CollaborationScreen;
