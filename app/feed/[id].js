import { AuthContext } from '@/app/_layout';
import {
  createComment,
  fetchPostDetail,
  likeFeedPost,
  unlikeFeedPost,
} from '@/app/api/feed';
import { deletePost } from '@/app/api/my';
import CategoryBadge from '@/app/components/feed/CategoryBadge';
import DeleteComponent from '@/app/components/my/DeleteComponent';
import { COMMUNITY_FIELDS } from '@/app/constants/common/COMMUNITY_FIELDS';
import { getPlatformLogo } from '@/app/constants/common/PLATFORM_LOGOS';
import useThemedStyle from '@/app/hooks/use-themed-style';
import CommentIcon from '@/assets/svgs/common/comment-icon';
import LikedIcon from '@/assets/svgs/common/like-icon';
import CommentSendIcon from '@/assets/svgs/feed/comment-send-icon';
import ReplyArrowIcon from '@/assets/svgs/feed/reply-arrow-icon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeedDetail() {
  const { id } = useLocalSearchParams();
  const { accessToken } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const data = await fetchPostDetail(id, accessToken);

      if (!data?.success) {
        throw new Error(data?.message || '데이터를 불러오지 못했습니다.');
      }
      setPost(data.result);
      setLikeCount(data.result.likeCount || 0);
      setIsLiked(Boolean(data.result.isLiked));
    } catch (error) {
      Alert.alert('알림', error.message || '데이터를 불러오지 못했습니다.');

      setPost(prev => {
        if (!prev) router.back();
        return prev;
      });
    }
  }, [id, accessToken, router]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchPost();
      setLoading(false);
    };
    init();
  }, [fetchPost]);

  if (loading || !post) {
    return (
      <View
        style={[
          styles.mainContainer,
          {
            paddingTop: insets.top,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Text style={{ color: primaryColors.color }}>로딩 중...</Text>
      </View>
    );
  }

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
              const result = await deletePost(id, accessToken);

              if (result.success) {
                Alert.alert('성공', '게시글이 삭제되었습니다.', [
                  {
                    text: '확인',
                    onPress: () => router.back(),
                  },
                ]);
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

  const handleLikePress = async () => {
    try {
      let result;
      if (!isLiked) {
        result = await likeFeedPost(id, accessToken);
      } else {
        result = await unlikeFeedPost(id, accessToken);
      }

      if (result?.success) {
        await fetchPost();
      } else {
        Alert.alert('알림', result?.message || '처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('Like Toggle Error:', error);
      Alert.alert('오류', '좋아요 처리에 실패했습니다.');
    }
  };

  const imageCount = post.imageUrls?.length || 0;

  const cancelReply = () => {
    setReplyTarget(null);
    setCommentText('');
  };

  const handleCommentChange = input => {
    if (replyTarget) {
      const prefix = `@${replyTarget.name} `;

      if (!input.startsWith(prefix)) {
        setCommentText(prefix);
      } else {
        setCommentText(input);
      }
    } else {
      setCommentText(input);
    }
  };

  const handleReplyPress = (commentId, authorName) => {
    if (replyTarget?.id === commentId) {
      cancelReply();
    } else {
      setReplyTarget({ id: commentId, name: authorName });
      setCommentText(`@${authorName} `);
    }
  };

  const handleSendComment = async () => {
    if (isSending) return;

    if (!commentText.trim()) {
      Alert.alert('알림', '댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSending(true);

      let finalContent = commentText;
      if (replyTarget) {
        const prefix = `@${replyTarget.name} `;

        if (commentText.startsWith(prefix)) {
          finalContent = commentText.slice(prefix.length);
        }
      }

      if (!finalContent.trim()) {
        Alert.alert('알림', '답글 내용을 입력해주세요.');
        return;
      }

      const commentData = {
        content: finalContent.trim(),
        parentId: replyTarget ? replyTarget.id : null,
      };

      const result = await createComment(id, commentData, accessToken);

      if (result?.success) {
        Alert.alert('댓글이 등록되었습니다.');
        cancelReply();
        await fetchPost();
      }
    } catch (error) {
      Alert.alert('오류', error.message || '댓글 등록에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.postContainer}>
            <View style={styles.categoryRow}>
              <CategoryBadge text={COMMUNITY_FIELDS[post.field]} />
              {post.isWriter && (
                <DeleteComponent isDark={isDark} onDelete={handleDelete} />
              )}
            </View>
            <View style={styles.mainContentBox}>
              <View style={styles.authorProfileBox}>
                <Image
                  source={{ uri: post.writer.profileImageUrl }}
                  style={styles.authorProfileImage}
                />
                <View style={styles.authorProfileDetailCol}>
                  <Text style={styles.authorName}>{post.writer.nickName}</Text>
                  <View style={styles.authorProfileDetailRow}>
                    {post.writer.mainPlatform && (
                      <>
                        <Image
                          source={getPlatformLogo(post.writer.mainPlatform)}
                          style={styles.authorPlatformImage}
                        />
                        <Text style={styles.authorProfileDetailText}>
                          {post.writer.mainPlatformId}
                        </Text>
                      </>
                    )}
                    <Text style={styles.authorProfileDetailText}>
                      {post.relativeTime}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.postTitleText}>{post.title}</Text>
              <Text style={styles.defaultText}>{post.content}</Text>
              {imageCount > 0 && (
                <View style={styles.imageSection}>
                  {imageCount === 1 ? (
                    <Image
                      source={{ uri: post.imageUrls[0] }}
                      style={styles.singleImage}
                    />
                  ) : (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.multiImageScrollContent}
                    >
                      {post.imageUrls.map((url, index) => (
                        <Image
                          key={index}
                          source={{ uri: url }}
                          style={styles.multiImage}
                        />
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}
              <View style={styles.reactionRow}>
                <Pressable style={styles.reactionBox} onPress={handleLikePress}>
                  <LikedIcon
                    size={16}
                    color={
                      isLiked ? primaryColors.pointColor : primaryColors.color
                    }
                  />
                  <Text
                    style={[
                      styles.defaultText,
                      isLiked && { color: primaryColors.pointColor },
                    ]}
                  >
                    좋아요
                  </Text>
                  <Text
                    style={[
                      styles.defaultText,
                      isLiked && { color: primaryColors.pointColor },
                    ]}
                  >
                    {likeCount}
                  </Text>
                </Pressable>
                <View style={styles.reactionBox}>
                  <CommentIcon size={16} color={primaryColors.color} />
                  <Text style={styles.defaultText}>댓글</Text>
                  <Text style={styles.defaultText}>{post.commentCount}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.commentSection}>
            {post.comments.map(comment => (
              <Fragment key={comment.commentId}>
                <Pressable
                  onPress={() =>
                    handleReplyPress(comment.commentId, comment.writer.nickName)
                  }
                  style={[
                    styles.commentItem,
                    replyTarget?.id === comment.commentId &&
                      styles.activeCommentItem,
                  ]}
                >
                  <View>
                    <View style={styles.authorProfileBox}>
                      <Image
                        source={{ uri: comment.writer.profileImageUrl }}
                        style={styles.authorProfileImage}
                      />
                      <View style={styles.authorProfileDetailCol}>
                        <Text style={styles.authorName}>
                          {comment.writer.nickName}
                        </Text>
                        <View style={styles.authorProfileDetailRow}>
                          {comment.writer.mainPlatform && (
                            <>
                              <Image
                                source={getPlatformLogo(
                                  comment.writer.mainPlatform,
                                )}
                                style={styles.authorPlatformImage}
                              />
                              <Text
                                style={styles.commentAuthorProfileDetailText}
                              >
                                {comment.writer.mainPlatformId}
                              </Text>
                            </>
                          )}
                          <Text style={styles.commentAuthorProfileDetailText}>
                            {comment.relativeTime}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.defaultText}>{comment.content}</Text>
                  </View>
                </Pressable>
                {comment.replies &&
                  comment.replies.map(reply => (
                    <View key={reply.commentId} style={styles.replyItem}>
                      <ReplyArrowIcon color={primaryColors.color} />
                      <View style={[styles.commentItem, { flex: 1 }]}>
                        <View style={styles.authorProfileBox}>
                          <Image
                            source={{ uri: reply.writer.profileImageUrl }}
                            style={styles.authorProfileImage}
                          />
                          <View style={styles.authorProfileDetailCol}>
                            <Text style={styles.authorName}>
                              {reply.writer.nickName}
                            </Text>
                            <View style={styles.authorProfileDetailRow}>
                              {reply.writer.mainPlatform && (
                                <>
                                  <Image
                                    source={getPlatformLogo(
                                      reply.writer.mainPlatform,
                                    )}
                                    style={styles.authorPlatformImage}
                                  />
                                  <Text
                                    style={
                                      styles.commentAuthorProfileDetailText
                                    }
                                  >
                                    {reply.writer.mainPlatformId}
                                  </Text>
                                </>
                              )}
                              <Text
                                style={styles.commentAuthorProfileDetailText}
                              >
                                {reply.relativeTime}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <Text style={styles.defaultText}>{reply.content}</Text>
                      </View>
                    </View>
                  ))}
              </Fragment>
            ))}
          </View>
        </ScrollView>
        <View
          style={[
            styles.bottomBar,
            {
              paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 20,
            },
          ]}
        >
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력하세요"
            placeholderTextColor={isDark ? '#454545' : '#F4F2F2'}
            value={commentText}
            onChangeText={handleCommentChange}
          />
          <Pressable
            onPress={handleSendComment}
            disabled={isSending}
            style={{ opacity: isSending ? 0.5 : 1 }}
          >
            <CommentSendIcon
              bgColor={primaryColors.pointColor}
              iconColor={primaryColors.iconPrimaryColor}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDark, primaryColors) => {
  const contentBg = isDark ? '#323232' : '#FFFFFF';
  const PROFILE_IMAGE_SIZE = 36;

  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: contentBg,
    },

    scrollContainer: {
      marginTop: 30,
      backgroundColor: isDark ? 'transparent' : '#ECECEC',
    },

    postContainer: {
      flexDirection: 'column',
      gap: 45,
      paddingHorizontal: 17,
      paddingVertical: 20,
      backgroundColor: contentBg,
    },

    categoryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    mainContentBox: {
      flexDirection: 'column',
      gap: 19,
    },

    authorProfileBox: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },

    authorProfileImage: {
      width: PROFILE_IMAGE_SIZE,
      height: PROFILE_IMAGE_SIZE,
      borderRadius: PROFILE_IMAGE_SIZE / 2,
    },

    authorProfileDetailCol: {
      flexDirection: 'column',
      gap: 5,
    },

    authorName: {
      color: primaryColors.color,
      fontSize: 16,
      fontWeight: 700,
    },

    authorProfileDetailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    authorProfileDetailText: {
      color: primaryColors.color,
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '500',
    },

    authorPlatformImage: {
      width: 14,
      height: 14,
    },

    postTitleText: {
      color: primaryColors.color,
      fontSize: 18,
      fontWeight: '700',
    },

    defaultText: {
      color: primaryColors.color,
      fontSize: 16,
      fontWeight: '500',
    },

    imageSection: {
      marginTop: 10,
      marginBottom: 10,
    },

    singleImage: {
      width: '100%',
      height: 273,
      borderRadius: 20,
      resizeMode: 'cover',
    },

    multiImageScrollContent: {
      gap: 12,
    },

    multiImage: {
      width: 273,
      height: 273,
      borderRadius: 20,
      resizeMode: 'cover',
    },

    reactionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    reactionBox: {
      flexDirection: 'row',
      gap: 6,
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 43,
    },

    commentSection: {
      flexDirection: 'column',
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 18,
    },

    commentItem: {
      flexDirection: 'column',
      gap: 16,
      borderRadius: 20,
      backgroundColor: contentBg,
      padding: 20,
      borderWidth: 2,
      borderColor: 'transparent',
    },

    activeCommentItem: {
      borderColor: primaryColors.pointColor,
    },

    commentAuthorProfileDetailText: {
      color: isDark ? '#D3D3D3' : '#666666',
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '500',
    },

    replyItem: {
      flexDirection: 'row',
      gap: 3,
    },

    bottomBar: {
      backgroundColor: isDark ? '#323232' : '#F4F2F2',
      flexDirection: 'row',
      gap: 18,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },

    commentInput: {
      flex: 1,
      minHeight: 40,
      backgroundColor: isDark ? '#D3D3D3' : '#D3D3D3',
      borderRadius: 20,
      paddingHorizontal: 20,
    },
  });
};
