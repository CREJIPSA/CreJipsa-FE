import CategoryBadge from '@/app/components/feed/CategoryBadge';
import SearchBar from '@/app/components/feed/SearchBar';
import { getPlatformLogo } from '@/app/constants/common/PLATFORM_LOGOS';
import DUMMY_POSTS from '@/app/constants/my/DUMMY_POSTS';
import useThemedStyle from '@/app/hooks/use-themed-style';
import CommentIcon from '@/assets/svgs/common/comment-icon';
import LikedIcon from '@/assets/svgs/common/like-icon';
import ThreeDotsIcon from '@/assets/svgs/common/three-dots-icon';
import BackIcon from '@/assets/svgs/feed/back-icon';
import ReplyArrowIcon from '@/assets/svgs/feed/reply-arrow-icon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Fragment, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeedDetail() {
  const { id } = useLocalSearchParams();
  const post = DUMMY_POSTS.find(item => item.id === id);
  const imageCount = post.imageUrls?.length || 0;

  const insets = useSafeAreaInsets();
  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);
  const [text, setText] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (text.trim().length > 0) {
      router.push({
        pathname: '/feed/results',
        params: { q: text },
      });
    }
  };

  const iconColor = isDark ? '#FAFAFA' : '#141414';

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.searchBarContainer}>
        <Pressable onPress={() => router.back()}>
          <BackIcon color={iconColor} />
        </Pressable>
        <SearchBar
          value={text}
          onChangeText={setText}
          onSubmit={handleSearch}
          styles={styles}
          searchIconColor={iconColor}
        />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.postContainer}>
          <View style={styles.categoryRow}>
            <CategoryBadge text={post.category} />
            <ThreeDotsIcon isDark={isDark} />
          </View>
          <View style={styles.mainContentBox}>
            <View style={styles.authorProfileBox}>
              <Image
                source={{ uri: post.author.profileImage }}
                style={styles.authorProfileImage}
              />
              <View style={styles.authorProfileDetailCol}>
                <Text style={styles.authorName}>{post.author.name}</Text>
                <View style={styles.authorProfileDetailRow}>
                  <Image
                    source={getPlatformLogo(post.author.platform)}
                    style={styles.authorPlatformImage}
                  />
                  <Text style={styles.authorProfileDetailText}>
                    {post.author.handle}
                  </Text>
                  <Text style={styles.authorProfileDetailText}>
                    {post.timeAgo}
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
              <View style={styles.reactionBox}>
                <LikedIcon size={16} color={primaryColors.color} />
                <Text style={styles.defaultText}>좋아요</Text>
                <Text style={styles.defaultText}>{post.likeCount}</Text>
              </View>
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
            <Fragment key={comment.id}>
              <View style={styles.commentItem}>
                <View style={styles.authorProfileBox}>
                  <Image
                    source={{ uri: comment.author.profileImage }}
                    style={styles.authorProfileImage}
                  />
                  <View style={styles.authorProfileDetailCol}>
                    <Text style={styles.authorName}>{comment.author.name}</Text>
                    <View style={styles.authorProfileDetailRow}>
                      <Image
                        source={getPlatformLogo(comment.author.platform)}
                        style={styles.authorPlatformImage}
                      />
                      <Text style={styles.commentAuthorProfileDetailText}>
                        {comment.author.handle}
                      </Text>
                      <Text style={styles.commentAuthorProfileDetailText}>
                        {comment.timeAgo}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.defaultText}>{comment.text}</Text>
              </View>
              {comment.replies &&
                comment.replies.map(reply => (
                  <View key={reply.id} style={styles.replyItem}>
                    <ReplyArrowIcon color={primaryColors.color} />
                    <View style={[styles.commentItem, { flex: 1 }]}>
                      <View style={styles.authorProfileBox}>
                        <Image
                          source={{ uri: reply.author.profileImage }}
                          style={styles.authorProfileImage}
                        />
                        <View style={styles.authorProfileDetailCol}>
                          <Text style={styles.authorName}>
                            {reply.author.name}
                          </Text>
                          <View style={styles.authorProfileDetailRow}>
                            <Image
                              source={getPlatformLogo(reply.author.platform)}
                              style={styles.authorPlatformImage}
                            />
                            <Text style={styles.commentAuthorProfileDetailText}>
                              {reply.author.handle}
                            </Text>
                            <Text style={styles.commentAuthorProfileDetailText}>
                              {reply.timeAgo}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Text style={styles.defaultText}>{reply.text}</Text>
                    </View>
                  </View>
                ))}
            </Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
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
      fontWeitht: 500,
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
    },

    commentAuthorProfileDetailText: {
      color: isDark ? '#D3D3D3' : '#666666',
      fontSize: 14,
      lineHeight: 14,
      fontWeitht: 500,
    },

    replyItem: {
      flexDirection: 'row',
      gap: 3,
    },
  });
};
