import { Slot } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import StoryboardDrawer from './index.js';

export default function StoryboardDrawerLayout() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Slot context={{ openDrawer: () => setDrawerVisible(true) }} />
      <StoryboardDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </View>
  );
}
