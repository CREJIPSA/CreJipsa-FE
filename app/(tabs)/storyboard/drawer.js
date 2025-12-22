import useThemedStyle from '@/app/hooks/use-themed-style';
import CloseIcon from '@/assets/svgs/close.js';
import SearchIcon from '@/assets/svgs/home/search-icon.js';
import ArchiveIcon from '@/assets/svgs/storyboard/archive.js';
import NewChatIcon from '@/assets/svgs/storyboard/chat.js';
import StoryboardIcon from '@/assets/svgs/storyboard/storyboard.js';
import { Dimensions, Pressable, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

const width = Math.min(360, 0.9 * Dimensions.get('window').width);

export default function StoryboardDrawer({ visible, onClose }) {
  const { styles, primaryColors } = useThemedStyle(getStyles);

  return (
    <Modal
      isVisible={visible}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection="right"
      onSwipeComplete={onClose}
      backdropOpacity={0.3}
      style={{ margin: 0 }}
    >
      <View style={styles.drawerContainer}>
        <View style={styles.drawerHeader}>
          <Pressable onPress={onClose}>
            <CloseIcon color={primaryColors.color} size={13} />
          </Pressable>
          <View style={styles.searchContainer}>
            <SearchIcon color={'#141619'} size={20} />
            <TextInput
              style={styles.searchBox}
              placeholder="검색"
              placeholderTextColor={'#959595'}
            />
          </View>
        </View>
        <View style={styles.drawerContent}>
          <Pressable style={styles.drawerOption}>
            <NewChatIcon color={primaryColors.color} size={20} />
            <Text style={styles.drawerOptionText}>새 채팅</Text>
          </Pressable>
          <Pressable style={styles.drawerOption}>
            <StoryboardIcon color={primaryColors.color} size={18.5} />
            <View style={styles.drawerOptionTextContainer}>
              <Text style={styles.drawerOptionText}>스토리보드 보관함</Text>
              <Pressable>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={primaryColors.color}
                />
              </Pressable>
            </View>
          </Pressable>
          <Pressable style={styles.drawerOption}>
            <ArchiveIcon color={primaryColors.color} size={18} />
            <View style={styles.drawerOptionTextContainer}>
              <Text style={styles.drawerOptionText}>채팅 보관함</Text>
              <Pressable>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={primaryColors.color}
                />
              </Pressable>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (isDark, primaryColors) => ({
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
    paddingHorizontal: 13,
  },
  searchBox: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
    color: '#141414',
    fontSize: 16,
  },
  drawerContent: {
    paddingTop: 30,
    paddingHorizontal: 16,
    gap: 16,
  },
  drawerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 17,
    gap: 10,
    backgroundColor: isDark ? '#454545' : '#E6E6E6',
    borderRadius: 16,
  },
  drawerOptionText: {
    fontSize: 16,
    color: primaryColors.color,
  },
  drawerOptionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
});
