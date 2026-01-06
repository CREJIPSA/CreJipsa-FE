import useThemedStyle from '@/app/hooks/use-themed-style';
import CommentIcon from '@/assets/svgs/my/comment-icon';
import LikedIcon from '@/assets/svgs/my/like-icon';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function FeedItem({ post }) {
  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);

  const hasImage = !!post.imageUrl;

  const textContent = (
    <>
      <View style={styles.titleTextRow}>
        <Text style={styles.titleText} numberOfLines={1}>
          {post.title}
        </Text>
      </View>
      <Text style={styles.contentText} numberOfLines={2}>
        {post.contentPreview}
      </Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailText}># {post.category}</Text>
        <Text style={styles.detailText}>{post.timeAgo}</Text>
      </View>
    </>
  );

  const reactionRowContent = (
    <>
      <View style={styles.reactionRow}>
        <LikedIcon color={primaryColors.color} />
        <Text style={styles.reactionText}>{post.likeCount}</Text>
        <CommentIcon color={primaryColors.color} />
        <Text style={styles.reactionText}>{post.commentCount}</Text>
      </View>
    </>
  );

  return (
    <Pressable>
      {hasImage ? (
        <View style={styles.contentWrapperCol}>
          <View style={styles.contentWrapperRow}>
            <View style={styles.contentWrapperCol}>{textContent}</View>
            <Image
              source={{ uri: post.imageUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          </View>
          {reactionRowContent}
        </View>
      ) : (
        <View style={styles.contentWrapper}>
          {textContent}
          {reactionRowContent}
        </View>
      )}
    </Pressable>
  );
}

const getStyles = (isDark, primaryColors) => {
  return StyleSheet.create({
    contentWrapper: {
      flexDirection: 'column',
      gap: 10,
    },

    contentWrapperRow: {
      flexDirection: 'row',
      gap: 28,
    },

    contentWrapperCol: {
      flex: 1,
      flexDirection: 'column',
      gap: 10,
    },

    titleText: {
      fontSize: 18,
      fontWeight: '700',
      maxWidth: 244,
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
      color: isDark ? '#B7B7B7' : '#8A8A8A',
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
