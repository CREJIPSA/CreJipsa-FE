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
  Keyboard,
  Modal,
  Platform,
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

  const [selectedPlatform, setSelectedPlatform] = useState('YOUTUBE');
  const [channelId, setChannelId] = useState('');
  const [isMain, setIsMain] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(SCREEN_HEIGHT);
      setChannelId('');
      setIsMain(false);
      setSelectedPlatform('YOUTUBE');
      setKeyboardHeight(0); // 닫힐 때 높이 초기화
    }
  }, [visible, translateY]);

  const handleClose = () => {
    Keyboard.dismiss(); // 닫을 때 키보드 먼저 닫기
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
          if (value !== undefined) acc[key] = value;
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
      <Pressable
        style={[styles.overlay, { paddingBottom: keyboardHeight }]}
        onPress={handleClose}
      >
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              backgroundColor: isDark ? '#262626' : '#FFFFFF',
              transform: [{ translateY }],
            },
          ]}
        >
          {/* 내부 클릭 시 키보드 닫히지 않게 stopPropagation */}
          <Pressable style={styles.content} onPress={e => e.stopPropagation()}>
            <View style={styles.header}>
              <Pressable
                style={styles.checkRow}
                onPress={() => setIsMain(!isMain)}
              >
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

            <Text style={styles.sectionTitle}>채널 아이디</Text>
            <TextInput
              style={styles.input}
              value={channelId}
              onChangeText={setChannelId}
              placeholder="@아이디를 입력하세요"
              placeholderTextColor="#666"
              autoCapitalize="none"
              onSubmitEditing={handleSave}
              disableFullscreenUI={true}
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
      width: 20,
      height: 20,
      borderWidth: 1.5,
      borderColor: isDark ? '#666' : '#CCC',
      borderRadius: 4,
      justifyContent: 'center',
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
