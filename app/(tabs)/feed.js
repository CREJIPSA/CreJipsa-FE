import NotificationIcon from '@/assets/svgs/feed/notification-icon';
import SearchIcon from '@/assets/svgs/feed/search-icon';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemedStyle from '../hooks/use-themed-style';

const RecommendScreen = () => (
  <View style={{ flex: 1 }}>
    <Text>추천 화면</Text>
  </View>
);
const TipScreen = () => (
  <View style={{ flex: 1 }}>
    <Text>팁 화면</Text>
  </View>
);
const CollabScreen = () => (
  <View style={{ flex: 1 }}>
    <Text>같이 촬영해요 화면</Text>
  </View>
);

const MaterialTopTabs = createMaterialTopTabNavigator();

export default function Feed() {
  const insets = useSafeAreaInsets();
  const { isDark, styles } = useThemedStyle(getStyles);
  const [text, setText] = useState('');

  // 아이콘 색상 설정
  const searchIconColor = isDark ? '#141414' : '#202020';
  const notificationIconColor = isDark ? '#FAFAFA' : '#141414';
  const tabBarBg = isDark ? '#141414' : '#FAFAFA';

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.searchBarContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.searchInput}
            onChangeText={setText}
            value={text}
            placeholder="검색어를 입력해주세요."
            placeholderTextColor="#959595"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.searchIconContainer}>
            <SearchIcon color={searchIconColor} />
          </View>
        </View>
        <NotificationIcon color={notificationIconColor} />
      </View>

      <MaterialTopTabs.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: tabBarBg,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#293314' : '#FAFAFA',
          },

          tabBarIndicatorStyle: {
            backgroundColor: isDark ? '#CCFF66' : '#293314',
            height: 2,
          },

          tabBarActiveTintColor: isDark ? '#CCFF66' : '#293314',
          tabBarInactiveTintColor: isDark ? '#FAFAFA' : '#293314',
          tabBarLabelStyle: styles.tabText,

          tabBarItemStyle: styles.tabItem,

          tabBarScrollEnabled: false,

          tabBarPressColor: 'transparent',
        }}
      >
        <MaterialTopTabs.Screen
          name="recommend"
          component={RecommendScreen}
          options={{ title: '추천' }}
        />
        <MaterialTopTabs.Screen
          name="tip"
          component={TipScreen}
          options={{ title: '팁' }}
        />
        <MaterialTopTabs.Screen
          name="collab"
          component={CollabScreen}
          options={{ title: '같이 촬영해요' }}
        />
      </MaterialTopTabs.Navigator>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => {
  const headerBg = isDark ? '#141414' : '#FAFAFA';

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
      backgroundColor: '#E6E6E6',
      borderRadius: 100,
      paddingHorizontal: 15,
    },

    searchIconContainer: {
      position: 'absolute',
      right: 15,
    },

    tabBarRow: {
      flexDirection: 'row',
    },

    tabItem: {
      flex: 1,
      flexDirection: 'row',
      gap: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },

    tabText: {
      fontSize: 16,
      fontWeight: '700',
    },
  });
};
