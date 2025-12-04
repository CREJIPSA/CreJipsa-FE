import TabFeedIcon from '@/assets/svgs/tab-feed-icon';
import TabHomeIcon from '@/assets/svgs/tab-home-icon';
import TabMyIcon from '@/assets/svgs/tab-my-icon';
import TabSearchIcon from '@/assets/svgs/tab-search-icon';
import TabStoryboardIcon from '@/assets/svgs/tab-storyboard-icon';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemedStyle from '../hooks/use-themed-style';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { isDark, styles } = useThemedStyle(getStyles);
  // 탭바 아이콘 컴포넌트
  function TabBarIcon({ name, focused }) {
    const fill = focused ? styles.focusedColor : styles.unFocusedColor;

    if (name === 'home') {
      return <TabHomeIcon fill={fill} />;
    }

    if (name === 'search') {
      return <TabSearchIcon fill={fill} />;
    }

    if (name === 'storyboard') {
      return <TabStoryboardIcon fill={fill} />;
    }

    if (name === 'feed') {
      return <TabFeedIcon fill={fill} />;
    }

    if (name === 'my') {
      return <TabMyIcon fill={fill} />;
    }

    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#141414' : '#FAFAFA' }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBar,
            marginBottom: insets.bottom,
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={{
                    color: focused
                      ? styles.focusedColor
                      : styles.unFocusedColor,
                    fontSize: 12,
                  }}
                >
                  홈
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="home" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="search-trend"
          options={{
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={{
                    color: focused
                      ? styles.focusedColor
                      : styles.unFocusedColor,
                    fontSize: 12,
                  }}
                >
                  트렌드 검색
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="search" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="storyboard"
          options={{
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={{
                    color: focused
                      ? styles.focusedColor
                      : styles.unFocusedColor,
                    fontSize: 12,
                  }}
                >
                  스토리보드
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="storyboard" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="feed"
          options={{
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={{
                    color: focused
                      ? styles.focusedColor
                      : styles.unFocusedColor,
                    fontSize: 12,
                  }}
                >
                  피드
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="feed" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="my"
          options={{
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={{
                    color: focused
                      ? styles.focusedColor
                      : styles.unFocusedColor,
                    fontSize: 12,
                  }}
                >
                  마이
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => (
              <TabBarIcon name="my" focused={focused} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const getStyles = isDark => ({
  focusedColor: isDark ? '#FAFAFA' : '#141414',
  unFocusedColor: isDark ? '#878787' : '#959595',
  tabBar: {
    height: 70,
    paddingTop: 15,
    paddingBottom: 8,
    backgroundColor: isDark ? '#141414' : '#FAFAFA',
    borderTopWidth: 0,
  },
});
