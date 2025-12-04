import useThemedStyle from '@/app/hooks/use-themed-style';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddIcon from '../assets/svgs/add.svg';
import DeleteIcon from '../assets/svgs/delete.svg';
import EditIcon from '../assets/svgs/edit.svg';
import InterestTag from './components/profile-edit/InterestTag';
import MyInterestTag from './components/profile-edit/MyInterestTag';

export default function ProfileEdit() {
  const { isDark, styles } = useThemedStyle(getStyles);

  const nickname = '혜안';
  const [profileImage, setProfileImage] = useState(null);

  const myChannels = [
    {
      type: 'youtube',
      id: '@suucong',
      isMain: true,
      icon: require('../assets/images/youtube_logo.png'),
    },
    {
      type: 'tiktok',
      id: '@suucong',
      isMain: false,
      icon: require('../assets/images/tiktok_logo.png'),
    },
    {
      type: 'instagram',
      id: '@suucong',
      isMain: false,
      icon: require('../assets/images/instagram_logo.png'),
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
              source={require('../assets/images/profile.png')}
              style={styles.avatar}
            />
            <Pressable style={styles.editButton} onPress={pickImage}>
              <EditIcon />
            </Pressable>
          </View>
          <Text style={styles.name}>{nickname}</Text>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.boxContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.boxTitleText}>내 채널 정보</Text>
              <AddIcon />
            </View>
            <View style={styles.channelContainer}>
              {myChannels.map((channel, index) => (
                <View key={index} style={styles.rowContainer}>
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
                  <DeleteIcon />
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

const getStyles = isDark => {
  const colors = {
    background: isDark ? '#202020' : '#FCFCFC',
    textColor: isDark ? 'white' : 'black',
  };

  return {
    safeAreaBg: colors.background,

    container: {
      paddingHorizontal: 16,
      paddingTop: 32,
      paddingBottom: 40,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 32,
      color: colors.textColor,
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: 50,
      gap: 20,
    },
    avatarContainer: {
      width: 120,
      height: 120,
      position: 'relative',
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#cccccc',
    },
    editButton: {
      position: 'absolute',
      top: 0,
      left: 120,
      width: 28,
      height: 28,
    },
    name: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textColor,
    },
    infoSection: {
      borderRadius: 20,
      marginTop: 16,
      gap: 20,
    },
    boxContainer: {
      backgroundColor: '#F4F2F2',
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
      color: colors.textColor,
    },
    channelContainer: {
      gap: 20,
    },
    channel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    detailText: {
      fontSize: 16,
      fontWeight: 500,
    },
    defaultChannelLogo: {
      borderWidth: 1.5,
      borderColor: '#A3CC52',
      paddingHorizontal: 8,
      borderRadius: 99,
      gap: 10,
    },
    defaultChannelText: {
      fontSize: 12,
      color: '#A3CC52',
      fontWeight: 500,
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
