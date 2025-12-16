import useThemedStyle from '@/app/hooks/use-themed-style';
import CommentIcon from '@/assets/svgs/my/comment-icon';
import LikedIcon from '@/assets/svgs/my/like-icon';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function PostItem({ post }) {
  const { styles, primaryColors } = useThemedStyle(getStyles);

  const hasImage = !!post.imageUrl;

  const textContent = (
    <>
      <Text style={styles.titleText}>{post.title}</Text>
      <Text style={styles.contentText} numberOfLines={2}>
        {post.contentPreview}
      </Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailText}># {post.category}</Text>
        <Text style={styles.detailText}>{post.timeAgo}</Text>
      </View>
      <View style={styles.reactionRow}>
        <LikedIcon color={primaryColors.color} />
        <Text style={styles.reactionText}>{post.likeCount}</Text>
        <CommentIcon color={primaryColors.color} />
        <Text style={styles.reactionText}>{post.commentCount}</Text>
      </View>
    </>
  );

  return (
    <Pressable style={styles.container}>
      {hasImage ? (
        <View style={styles.contentWrapperRow}>
          <View style={styles.contentWrapperCol}>{textContent}</View>
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View style={styles.contentWrapper}>{textContent}</View>
      )}
    </Pressable>
  );
}

const getStyles = (isDark, primaryColors) => {
  return StyleSheet.create({
    container: {
      paddingVertical: 20,
      paddingHorizontal: 12,
      backgroundColor: isDark ? '#323232' : '#F4F2F2',
      marginBottom: 12,
      borderRadius: 10,
    },

    contentWrapper: {
      flexDirection: 'column',
      gap: 8,
    },

    contentWrapperRow: {
      flexDirection: 'row',
      gap: 8,
    },

    contentWrapperCol: {
      flex: 1,
      flexDirection: 'column',
      gap: 10,
    },

    titleText: {
      fontSize: 18,
      fontWeight: '700',
      color: primaryColors.color,
    },

    contentText: {
      fontSize: 14,
      fontWeight: '500',
      color: primaryColors.color,
    },

    detailRow: {
      flexDirection: 'row',
      gap: 9,
    },

    detailText: {
      fontSize: 14,
      fontWeight: '500',
      color: primaryColors.color,
    },

    reactionRow: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
    },

    reactionText: {
      fontSize: 14,
      fontWeight: '500',
      color: primaryColors.color,
    },

    thumbnail: {
      width: 100,
      height: 100,
      borderRadius: 16,
    },
  });
};
