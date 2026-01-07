import FeedItem from '@/app/components/feed/FeedItem';
import { FlatList, View } from 'react-native';

const FeedScreen = ({ styles, data }) => (
  <FlatList
    style={styles.feedContentBox}
    data={data}
    renderItem={({ item }) => <FeedItem post={item} />}
    keyExtractor={item => item.id}
    ItemSeparatorComponent={() => <View style={styles.postItemSeparator} />}
    contentContainerStyle={{ paddingBottom: 60 }}
  />
);

export default FeedScreen;
