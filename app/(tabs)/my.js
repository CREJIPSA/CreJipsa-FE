import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import DeleteModal from '../components/DeleteModal.js';

export default function My() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const safeAreaBg = isDark ? '#202020' : '#FCFCFC';
  const iconColor = isDark ? '#CCFF66' : '#B8E65C';
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: safeAreaBg }}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>마이</Text>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/images/profile.png')}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push('/profile-edit')}
            >
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
          <Text style={styles.name}>혜안</Text>
        </View>

        <View style={styles.menuRow}>
          <View style={styles.menuItem}>
            <View style={styles.squareBox}>
              <Svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M12.9854 6.13251C14.224 5.89808 15.4941 5.97542 16.7021 6.35881C17.9102 6.74221 19.0254 7.42189 19.9655 8.34777L20.0173 8.39907L20.0648 8.35243C20.9621 7.47767 22.017 6.82553 23.1591 6.43951C24.3012 6.0535 25.5043 5.94248 26.6881 6.11386L27.0323 6.16982C28.5245 6.45603 29.9192 7.1852 31.0688 8.2801C32.2183 9.375 33.08 10.7949 33.5624 12.3894C34.0449 13.9839 34.1302 15.6936 33.8093 17.3376C33.4885 18.9816 32.7734 20.4985 31.7398 21.7279L31.4879 22.0155L31.4208 22.0792L20.9954 33.5503C20.7548 33.8149 20.4361 33.9735 20.0983 33.997C19.7604 34.0204 19.4264 33.907 19.1581 33.6778L19.0265 33.5503L8.54101 22.0124C7.43022 20.8117 6.64024 19.2929 6.25858 17.6243C5.87691 15.9556 5.91845 14.2021 6.37859 12.558C6.83873 10.9139 7.69951 9.44342 8.86561 8.30932C10.0317 7.17523 11.4576 6.42181 12.9854 6.13251Z"
                  fill={iconColor}
                />
              </Svg>
            </View>
            <Text style={styles.menuText}>내 좋아요함</Text>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.squareBox}>
              <Svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Rect
                  x="3.3335"
                  y="3.33337"
                  width="15.3845"
                  height="15.3437"
                  rx="1.33333"
                  fill="#C9C9C9"
                />
                <Path
                  d="M3.3335 21.323H18.718V36.6667H10.0002C6.31827 36.6667 3.3335 33.6819 3.3335 30V21.323Z"
                  fill="#C9C9C9"
                />
                <Rect
                  x="21.282"
                  y="3.33337"
                  width="15.3845"
                  height="15.3437"
                  rx="1.33333"
                  fill={iconColor}
                />
                <Rect
                  x="21.282"
                  y="21.323"
                  width="15.3845"
                  height="15.3437"
                  rx="1.33333"
                  fill="#C9C9C9"
                />
              </Svg>
            </View>
            <Text style={styles.menuText}>내 키워드함</Text>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.squareBox}>
              <Svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M0 28C0 28.7364 0.596954 29.3333 1.33333 29.3333H5.73322C6.08684 29.3333 6.42598 29.1929 6.67603 28.9428L28.3905 7.22837C28.9112 6.70765 28.9112 5.86338 28.3904 5.34269L23.9899 0.942714C23.4692 0.422061 22.625 0.422092 22.1043 0.942784L0.39051 22.6573C0.14047 22.9074 0 23.2465 0 23.6001V28Z"
                  fill={iconColor}
                />
                <Path
                  d="M16.762 6.28528L23.0475 12.5708L16.762 6.28528Z"
                  fill={iconColor}
                />
                <Path
                  d="M16.762 6.28528L23.0475 12.5708"
                  stroke="black"
                  stroke-width="0.666667"
                  stroke-linejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.menuText}>내가 쓴 글</Text>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.squareBox}>
              <Svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M13.1539 23.8648H27.5128C27.9197 23.8648 28.2609 23.7272 28.5366 23.4521C28.8123 23.1769 28.9497 22.8368 28.9487 22.4316C28.9478 22.0265 28.8099 21.6864 28.5352 21.4112C28.2604 21.136 27.9197 20.9985 27.5128 20.9985H13.1539C12.747 20.9985 12.4062 21.136 12.1315 21.4112C11.8568 21.6864 11.7189 22.0265 11.718 22.4316C11.717 22.8368 11.8548 23.1774 12.1315 23.4535C12.4081 23.7296 12.7489 23.8667 13.1539 23.8648ZM13.1539 19.5653H27.5128C27.9197 19.5653 28.2609 19.4277 28.5366 19.1525C28.8123 18.8773 28.9497 18.5372 28.9487 18.1321C28.9478 17.727 28.8099 17.3868 28.5352 17.1117C28.2604 16.8365 27.9197 16.6989 27.5128 16.6989H13.1539C12.747 16.6989 12.4062 16.8365 12.1315 17.1117C11.8568 17.3868 11.7189 17.727 11.718 18.1321C11.717 18.5372 11.8548 18.8778 12.1315 19.154C12.4081 19.4301 12.7489 19.5672 13.1539 19.5653ZM13.1539 15.2657H27.5128C27.9197 15.2657 28.2609 15.1281 28.5366 14.853C28.8123 14.5778 28.9497 14.2377 28.9487 13.8325C28.9478 13.4274 28.8099 13.0873 28.5352 12.8121C28.2604 12.5369 27.9197 12.3994 27.5128 12.3994H13.1539C12.747 12.3994 12.4062 12.5369 12.1315 12.8121C11.8568 13.0873 11.7189 13.4274 11.718 13.8325C11.717 14.2377 11.8548 14.5783 12.1315 14.8544C12.4081 15.1305 12.7489 15.2676 13.1539 15.2657ZM8.84616 29.5976C8.05642 29.5976 7.38059 29.3171 6.81867 28.7563C6.25676 28.1954 5.97532 27.5204 5.97437 26.7312V9.53299C5.97437 8.74474 6.2558 8.07019 6.81867 7.50934C7.38154 6.94849 8.05737 6.66758 8.84616 6.66663H31.8205C32.6103 6.66663 33.2866 6.94753 33.8494 7.50934C34.4123 8.07115 34.6933 8.7457 34.6923 9.53299V31.8548C34.6923 32.4998 34.3994 32.9479 33.8135 33.1992C33.2277 33.4504 32.7069 33.3487 32.2513 32.8939L28.9487 29.5976H8.84616Z"
                  fill={iconColor}
                />
              </Svg>
            </View>
            <Text style={styles.menuText}>내 댓글함</Text>
          </View>
        </View>

        <View style={styles.editSection}>
          <Text style={styles.sectionTitle}>내 프로필</Text>
          <Text style={styles.sectionItem}>프로필 수정</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>환경 설정</Text>
          <View style={styles.sectionContent}>
            <View style={styles.switchRow}>
              <Text style={styles.sectionItem}>푸시 알림</Text>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: '#555', true: '#d6ff57' }}
                thumbColor={isDark ? '#000' : '#fff'}
              />
            </View>
            <View style={styles.versionRow}>
              <Text style={styles.sectionItem}>버전 정보</Text>
              <Text style={styles.sectionItem}>1234567890</Text>
            </View>
            <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
              <Text style={styles.sectionItem}>회원 탈퇴하기</Text>
            </TouchableOpacity>
          </View>
        </View>
        <DeleteModal
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          isDark={isDark}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = isDark => {
  const colors = {
    background: isDark ? '#202020' : '#FCFCFC',
    textColor: isDark ? 'white' : 'black',
    iconPrimary: isDark ? '#CCFF66' : '#B8E65C',
  };

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingTop: 40,
    },
    header: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textColor,
      marginBottom: 20,
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
      fontSize: 18,
      fontWeight: '700',
      color: colors.textColor,
    },
    menuRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 40,
    },
    menuItem: {
      alignItems: 'center',
      width: '22%',
    },
    squareBox: {
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    menuText: {
      fontSize: 16,
      color: colors.textColor,
      fontWeight: 'bold',
    },
    editSection: {
      marginBottom: 40,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      color: colors.textColor,
      fontWeight: 'bold',
      marginBottom: 30,
    },
    sectionContent: {
      gap: 10,
    },
    sectionItem: {
      color: colors.textColor,
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    versionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
};
