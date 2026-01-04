import DropdownInnerOption from '@/app/components/storyboard/dropdown-inner-option';
import ChatStorageData from '@/app/constants/storyboard/CHATTING_STORAGE.js';
import StoryboardStorageData from '@/app/constants/storyboard/STORYBOARD_STORAGE.js';
import useThemedStyle from '@/app/hooks/use-themed-style';
import CloseIcon from '@/assets/svgs/close.js';
import SearchIcon from '@/assets/svgs/home/search-icon.js';
import ChatStorageIcon from '@/assets/svgs/storyboard/archive.js';
import NewChatIcon from '@/assets/svgs/storyboard/chat.js';
import StoryboardIcon from '@/assets/svgs/storyboard/storyboard.js';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

const width = Math.min(360, 0.9 * Dimensions.get('window').width);

export default function StoryboardDrawer({ visible, onClose }) {
  const { styles, primaryColors, isDark } = useThemedStyle(getStyles);

  const router = useRouter();
  const [isStoryboardDropdownVisible, setIsStoryboardDropdownVisible] =
    useState(false);
  const [isChatDropdownVisible, setIsChatDropdownVisible] = useState(false);

  // 드롭다운이 있는 옵션 컴포넌트
  const dropdownOption = (icon, text, visible) => {
    return (
      <Pressable
        style={[
          styles.drawerOption,
          visible && { backgroundColor: isDark ? '#141414' : '#FAFAFA' },
        ]}
        onPress={() => {
          if (text === '스토리보드 보관함') {
            setIsStoryboardDropdownVisible(!isStoryboardDropdownVisible);
          } else if (text === '채팅 보관함') {
            setIsChatDropdownVisible(!isChatDropdownVisible);
          }
        }}
      >
        {icon({
          color: visible ? styles.mainColor.color : primaryColors.color,
          size: 18.5,
        })}
        <View style={styles.drawerOptionTextContainer}>
          <Text
            style={[
              styles.drawerOptionText,
              {
                color: visible ? styles.mainColor.color : primaryColors.color,
              },
            ]}
          >
            {text}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={visible ? styles.mainColor.color : primaryColors.color}
          />
        </View>
      </Pressable>
    );
  };

  // 더보기 컴포넌트
  const moreOption = label => {
    return (
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Pressable
          style={styles.moreOption}
          onPress={() =>
            label === 'storyboard'
              ? router.navigate('/storyboard/storage')
              : router.navigate('/storyboard/storage/chatting')
          }
        >
          <Text style={styles.moreOptionText}>더보기</Text>
        </Pressable>
      </View>
    );
  };

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
          <Pressable
            style={styles.drawerOption}
            onPress={() => {
              onClose();
              // 채팅 초기화
            }}
          >
            <NewChatIcon color={primaryColors.color} size={20} />
            <Text style={styles.drawerOptionText}>새 채팅</Text>
          </Pressable>
          {dropdownOption(
            StoryboardIcon,
            '스토리보드 보관함',
            isStoryboardDropdownVisible,
          )}
          {/* 스토리보드 드롭다운 */}
          {isStoryboardDropdownVisible && (
            <View style={styles.dropdownContainer}>
              {StoryboardStorageData.slice(0, 5).map((item, index) => (
                <DropdownInnerOption
                  key={item.id}
                  label="storyboard"
                  text={item.text}
                  route={item.route}
                />
              ))}
              {moreOption('storyboard')}
            </View>
          )}
          {dropdownOption(
            ChatStorageIcon,
            '채팅 보관함',
            isChatDropdownVisible,
          )}
          {/* 채팅 드롭다운 */}
          {isChatDropdownVisible && (
            <View style={styles.dropdownContainer}>
              {ChatStorageData.slice(0, 5).map((item, index) => (
                <DropdownInnerOption
                  key={index}
                  label="chatting"
                  text={item.text}
                  route={item.route}
                  onClose={onClose}
                />
              ))}
              {moreOption('chatting')}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (isDark, primaryColors) => {
  return {
    mainColor: {
      color: isDark ? '#CCFF66' : '#C6E945',
    },
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
      shadowColor: '#000',
      shadowOffset: { width: 10, height: 10 },
      shadowOpacity: 0.1,
      elevation: 1,
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
    moreOption: {
      backgroundColor: isDark ? '#E6E6E6' : '#323232',
      borderRadius: 100,
      paddingHorizontal: 20,
      paddingVertical: 2,
    },
    moreOptionText: {
      fontSize: 14,
      color: isDark ? '#323232' : '#E6E6E6',
      textAlign: 'center',
    },
    dropdownContainer: {
      gap: 10,
      marginBottom: 30,
    },
  };
};
