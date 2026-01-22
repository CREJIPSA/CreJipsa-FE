import { AuthContext } from '@/app/_layout';
import { deletePost } from '@/app/api/my';
import { COMMUNITY_FIELDS } from '@/app/constants/common/COMMUNITY_FIELDS';
import useThemedStyle from '@/app/hooks/use-themed-style';
import CommentIcon from '@/assets/svgs/common/comment-icon';
import LikedIcon from '@/assets/svgs/common/like-icon';
import { router } from 'expo-router';
import { useContext } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import DeleteComponent from './DeleteComponent';

export default function PostItem({
  post,
  isMyReplys = false,
  isLikePage = false,
  onDeleteSuccess,
}) {
  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);
  const { accessToken } = useContext(AuthContext);

  const hasImage = !!post.thumbnailUrl;

  const handlePress = () => {
    router.push(`/feed/${post.communityId}`);
  };

  const handleDelete = () => {
    Alert.alert(
      '게시글 삭제',
      '이 게시글을 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await deletePost(post.communityId, accessToken);

              if (result.success) {
                Alert.alert('성공', '게시글이 삭제되었습니다.');
                if (onDeleteSuccess) {
                  onDeleteSuccess(post.communityId);
                }
              } else {
                Alert.alert('실패', '게시글 삭제에 실패했습니다.');
              }
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('오류', '게시글 삭제 중 오류가 발생했습니다.');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const showDeleteButton = !isLikePage && !isMyReplys;

  const textContent = (
    <>
      {(isMyReplys || !hasImage) && (
        <View style={styles.titleTextRow}>
          <Text style={styles.titleText} numberOfLines={1}>
            {post.title}
          </Text>
          {showDeleteButton && (
            <DeleteComponent isDark={isDark} onDelete={handleDelete} />
          )}
        </View>
      )}
      <Text style={styles.contentText} numberOfLines={2}>
        {post.contentPreview}
      </Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailText}>#{COMMUNITY_FIELDS[post.field]}</Text>
        <Text style={styles.detailText}>{post.relativeTime}</Text>
      </View>
      {!isMyReplys && (
        <View style={styles.reactionRow}>
          <LikedIcon color={primaryColors.color} />
          <Text style={styles.reactionText}>{post.likeCount}</Text>
          <CommentIcon color={primaryColors.color} />
          <Text style={styles.reactionText}>{post.commentCount}</Text>
        </View>
      )}
    </>
  );

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      {hasImage && !isMyReplys ? (
        <View style={styles.contentWrapperCol}>
          <View style={styles.titleTextRow}>
            <Text style={styles.titleText} numberOfLines={1}>
              {post.title}
            </Text>
            {showDeleteButton && (
              <DeleteComponent isDark={isDark} onDelete={handleDelete} />
            )}
          </View>
          <View style={styles.contentWrapperRow}>
            <View style={styles.contentWrapperCol}>{textContent}</View>
            <Image
              source={{ uri: post.thumbnailUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          </View>
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

    titleTextRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
