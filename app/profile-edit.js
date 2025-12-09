import useThemedStyle from '@/app/hooks/use-themed-style';
import AddIcon from '@/assets/svgs/my/add-icon';
import EditIcon from '@/assets/svgs/my/edit-icon.js';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeleteIcon from '../assets/svgs/my/delete-icon.js';
import InterestTag from './components/profile-edit/InterestTag';
import MyInterestTag from './components/profile-edit/MyInterestTag';

export default function ProfileEdit() {
  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);

  const nickname = '혜안';
  const [profileImage, setProfileImage] = useState(null);

  const myChannels = [
    {
      type: 'youtube',
      id: '@suucong',
      isMain: true,
      icon: require('../assets/images/platform_logo/youtube_logo.png'),
    },
    {
      type: 'tiktok',
      id: '@suucong',
      isMain: false,
      icon: require('../assets/images/platform_logo/tiktok_logo.png'),
    },
    {
      type: 'instagram',
      id: '@suucong',
      isMain: false,
      icon: require('../assets/images/platform_logo/instagram_logo.png'),
    },
  ];

  const allInterests = ['일상/밈', '게임', '패션', '음악', '뷰티', '반려동물'];
  const myInterests = ['일상/밈', '게임', '패션'];

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('사진첩 접근 권한이 없습니다!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: styles.safeAreaBg }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>마이</Text>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../assets/images/profile.png')
              }
              style={styles.avatar}
            />
            <Pressable style={styles.editButton} onPress={pickImage}>
              <EditIcon isDark={isDark} />
            </Pressable>
          </View>
          <Text style={styles.name}>{nickname}</Text>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.boxContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.boxTitleText}>내 채널 정보</Text>
              <AddIcon
                fillColor={primaryColors.pointColor}
                color={primaryColors.iconPrimaryColor}
                isDark={isDark}
              />
            </View>
            <View style={styles.channelContainer}>
              {myChannels.map((channel, index) => (
                <View key={index} style={styles.channelRowContainer}>
                  <View style={styles.rowContainer}>
                    <View style={styles.channel}>
                      <Image
                        source={channel.icon}
                        style={styles.channelLogoImage}
                      />
                      <Text style={styles.detailText}>{channel.id}</Text>
                      {channel.isMain && (
                        <View style={styles.defaultChannelLogo}>
                          <Text style={styles.defaultChannelText}>대표</Text>
                        </View>
                      )}
                    </View>
                    <DeleteIcon color={primaryColors.color} />
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.boxContainer}>
            <View style={styles.myInfoContainer}>
              <Text style={styles.boxTitleText}>생년월일</Text>
              <Text style={styles.detailText}>2000.00.00</Text>
            </View>
            <View style={styles.myInfoContainer}>
              <Text style={styles.boxTitleText}>성별</Text>
              <Text style={styles.detailText}>여성</Text>
            </View>
          </View>
          <View style={styles.boxContainer}>
            <View style={styles.interestHeaderContainer}>
              <Text style={styles.boxTitleText}>관심분야</Text>
              <View style={styles.myInterestTagContainer}>
                {myInterests.map((tag, index) => (
                  <MyInterestTag
                    key={index}
                    label={tag}
                    onRemove={() => console.log(`${tag} 삭제`)}
                    isDark={isDark}
                  />
                ))}
              </View>
            </View>
            <View style={styles.interestTagContainer}>
              {allInterests.map((tag, index) => (
                <InterestTag
                  key={index}
                  label={tag}
                  onClick={() => console.log(`${tag} 추가`)}
                  isDark={isDark}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (isDark, primaryColors) => {
  const boxColor = isDark ? '#323232' : '#F4F2F2';
  const AVATAR_SIZE = 130;

  return {
    safeAreaBg: primaryColors.background,

    container: {
      paddingHorizontal: 16,
      paddingTop: 32,
      paddingBottom: 40,
      backgroundColor: primaryColors.background,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 32,
      color: primaryColors.color,
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: 50,
      gap: 20,
    },
    avatarContainer: {
      width: 130,
      height: 130,
      position: 'relative',
    },
    avatar: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: AVATAR_SIZE / 2,
      backgroundColor: '#cccccc',
    },
    editButton: {
      position: 'absolute',
      top: 0,
      left: AVATAR_SIZE,
      width: 28,
      height: 28,
    },
    name: {
      fontSize: 20,
      fontWeight: '700',
      color: primaryColors.color,
    },
    infoSection: {
      borderRadius: 20,
      marginTop: 16,
      gap: 20,
    },
    boxContainer: {
      backgroundColor: boxColor,
      borderRadius: 16,
      paddingVertical: 20,
      paddingHorizontal: 16,
      gap: 20,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    boxTitleText: {
      fontSize: 18,
      fontWeight: '700',
      color: primaryColors.color,
    },
    channelContainer: {
      gap: 20,
    },
    channelRowContainer: {
      flexDirection: 'column',
      gap: 8,
    },
    channel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    detailText: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
      color: primaryColors.color,
    },
    defaultChannelLogo: {
      borderWidth: 1.5,
      borderColor: '#A3CC52',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 99,
    },
    defaultChannelText: {
      fontSize: 12,
      lineHeight: 12,
      color: '#A3CC52',
      fontWeight: '500',
    },
    channelLogoImage: {
      width: 20,
      height: 20,
    },
    myInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    interestHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
    },
    myInterestTagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    interestTagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      rowGap: 12,
      columnGap: 10,
    },
  };
};
