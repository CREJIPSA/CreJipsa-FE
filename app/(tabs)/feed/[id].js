import CategoryBadge from '@/app/components/feed/CategoryBadge';
import SearchBar from '@/app/components/feed/SearchBar';
import { getPlatformLogo } from '@/app/constants/common/PLATFORM_LOGOS';
import DUMMY_POSTS from '@/app/constants/my/DUMMY_POSTS';
import useThemedStyle from '@/app/hooks/use-themed-style';
import CommentIcon from '@/assets/svgs/common/comment-icon';
import LikedIcon from '@/assets/svgs/common/like-icon';
import ThreeDotsIcon from '@/assets/svgs/common/three-dots-icon';
import BackIcon from '@/assets/svgs/feed/back-icon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeedDetail() {
  const { id } = useLocalSearchParams();
  const post = DUMMY_POSTS.find(item => item.id === id);

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
          <View style={styles.replyRow}>
            <View style={styles.replyBox}>
              <LikedIcon size={16} color={primaryColors.color} />
              <Text style={styles.defaultText}>좋아요</Text>
              <Text style={styles.defaultText}>{post.likeCount}</Text>
            </View>
            <View style={styles.replyBox}>
              <CommentIcon size={16} color={primaryColors.color} />
              <Text style={styles.defaultText}>댓글</Text>
              <Text style={styles.defaultText}>{post.commentCount}</Text>
            </View>
          </View>
        </View>
      </View>
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

    replyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    replyBox: {
      flexDirection: 'row',
      gap: 6,
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 43,
    },
  });
};
