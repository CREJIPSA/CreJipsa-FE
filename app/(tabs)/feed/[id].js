import { AuthContext } from '@/app/_layout';
import { fetchPostDetail, likeFeedPost } from '@/app/api/feed';
import CategoryBadge from '@/app/components/feed/CategoryBadge';
import SearchBar from '@/app/components/feed/SearchBar';
import { COMMUNITY_FIELDS } from '@/app/constants/common/COMMUNITY_FIELDS';
import { getPlatformLogo } from '@/app/constants/common/PLATFORM_LOGOS';
import useThemedStyle from '@/app/hooks/use-themed-style';
import CommentIcon from '@/assets/svgs/common/comment-icon';
import LikedIcon from '@/assets/svgs/common/like-icon';
import ThreeDotsIcon from '@/assets/svgs/common/three-dots-icon';
import BackIcon from '@/assets/svgs/feed/back-icon';
import CommentSendIcon from '@/assets/svgs/feed/comment-send-icon';
import ReplyArrowIcon from '@/assets/svgs/feed/reply-arrow-icon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Fragment, useContext, useEffect, useState } from 'react';
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
  const [text, setText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [isLiked, setIsLiked] = useState(false); // 로컬 상태
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        const data = await fetchPostDetail(id, accessToken);
        if (data.success) {
          setPost(data.result);
          setLikeCount(data.result.likeCount || 0);
        }
      } catch (error) {
        console.error('상세 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id, accessToken]);

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

  const handleLikePress = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikeCount(prev => (nextState ? prev + 1 : prev - 1));

    try {
      const result = await likeFeedPost(id, accessToken);
      console.log(result.message);

      if (!result.success) {
        setIsLiked(!nextState);
        setLikeCount(prev => (nextState ? prev - 1 : prev + 1));
        Alert.alert('알림', '처리에 실패했습니다.');
      }
    } catch (error) {
      setIsLiked(!nextState);
      setLikeCount(prev => (nextState ? prev - 1 : prev + 1));
      console.error('Like Error:', error);
    }
  };

  const imageCount = post.imageUrls?.length || 0;
  const iconColor = isDark ? '#FAFAFA' : '#141414';

  const handleReplyPress = (commentId, authorName) => {
    setReplyTarget({ id: commentId, name: authorName });
    setCommentText(`@${authorName} `);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
        <View style={styles.searchBarContainer}>
          <Pressable onPress={() => router.back()}>
            <BackIcon color={iconColor} />
          </Pressable>
          <SearchBar value={text} onChangeText={setText} styles={styles} />
        </View>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.postContainer}>
            <View style={styles.categoryRow}>
              <CategoryBadge text={COMMUNITY_FIELDS[post.field]} />
              <ThreeDotsIcon isDark={isDark} />
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
                    <Image
                      source={getPlatformLogo(post.writer.mainPlatform)}
                      style={styles.authorPlatformImage}
                    />
                    <Text style={styles.authorProfileDetailText}>
                      {post.writer.mainPlatformId}
                    </Text>
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
                    // 1장일 때: 가로로 꽉 찬 이미지
                    <Image
                      source={{ uri: post.imageUrls[0] }}
                      style={styles.singleImage}
                    />
                  ) : (
                    // 2장 이상일 때: 273x273 정사각형 스크롤
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
                          <Image
                            source={getPlatformLogo(
                              comment.writer.mainPlatform,
                            )}
                            style={styles.authorPlatformImage}
                          />
                          <Text style={styles.commentAuthorProfileDetailText}>
                            {comment.writer.mainPlatformId}
                          </Text>
                          <Text style={styles.commentAuthorProfileDetailText}>
                            {comment.createdAt}
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
                              <Image
                                source={getPlatformLogo(
                                  reply.writer.mainPlatform,
                                )}
                                style={styles.authorPlatformImage}
                              />
                              <Text
                                style={styles.commentAuthorProfileDetailText}
                              >
                                {reply.writer.mainPlatformId}
                              </Text>
                              <Text
                                style={styles.commentAuthorProfileDetailText}
                              >
                                {reply.createdAt}
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
        <View style={styles.bottomBar}>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력하세요"
            placeholderTextColor={isDark ? '#454545' : '#F4F2F2'}
            value={commentText}
            onChangeText={setCommentText}
          />
          <CommentSendIcon
            bgColor={primaryColors.pointColor}
            iconColor={primaryColors.iconPrimaryColor}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDark, primaryColors) => {
  const headerBg = isDark ? '#141414' : '#FAFAFA';
  const contentBg = isDark ? '#323232' : '#FFFFFF';
  const PROFILE_IMAGE_SIZE = 36;

  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: headerBg,
    },

    scrollContainer: {
      backgroundColor: isDark ? 'transparent' : '#ECECEC',
    },

    searchBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 22,
      paddingTop: 20,
      paddingBottom: 10,
      paddingHorizontal: 16,
      backgroundColor: headerBg,
    },

    inputWrapper: {
      flex: 1,
      position: 'relative',
      justifyContent: 'center',
    },

    searchInput: {
      flexDirection: 'row',
      gap: 90,
      backgroundColor: isDark ? '#E6E6E6' : '#EFF1F4',
      borderRadius: 100,
      paddingHorizontal: 15,
    },

    searchIconContainer: {
      position: 'absolute',
      right: 15,
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
