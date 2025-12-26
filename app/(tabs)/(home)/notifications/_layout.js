import useThemedStyle from '@/app/hooks/use-themed-style.js';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FeedNotifications from './feed_notifications.js';
import GeneralNotifications from './index.js';

const MaterialTopTabs = createMaterialTopTabNavigator();
export default function NotificationsLayout() {
  const insets = useSafeAreaInsets();
  const { styles, isDark } = useThemedStyle(getStyles);

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <MaterialTopTabs.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: isDark ? '#CCFF66' : '#141414',
          },
          tabBarStyle: {
            backgroundColor: isDark ? '#141414' : '#FAFAFA',
            elevation: 0,
          },
          tabBarItemStyle: {
            flex: 1,
            height: 50,
          },
          tabBarActiveTintColor: isDark ? '#CCFF66' : '#141414',
          tabBarInactiveTintColor: isDark ? '#FAFAFA' : '#D3D3D3',
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 16,
          },
        }}
      >
        <MaterialTopTabs.Screen
          name="NotificationsGeneral"
          component={GeneralNotifications}
          options={{ title: '일반' }}
        />
        <MaterialTopTabs.Screen
          name="NotificationsFeed"
          component={FeedNotifications}
          options={{ title: '피드' }}
        />
      </MaterialTopTabs.Navigator>
    </View>
  );
}

const getStyles = (isDark, primaryColor) => {
  return {
    mainContainer: {
      flex: 1,
      backgroundColor: isDark ? '#141414' : '#FCFCFC',
    },
  };
};
