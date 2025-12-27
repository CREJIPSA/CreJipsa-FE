import GeneralNotificationData from '@/app/constants/notifications/GENERAL_NOTIFICATIONS.js';
import useThemedStyle from '@/app/hooks/use-themed-style.js';
import { FlatList, Text, View } from 'react-native';

export default function GeneralNotifications() {
  const { styles } = useThemedStyle(getStyles);

  // 일반 알람 컴포넌트
  const GeneralNotification = ({ content, daysAgo }) => {
    return (
      // 라우팅 기능 추가 예정
      <View style={styles.notificationContainer}>
        <Text style={styles.notificationContent}>{content}</Text>
        <Text style={styles.notificationDaysAgo}>{daysAgo}일 전</Text>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={GeneralNotificationData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <GeneralNotification content={item.content} daysAgo={item.daysAgo} />
        )}
      />
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
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#323232' : '#E6E6E6',
      gap: 30,
    },
    notificationContent: {
      fontSize: 16,
      color: primaryColor.color,
      flex: 1,
    },
    notificationDaysAgo: {
      fontSize: 14,
      color: primaryColor.color,
      fontWeight: '300',
    },
  };
};
