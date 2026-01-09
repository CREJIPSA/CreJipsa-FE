import useThemedStyle from '@/app/hooks/use-themed-style';
import { useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import DrawerDefault from './drawer-contents.js';
import DrawerHeader from './drawer-header.js';
import DrawerSearch from './drawer-search.js';
import DrawerShell from './drawer-shell.js';

const width = Math.min(360, 0.9 * Dimensions.get('window').width);

export default function StoryboardDrawer({ visible, onClose }) {
  const { styles } = useThemedStyle(getStyles);

  // 검색 화면 전환
  const [isSearching, setIsSearching] = useState(false);

  return (
    <DrawerShell visible={visible} onClose={onClose}>
      <View style={styles.drawerContainer}>
        <DrawerHeader
          onClose={onClose}
          onFocusSearch={() => setIsSearching(true)}
          onBlurSearch={() => setIsSearching(false)}
        />
        <ScrollView
          style={styles.drawerContent}
          contentContainerStyle={{ gap: 16, paddingBottom: 30 }}
        >
          {isSearching ? (
            <DrawerSearch onCloseSearch={() => setIsSearching(false)} />
          ) : (
            <DrawerDefault onOpenSearch={() => setIsSearching(true)} />
          )}
        </ScrollView>
      </View>
    </DrawerShell>
  );
}

const getStyles = (isDark, primaryColors) => {
  return {
    drawerContainer: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: width,
      backgroundColor: isDark ? '#323232' : '#FFFFFF',
    },
    drawerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: primaryColors.color,
      gap: 14,
    },
    searchContainer: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#FAFAFA' : '#E6E6E6',
      borderRadius: 100,
      paddingLeft: 13,
      paddingRight: 16,
    },
    searchBox: {
      flex: 1,
      minWidth: 0,
      color: '#141414',
      fontSize: 16,
    },
    drawerContent: {
      paddingTop: 30,
      paddingHorizontal: 16,
    },
  };
};
