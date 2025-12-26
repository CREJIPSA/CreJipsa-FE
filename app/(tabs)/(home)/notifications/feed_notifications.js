import FeedNotificationData from '@/app/constants/notifications/FEED_NOTIFICATIONS.js';
import useThemedStyle from '@/app/hooks/use-themed-style.js';
import DefaultProfileImage from '@/assets/images/profile-default.png';
import { Image, ScrollView, Text, View } from 'react-native';

export default function FeedNotifications() {
  const { styles } = useThemedStyle(getStyles);

  // 피드 알림 컴포넌트
  const FeedNotification = ({
    profileImage,
    type,
    username,
    content,
    daysAgo,
  }) => {
    // 라우팅 기능 추가 예정
    return (
      <View style={styles.notificationContainer}>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={styles.notificationContent}>
          {type === 'like' ? (
            `${username} 님이 내 피드를 좋아합니다.`
          ) : (
            <>
              {`${username} 님이 내 피드에 댓글을 남겼습니다. `}
              <Text style={styles.commentContent}>{'"' + content + '"'}</Text>
            </>
          )}
        </Text>
        <Text style={styles.notificationDaysAgo}>{daysAgo}일 전</Text>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {FeedNotificationData.map((notification, index) => (
          <FeedNotification
            key={index}
            profileImage={notification.profileImage || DefaultProfileImage}
            type={notification.type}
            username={notification.username}
            content={notification.content}
            daysAgo={notification.daysAgo}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const getStyles = (isDark, primaryColor) => {
  return {
    mainContainer: {
      flex: 1,
      paddingTop: 10,
      paddingHorizontal: 16,
      backgroundColor: primaryColor.background,
    },
    notificationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#323232' : '#E6E6E6',
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 100,
      marginRight: 8,
    },
    notificationContent: {
      flex: 1,
      color: primaryColor.color,
      fontSize: 16,
    },
    commentContent: {
      fontWeight: 'bold',
    },
    notificationDaysAgo: {
      color: primaryColor.color,
      fontSize: 14,
      fontWeight: '300',
      marginLeft: 30,
    },
  };
};
