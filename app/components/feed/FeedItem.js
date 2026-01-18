import { COMMUNITY_FIELDS } from '@/app/constants/common/COMMUNITY_FIELDS';
import useThemedStyle from '@/app/hooks/use-themed-style';
import CommentIcon from '@/assets/svgs/common/comment-icon';
import LikedIcon from '@/assets/svgs/common/like-icon';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function FeedItem({ post }) {
  const { styles, primaryColors } = useThemedStyle(getStyles);

  const {
    communityId,
    field,
    title,
    contentPreview,
    likeCount,
    commentCount,
    relativeTime,
    thumbnailUrl,
  } = post;
  const fieldLabel = COMMUNITY_FIELDS[field] || field;

  const hasImage = !!thumbnailUrl;

  const handlePress = () => {
    router.push(`/feed/${communityId}`);
  };

  const textContent = (
    <>
      <View style={styles.titleTextRow}>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <Text style={styles.contentText} numberOfLines={2}>
        {contentPreview}
      </Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailText}>#{fieldLabel}</Text>
        <Text style={styles.detailText}>{relativeTime}</Text>
      </View>
    </>
  );

  const reactionRowContent = (
    <>
      <View style={styles.reactionRow}>
        <LikedIcon color={primaryColors.color} />
        <Text style={styles.reactionText}>{likeCount}</Text>
        <CommentIcon color={primaryColors.color} />
        <Text style={styles.reactionText}>{commentCount}</Text>
      </View>
    </>
  );

  return (
    <Pressable onPress={handlePress}>
      {hasImage ? (
        <View style={styles.contentWrapperCol}>
          <View style={styles.contentWrapperRow}>
            <View style={styles.contentWrapperCol}>{textContent}</View>
            <Image
              source={{ uri: thumbnailUrl }}
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
