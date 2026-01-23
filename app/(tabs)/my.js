import HeartIcon from '@/assets/svgs/my/heart-icon.js';
import PostIcon from '@/assets/svgs/my/post-icon.js';
import ReplyIcon from '@/assets/svgs/my/reply-icon.js';
import TrendIcon from '@/assets/svgs/my/trend-icon.js';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../_layout.js';
import { fetchMe } from '../api/my.js';
import DeleteModal from '../components/DeleteModal.js';

export default function My() {
  const { accessToken } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const safeAreaBg = isDark ? '#202020' : '#FCFCFC';
  const iconColor = isDark ? '#CCFF66' : '#B8E65C';
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const router = useRouter();

  const loadUserData = useCallback(async () => {
    try {
      const data = await fetchMe(accessToken);
      if (data.success) {
        setUserInfo(data.result);
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useFocusEffect(
    useCallback(() => {
      if (accessToken) {
        loadUserData();
      }
    }, [accessToken, loadUserData]),
  );

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: safeAreaBg }}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>마이</Text>

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
          </View>
          <Text style={styles.name}>{userInfo.nickName}</Text>
        </View>

        <View style={styles.menuRow}>
          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/my-likes')}
          >
            <View style={styles.squareBox}>
              <HeartIcon color={iconColor} />
            </View>
            <Text style={styles.menuText}>내 좋아요함</Text>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/my-trends')}
          >
            <View style={styles.squareBox}>
              <TrendIcon color={iconColor} />
            </View>
            <Text style={styles.menuText}>내 트렌드함</Text>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/my-posts')}
          >
            <View style={styles.squareBox}>
              <PostIcon color={iconColor} />
            </View>
            <Text style={styles.menuText}>내가 쓴 글</Text>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => router.push('/my-replys')}
          >
            <View style={styles.squareBox}>
              <ReplyIcon color={iconColor} />
            </View>
            <Text style={styles.menuText}>내 댓글함</Text>
          </Pressable>
        </View>

        <View style={styles.editSection}>
          <Text style={styles.sectionTitle}>내 프로필</Text>
          <Pressable onPress={() => router.push('/profile-edit')}>
            <Text style={styles.sectionItem}>프로필 수정</Text>
          </Pressable>
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
      </ScrollView>
      <DeleteModal
        visible={deleteModalVisible}
        mainText={`회원 탈퇴 시,\n계정 정보는 복구가 불가능합니다.\n정말로 탈퇴하시겠어요?`}
        closeText="계속 사용하기"
        confirmText="탈퇴하기"
        onClose={() => setDeleteModalVisible(false)}
      />
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
