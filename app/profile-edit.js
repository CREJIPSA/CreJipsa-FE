import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

export default function ProfileEdit() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const nickname = '혜안';
  const [profileImage, setProfileImage] = useState(null);

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
            <TouchableOpacity style={styles.editButton} onPress={pickImage}>
              <Svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <G clipPath="url(#clip0_1046_3548)">
                  <Circle cx="12" cy="12" r="12" fill="#959595" />
                  <Path
                    d="M5.21729 17.7971C5.21729 18.5335 5.81424 19.1304 6.55062 19.1304H7.64626C7.99989 19.1304 8.33903 18.99 8.58907 18.7399L18.1875 9.14154C18.7082 8.62081 18.7081 7.77655 18.1874 7.25586L17.0915 6.16012C16.5708 5.63947 15.7266 5.6395 15.2059 6.16019L5.60779 15.7587C5.35776 16.0087 5.21729 16.3478 5.21729 16.7014V17.7971Z"
                    fill="#454545"
                  />
                  <Path
                    d="M13.1677 8.19861L16.149 11.1799L13.1677 8.19861Z"
                    fill="#454545"
                  />
                  <Path
                    d="M13.1677 8.19861L16.149 11.1799"
                    stroke="black"
                    strokeWidth="0.666667"
                    strokeLinejoin="round"
                  />
                </G>
                <Defs>
                  <ClipPath id="clip0_1046_3548">
                    <Rect width="24" height="24" fill="white" />
                  </ClipPath>
                </Defs>
              </Svg>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{nickname}</Text>
        </View>

        {/* 여기에 다음 단계에서 섹션들 추가 */}
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
      paddingHorizontal: 24,
      paddingTop: 32,
      paddingBottom: 40,
      backgroundColor: colors.background,
      flex: 1,
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
      backgroundColor: '#fff',
    },
    editButton: {
      position: 'absolute',
      top: 0,
      left: 120,
      width: 28,
      height: 28,
    },
    name: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textColor,
    },
  };
};
