import useThemedStyle from '@/app/hooks/use-themed-style';
import MenuIcon from '@/assets/svgs/storyboard/menu.js';
import SendIcon from '@/assets/svgs/storyboard/send.js';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StoryboardDrawer from './drawer';

export default function Storyboard() {
  const insets = useSafeAreaInsets();
  const { styles, primaryColors } = useThemedStyle(getStyles);
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.titleText}>AI 스토리보드 생성</Text>
        <Pressable onPress={() => setDrawerVisible(true)}>
          <MenuIcon color={primaryColors.color} size={24} />
        </Pressable>
      </View>
      <ScrollView>
        {/* 채팅 */}
        <Text style={styles.initialText}>
          크집사에게{'\n'}
          <Text style={styles.highlightText}>스토리보드</Text> 부탁하기
        </Text>
      </ScrollView>
      <View style={styles.chatBar}>
        <TextInput
          style={styles.chatInput}
          placeholder="스토리보드 생성을 부탁하세요."
          placeholderTextColor={'#959595'}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable style={styles.sendButton}>
          <SendIcon color={'#141414'} size={12} />
        </Pressable>
      </View>
      <StoryboardDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: primaryColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColors.color,
  },
  chatBar: {
    backgroundColor: isDark ? '#141414' : '#FAFAFA',
    borderTopWidth: 0.5,
    borderTopColor: isDark ? '#D3D3D3' : '#666666',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 22,
    gap: 20,
  },
  chatInput: {
    width: '85%',
    backgroundColor: isDark ? '#323232' : '#E6E6E6',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: primaryColors.color,
    fontSize: 16,
  },
  sendButton: {
    width: 33,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    backgroundColor: isDark ? '#CCFF66' : '#C6E945',
    borderRadius: 100,
  },
  initialText: {
    marginTop: 130,
    color: isDark ? '#FAFAFA' : '#323232',
    fontSize: 20,
    textAlign: 'center',
  },
  highlightText: {
    fontWeight: 'bold',
    color: isDark ? '#D7FF88' : '#C6E945',
  },
});
