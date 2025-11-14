import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="(home)/index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search-trend" options={{ title: 'SearchTrend' }} />
      <Tabs.Screen name="storyboard" options={{ title: 'Storyboard' }} />
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="my" options={{ title: 'My' }} />
    </Tabs>
  )
}