import instagramLogo from '@/assets/images/platform_logo/instagram_logo.png';
import tiktokLogo from '@/assets/images/platform_logo/tiktok_logo.png';
import youtubeLogo from '@/assets/images/platform_logo/youtube_logo.png';
import AlarmIcon from '@/assets/svgs/home/alarm-icon.js';
import SearchIcon from '@/assets/svgs/home/search-icon.js';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Image } from 'expo-image';
import { withLayoutContext } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemedStyle from '../../hooks/use-themed-style';

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

export default function HomeLayout() {
  const insets = useSafeAreaInsets();

  const { isDark, styles } = useThemedStyle(getStyles);

  // 플랫폼 선택
  const platformOptions = [
    { key: 'youtube', logo: youtubeLogo, name: 'YouTube' },
    { key: 'instagram', logo: instagramLogo, name: 'Instagram' },
    { key: 'tiktok', logo: tiktokLogo, name: 'TikTok' },
  ];
  const [selectedPlatform, setSelectedPlatform] = useState('youtube');
  const [isPlatformDropdownVisible, setIsPlatformDropdownVisible] =
    useState(false);
  const getPlatformInfo = selectedPlatform => {
    switch (selectedPlatform) {
      case 'youtube':
        return { logo: youtubeLogo, name: 'Youtube' };
      case 'instagram':
        return { logo: instagramLogo, name: 'Instagram' };
      case 'tiktok':
        return { logo: tiktokLogo, name: 'TikTok' };
      default:
        return { logo: youtubeLogo, name: 'YouTube' };
    }
  };
  const { logo: platformLogo, name: platformName } =
    getPlatformInfo(selectedPlatform);

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        {/* 플랫폼 선택 */}
        <View style={styles.platformSelectionContainer}>
          <View style={styles.selectedPlatform}>
            <Image source={platformLogo} style={styles.platformLogo} />
            <Text style={styles.platformName}>{platformName}</Text>
          </View>
          <Pressable
            style={styles.dropdownButton}
            onPress={() =>
              setIsPlatformDropdownVisible(!isPlatformDropdownVisible)
            }
          >
            {isPlatformDropdownVisible ? (
              <Ionicons
                name="caret-up-outline"
                size={10}
                color={isDark ? '#141414' : '#fff'}
              ></Ionicons>
            ) : (
              <Ionicons
                name="caret-down-outline"
                size={10}
                color={isDark ? '#141414' : '#fff'}
              ></Ionicons>
            )}
          </Pressable>
        </View>
        {/* 플랫폼 선택 드롭다운 */}
        <Modal
          visible={isPlatformDropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsPlatformDropdownVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setIsPlatformDropdownVisible(false)}
          >
            <View style={styles.dropdownContainer}>
              {platformOptions.map(option => (
                <Pressable
                  key={option.key}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedPlatform(option.key);
                    setIsPlatformDropdownVisible(false);
                  }}
                >
                  <Image source={option.logo} style={styles.platformLogo} />
                  <Text style={styles.dropdownPlatformName}>{option.name}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
        {/* 검색 알림 아이콘 */}
        <View style={styles.iconContainer}>
          <Pressable>
            <SearchIcon size={24} color={isDark ? '#FAFAFA' : '#141414'} />
          </Pressable>
          <Pressable>
            <AlarmIcon size={24} color={isDark ? '#FAFAFA' : '#141414'} />
          </Pressable>
        </View>
      </View>
      {/* 내비게이션 */}
      <MaterialTopTabs
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: isDark ? '#CCFF66' : '#141414',
          },
          tabBarStyle: {
            backgroundColor: isDark ? '#141414' : '#FAFAFA',
            marginLeft: 10,
            elevation: 0,
          },
          tabBarGap: 10,
          tabBarItemStyle: {
            width: 'auto',
            height: 45,
            paddingHorizontal: 8,
            marginHorizontal: 0,
            alignItems: 'center',
          },
          tabBarActiveTintColor: isDark ? '#CCFF66' : '#141414',
          tabBarInactiveTintColor: isDark ? '#FAFAFA' : '#141414',
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 16,
          },
          tabBarScrollEnabled: true,
        }}
      >
        <MaterialTopTabs.Screen name="index" options={{ title: '전체' }} />
        <MaterialTopTabs.Screen
          name="dailyMeme"
          options={{ title: '일상/밈' }}
        />
        <MaterialTopTabs.Screen name="game" options={{ title: '게임' }} />
        <MaterialTopTabs.Screen name="fashion" options={{ title: '패션' }} />
        <MaterialTopTabs.Screen name="music" options={{ title: '음악' }} />
        <MaterialTopTabs.Screen name="pet" options={{ title: '반려동물' }} />
        <MaterialTopTabs.Screen name="beauty" options={{ title: '뷰티' }} />
        <MaterialTopTabs.Screen name="sports" options={{ title: '스포츠' }} />
      </MaterialTopTabs>
    </View>
  );
}

const getStyles = isDark => {
  const colors = {
    background: isDark ? '#141414' : '#FAFAFA',
    text: isDark ? '#FAFAFA' : '#141414',
  };

  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
    },
    platformSelectionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 20,
    },
    selectedPlatform: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    platformLogo: {
      width: 30,
      height: 30,
    },
    platformName: {
      fontWeight: 'bold',
      fontSize: 20,
      color: colors.text,
    },
    dropdownButton: {
      height: 20,
      width: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#D7FF88' : '#141414',
      borderRadius: 4,
      marginLeft: 20,
    },
    iconContainer: {
      flexDirection: 'row',
      position: 'absolute',
      right: 20,
      gap: 10,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    dropdownContainer: {
      position: 'absolute',
      top: 45,
      left: 16,
      backgroundColor: '#323232',
      borderRadius: 10,
      padding: 10,
      elevation: 5,
    },
    dropdownOption: {
      width: 230,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 16,
      paddingVertical: 12,
      gap: 12,
    },
    dropdownPlatformName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FAFAFA',
    },
  });
};
