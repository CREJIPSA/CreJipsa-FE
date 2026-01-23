import { AuthContext } from '@/app/_layout';
import { updateMyChannels } from '@/app/api/my';
import useThemedStyle from '@/app/hooks/use-themed-style';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ChannelAddModal({ visible, onClose, onRefresh }) {
  const { accessToken } = useContext(AuthContext);
  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);

  // 상태 관리
  const [selectedPlatform, setSelectedPlatform] = useState('YOUTUBE');
  const [channelId, setChannelId] = useState('');
  const [isMain, setIsMain] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const platforms = [
    {
      key: 'YOUTUBE',
      label: 'Youtube',
      icon: require('@/assets/images/platform_logo/youtube_logo.png'),
    },
    {
      key: 'INSTAGRAM',
      label: 'Instagram',
      icon: require('@/assets/images/platform_logo/instagram_logo.png'),
    },
    {
      key: 'TIKTOK',
      label: 'TikTok',
      icon: require('@/assets/images/platform_logo/tiktok_logo.png'),
    },
  ];

  useEffect(() => {
    if (visible) {
      // 열릴 때 애니메이션
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // 닫혀있을 때 위치 초기화
      translateY.setValue(SCREEN_HEIGHT);
      // 상태 초기화
      setChannelId('');
      setIsMain(false);
      setSelectedPlatform('YOUTUBE');
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleSave = async () => {
    if (!channelId.trim()) {
      Alert.alert('알림', '채널 아이디를 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      const rawBody = {
        activeYoutube: selectedPlatform === 'YOUTUBE' ? channelId : undefined,
        activeTiktok: selectedPlatform === 'TIKTOK' ? channelId : undefined,
        activeInsta: selectedPlatform === 'INSTAGRAM' ? channelId : undefined,
        mainPlatform: isMain ? selectedPlatform : undefined,
      };

      const requestBody = Object.entries(rawBody).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value;
          }
          return acc;
        },
        {},
      );

      const result = await updateMyChannels(requestBody, accessToken);

      if (result.success) {
        Alert.alert('성공', '채널 정보가 저장되었습니다.', [
          {
            text: '확인',
            onPress: () => {
              if (onRefresh) onRefresh();
              handleClose();
            },
          },
        ]);
      } else {
        Alert.alert('실패', result.message || '저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Update Channel Error:', error);
      Alert.alert('오류', '서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              backgroundColor: isDark ? '#262626' : '#FFFFFF',
              transform: [{ translateY }],
            },
          ]}
        >
          <Pressable style={styles.content} onPress={e => e.stopPropagation()}>
            {/* 상단 헤더 영역: 대표 설정 및 저장 버튼 */}
            <View style={styles.header}>
              <Pressable
                style={styles.checkRow}
                onPress={() => setIsMain(!isMain)}
              >
                {/* --- 체크박스 영역 수정 --- */}
                <View
                  style={[
                    styles.checkbox,
                    isMain && {
                      backgroundColor: primaryColors.pointColor,
                      borderColor: primaryColors.pointColor,
                    },
                  ]}
                >
                  {isMain && (
                    <Ionicons name="checkmark" size={14} color="#000" />
                  )}
                </View>
                {/* ----------------------- */}
                <Text
                  style={[
                    styles.label,
                    { color: isDark ? '#FFFFFF' : '#000000' },
                  ]}
                >
                  대표 프로필로 설정
                </Text>
              </Pressable>

              <Pressable
                style={styles.saveButton}
                onPress={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={styles.saveText}>저장</Text>
                )}
              </Pressable>
            </View>

            {/* 플랫폼 선택 영역 */}
            <Text style={styles.sectionTitle}>채널 플랫폼</Text>
            <View style={styles.platformRow}>
              {platforms.map(p => (
                <Pressable
                  key={p.key}
                  onPress={() => setSelectedPlatform(p.key)}
                  style={[
                    styles.platformItem,
                    selectedPlatform === p.key && styles.selectedPlatform,
                  ]}
                >
                  <Image source={p.icon} style={styles.platformIcon} />
                  <Text
                    style={[
                      styles.platformText,
                      {
                        color:
                          selectedPlatform === p.key
                            ? primaryColors.pointColor
                            : primaryColors.color,
                      },
                    ]}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* 아이디 입력 영역 */}
            <Text style={styles.sectionTitle}>채널 아이디</Text>
            <TextInput
              style={styles.input}
              value={channelId}
              onChangeText={setChannelId}
              placeholder="@아이디를 입력하세요"
              placeholderTextColor="#666"
              autoCapitalize="none"
            />
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const getStyles = (isDark, primaryColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    bottomSheet: {
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingBottom: 40,
    },
    content: {
      padding: 24,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: 30,
      gap: 12,
    },
    checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    checkbox: {
      width: 20, // 아이콘이 들어가므로 크기를 살짝 키우면 더 예쁩니다
      height: 20,
      borderWidth: 1.5,
      borderColor: isDark ? '#666' : '#CCC', // 체크 안됐을 때 테두리 색상
      borderRadius: 4,
      justifyContent: 'center', // 아이콘 중앙 정렬
      alignItems: 'center',
    },
    saveButton: {
      backgroundColor: primaryColors.pointColor,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      minWidth: 60,
      alignItems: 'center',
    },
    saveText: { fontWeight: '700', color: '#000' },
    sectionTitle: {
      color: primaryColors.pointColor,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 16,
    },
    platformRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 30,
      justifyContent: 'space-between',
    },
    platformItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    platformIcon: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
    },
    platformText: {
      fontSize: 14,
      fontWeight: '600',
    },
    selectedPlatform: {
      borderColor: primaryColors.pointColor,
      borderRadius: 10,
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: primaryColors.pointColor,
      color: primaryColors.color,
      fontSize: 18,
      paddingVertical: 8,
    },
  });
