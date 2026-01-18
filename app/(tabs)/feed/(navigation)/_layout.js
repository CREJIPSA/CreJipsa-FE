import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CollaborationScreen from './CollaborationScreen';
import RecommendScreen from './RecommendationScreen';
import TipScreen from './TipScreen';

const MaterialTopTabs = createMaterialTopTabNavigator();

export default function NavigationLayout({
  isDark,
  styles,
  tabBarBg,
  onTabChange,
  posts,
}) {
  return (
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
        tabBarInactiveTintColor: isDark ? '#FAFAFA' : '#D3D3D3',
        tabBarLabelStyle: styles.tabText,
        tabBarItemStyle: styles.tabItem,
        tabBarScrollEnabled: false,
        tabBarPressColor: 'transparent',
      }}
    >
      <MaterialTopTabs.Screen
        name="recommend"
        options={{ title: '추천' }}
        listeners={{
          focus: () => onTabChange('RECOMMEND'),
        }}
      >
        {() => <RecommendScreen styles={styles} posts={posts} />}
      </MaterialTopTabs.Screen>

      <MaterialTopTabs.Screen
        name="tip"
        options={{ title: '팁' }}
        listeners={{
          focus: () => onTabChange('TIP'),
        }}
      >
        {() => <TipScreen styles={styles} posts={posts} />}
      </MaterialTopTabs.Screen>

      <MaterialTopTabs.Screen
        name="collab"
        options={{ title: '같이 촬영해요' }}
        listeners={{
          focus: () => onTabChange('COLLAB'),
        }}
      >
        {() => <CollaborationScreen styles={styles} posts={posts} />}
      </MaterialTopTabs.Screen>
    </MaterialTopTabs.Navigator>
  );
}
