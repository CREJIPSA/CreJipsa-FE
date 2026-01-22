import useThemedStyle from '@/app/hooks/use-themed-style';
import AddIcon from '@/assets/svgs/my/add-icon';
import EditIcon from '@/assets/svgs/my/edit-icon.js';
import * as ImagePicker from 'expo-image-picker';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeleteIcon from '../assets/svgs/my/delete-icon.js';
import { AuthContext } from './_layout.js';
import {
  addInterest,
  deleteInterest,
  fetchMe,
  getMyInterest,
} from './api/my.js';
import ChannelAddModal from './components/profile-edit/ChannelAddModal.js';
import InterestTag from './components/profile-edit/InterestTag';
import MyInterestTag from './components/profile-edit/MyInterestTag';

export default function ProfileEdit() {
  const { accessToken } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [myInterests, setMyInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const safeAreaBg = isDark ? '#202020' : '#FCFCFC';
  const iconColor = isDark ? '#CCFF66' : '#B8E65C';
  const [modalVisible, setModalVisible] = useState(false);

  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);

  const loadUserData = async () => {
    try {
      const [userRes, interestRes] = await Promise.all([
        fetchMe(accessToken),
        getMyInterest(accessToken),
      ]);

      if (userRes.success) setUserInfo(userRes.result);
      if (interestRes.success) setMyInterests(interestRes.result || []);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  };

  const handleAddInterest = async category => {
    try {
      const result = await addInterest(category, accessToken);

      if (result.success) {
        await loadUserData();
        Alert.alert('알림', `'${category}' 카테고리가 추가되었습니다.`);
      } else {
        Alert.alert('오류', result.message || '추가에 실패했습니다.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('오류', '서버 통신 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteInterest = async (interestId, category) => {
    try {
      const result = await deleteInterest(interestId, accessToken);

      if (result.success) {
        await loadUserData();
        Alert.alert('알림', `'${category}' 카테고리가 삭제되었습니다.`);
      } else {
        Alert.alert('오류', result.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '서버 통신 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);

        const [userRes, interestRes] = await Promise.all([
          fetchMe(accessToken),
          getMyInterest(accessToken),
        ]);

        console.log(interestRes);

        if (userRes.success) {
          setUserInfo(userRes.result);
        }

        if (interestRes.success) {
          setMyInterests(interestRes.result || []);
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      loadUserData();
    }
  }, [accessToken]);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: safeAreaBg,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={iconColor} />
      </SafeAreaView>
    );
  }

  const getMyChannels = () => {
    if (!userInfo) return [];

    const platforms = [
      {
        key: 'YOUTUBE',
        id: userInfo.activeYoutube,
        icon: require('@/assets/images/platform_logo/youtube_logo.png'),
      },
      {
        key: 'TIKTOK',
        id: userInfo.activeTiktok,
        icon: require('@/assets/images/platform_logo/tiktok_logo.png'),
      },
      {
        key: 'INSTAGRAM',
        id: userInfo.activeInsta,
        icon: require('@/assets/images/platform_logo/instagram_logo.png'),
      },
    ];

    return platforms
      .filter(p => p.id)
      .map(p => ({
        type: p.key.toLowerCase(),
        id: p.id,
        isMain: userInfo.mainPlatform === p.key,
        icon: p.icon,
      }));
  };

  const myChannels = getMyChannels();

  const fixedAllInterests = [
    '일상',
    '게임',
    '패션',
    '음악',
    '뷰티',
    '반려동물',
    '스포츠',
  ];

  const myInterestCategories = myInterests.map(interest => interest.category);

  const availableInterests = fixedAllInterests.filter(
    tag => !myInterestCategories.includes(tag),
  );

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
            {userInfo?.profileImageUrl ? (
              <Image
                source={{ uri: userInfo.profileImageUrl }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: isDark ? '#454545' : '#D3D3D3' },
                ]}
              />
            )}
            <Pressable style={styles.editButton} onPress={pickImage}>
              <EditIcon isDark={isDark} />
            </Pressable>
          </View>
          <Text style={styles.name}>{userInfo.nickName}</Text>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.boxContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.boxTitleText}>내 채널 정보</Text>
              <Pressable onPress={() => setModalVisible(true)}>
                <AddIcon
                  fillColor={primaryColors.pointColor}
                  color={primaryColors.iconPrimaryColor}
                  isDark={isDark}
                />
              </Pressable>
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
              <Text style={styles.detailText}>
                {userInfo.birth.replaceAll('-', '.')}
              </Text>
            </View>
            <View style={styles.myInfoContainer}>
              <Text style={styles.boxTitleText}>성별</Text>
              <Text style={styles.detailText}>
                {userInfo?.gender === 'FEMALE'
                  ? '여성'
                  : userInfo?.gender === 'MALE'
                    ? '남성'
                    : '-'}
              </Text>
            </View>
          </View>
          <View style={styles.boxContainer}>
            <View style={styles.interestHeaderContainer}>
              <Text style={styles.boxTitleText}>관심분야</Text>
              <View style={styles.myInterestTagContainer}>
                {myInterests.map(interest => (
                  <MyInterestTag
                    key={interest.interestId}
                    label={interest.category}
                    onRemove={() =>
                      handleDeleteInterest(
                        interest.interestId,
                        interest.category,
                      )
                    }
                    isDark={isDark}
                  />
                ))}
              </View>
            </View>
            <View style={styles.interestTagContainer}>
              {availableInterests.map((tag, index) => (
                <InterestTag
                  key={index}
                  label={tag}
                  onClick={() => handleAddInterest(tag)}
                  isDark={isDark}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <ChannelAddModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        isDark={isDark}
        primaryColors={primaryColors}
      />
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
