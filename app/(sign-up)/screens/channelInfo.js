import instagramLogo from '@/assets/images/platform_logo/instagram_logo.png';
import tiktokLogo from '@/assets/images/platform_logo/tiktok_logo.png';
import youtubeLogo from '@/assets/images/platform_logo/youtube_logo.png';
import RemoveChannelIcon from '@/assets/svgs/signup/remove-channel-icon.js';
import { Ionicons } from '@expo/vector-icons';
import { memo, useContext, useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemedStyle from '../../hooks/use-themed-style';
import { StepContext } from '../step-context';

export default function ChannelInfo() {
  const insets = useSafeAreaInsets();
  const { isDark, styles } = useThemedStyle(getStyles);
  const { step, setStep, form, updateForm, handleNextStep, addChannel } =
    useContext(StepContext);

  const [isPlatformModalVisible, setPlatformModalVisible] = useState(false);

  // 채널 정보 상태 관리
  const tempChannel = form.tempChannel || {
    channelId: '',
    platform: '',
    interests: [],
  };
  const updateTemp = patch => {
    updateForm({
      tempChannel: {
        ...form.tempChannel,
        ...patch,
      },
    });
  };

  // 채널 관리
  const handleAddChannel = () => {
    const newChannel = {
      channelId: tempChannel.channelId,
      platform: tempChannel.platform,
      interests: [...tempChannel.interests],
    };
    addChannel(newChannel);
    // 입력 필드 초기화
    updateTemp({
      channelId: '',
      platform: '',
      interests: [],
    });
  };
  const removeChannel = channelId => {
    const updatedChannelInfo = form.channelInfo.filter(
      channel => channel && channel.channelId !== channelId,
    );
    updateForm({
      channelInfo: updatedChannelInfo,
    });
  };
  useEffect(() => {
    console.log('🟣 Current channelInfo:', form.channelInfo);
  }, [form.channelInfo]);

  // 관심분야 선택 칩 컴포넌트
  const chipOptions = [
    '일상/밈',
    '게임',
    '패션',
    '음악',
    '뷰티',
    '반려동물',
    '스포츠',
  ];
  const Chip = memo(function Chip({ label, isSelected, onPress }) {
    return (
      <Pressable
        style={[isSelected ? styles.selectedChip : styles.baseChip]}
        onPress={onPress}
      >
        <Text
          style={[isSelected ? styles.selectedChipText : styles.baseChipText]}
        >
          {label}
        </Text>
      </Pressable>
    );
  });

  // 선택 칩 상태 관리
  const interests = tempChannel.interests || [];
  const toggle = option => {
    const prev = tempChannel.interests || [];
    const next = prev.includes(option)
      ? prev.filter(item => item !== option)
      : [...prev, option];
    updateTemp({ interests: next });
    return next;
  };

  return (
    <View style={styles.formContainer}>
      {/* 채널 아이디 입력 폼 */}
      <View
        style={[
          styles.inputContainer,
          { display: step >= 6 ? 'flex' : 'none' },
        ]}
      >
        <Text style={styles.inputTitle}>채널 아이디</Text>
        <TextInput
          style={styles.inputForm}
          placeholder="@크집사"
          placeholderTextColor={isDark ? '#A5A5A5' : '#B7B7B7'}
          value={tempChannel.channelId}
          onChangeText={text => {
            updateTemp({ channelId: text });
          }}
          onSubmitEditing={handleNextStep}
        />
      </View>
      {/* 관심분야 선택 폼 */}
      <View
        style={[
          styles.inputContainer,
          { display: step >= 5 ? 'flex' : 'none' },
        ]}
      >
        <Text style={styles.inputTitle}>관심 분야 ( 중복 가능 )</Text>
        <View style={styles.interestFieldOptionContainer}>
          {chipOptions.map(option => (
            <Chip
              key={option}
              label={option}
              isSelected={interests.includes(option)}
              onPress={() => toggle(option)}
            />
          ))}
        </View>
      </View>
      {/* 채널 플랫폼 선택 폼 */}
      <View
        style={[
          styles.inputContainer,
          { display: step >= 4 ? 'flex' : 'none' },
        ]}
      >
        <Text style={styles.inputTitle}>채널 플랫폼</Text>
        <View style={[styles.inputForm, styles.platformInputFormContainer]}>
          {tempChannel.platform === '' ? (
            <Text style={styles.platformInputText}>채널 플랫폼 선택</Text>
          ) : (
            <Text style={styles.platformInputText}>{tempChannel.platform}</Text>
          )}
          <Pressable
            onPress={() => {
              setPlatformModalVisible(true);
            }}
          >
            <Ionicons
              name="chevron-down"
              size={24}
              style={styles.defaultColor}
            />
          </Pressable>
        </View>
      </View>
      {/* 채널 추가 버튼 */}
      <View>
        <Pressable
          style={[
            styles.addChannelButton,
            { display: step >= 7 ? 'flex' : 'none' },
          ]}
          onPress={() => {
            handleAddChannel();
            setStep(4);
          }}
        >
          <Ionicons name="add" size={24} style={styles.defaultColor} />
          <Text
            style={[
              styles.defaultColor,
              {
                fontSize: 12,
                fontWeight: 'normal',
              },
            ]}
          >
            채널 추가
          </Text>
        </Pressable>
      </View>
      {/* 채널 추가 정보 */}
      <View
        style={{
          display: step >= 4 && step <= 7 ? 'flex' : 'none',
          position: 'absolute',
          flexDirection: 'column-reverse',
          width: '100%',
          bottom: 20,
        }}
      >
        {form.channelInfo && (
          <View style={styles.addedChannelContainer}>
            {form.channelInfo.map((channel, index) => (
              <View
                key={channel.channelId || String(index)}
                style={styles.addedChannelButton}
              >
                <Text style={styles.addedChannelText}>{channel.channelId}</Text>
                <Pressable
                  style={styles.removeChannelButton}
                  onPress={() => removeChannel(channel.channelId)}
                >
                  <RemoveChannelIcon color={isDark ? '#FAFAFA' : '#141414'} />
                  <Text style={styles.removeChannelButtonText}>삭제</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>
      {/* 플랫폼 선택 모달 */}
      <Modal
        visible={isPlatformModalVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() => setPlatformModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => setPlatformModalVisible(false)}
        >
          <View
            style={[
              styles.modalContainer,
              { paddingBottom: insets.bottom + 53 },
            ]}
          >
            <Text style={styles.modalText}>
              채널 플랫폼을 한가지만 선택해주세요.
            </Text>
            <View style={styles.platformModalOptionContainer}>
              <Pressable
                style={[
                  styles.platformModalOption,
                  tempChannel.platform === '인스타그램' && {
                    borderWidth: 0.5,
                    borderColor: isDark ? '#E3FFAB' : '#CCFF66',
                  },
                  !(
                    tempChannel.platform === '' ||
                    tempChannel.platform === '인스타그램'
                  ) && styles.dimmedOption,
                ]}
                onPress={() => {
                  updateTemp({ platform: '인스타그램' });
                }}
              >
                <Image
                  source={instagramLogo}
                  style={{ width: 40, height: 40 }}
                />
                <Text style={styles.modalOptionText}>Instagram</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.platformModalOption,
                  tempChannel.platform === '유튜브' && {
                    borderWidth: 0.5,
                    borderColor: isDark ? '#E3FFAB' : '#CCFF66',
                  },
                  !(
                    tempChannel.platform === '' ||
                    tempChannel.platform === '유튜브'
                  ) && styles.dimmedOption,
                ]}
                onPress={() => {
                  updateTemp({ platform: '유튜브' });
                }}
              >
                <Image source={youtubeLogo} style={{ width: 40, height: 40 }} />
                <Text style={styles.modalOptionText}>Youtube</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.platformModalOption,
                  tempChannel.platform === '틱톡' && {
                    borderWidth: 0.5,
                    borderColor: isDark ? '#E3FFAB' : '#CCFF66',
                  },
                  !(
                    tempChannel.platform === '' ||
                    tempChannel.platform === '틱톡'
                  ) && styles.dimmedOption,
                ]}
                onPress={() => {
                  updateTemp({ platform: '틱톡' });
                }}
              >
                <Image source={tiktokLogo} style={{ width: 40, height: 40 }} />
                <Text style={styles.modalOptionText}>TikTok</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const getStyles = isDark => {
  const defaultColor = isDark ? '#FAFAFA' : '#141414';
  return StyleSheet.create({
    defaultColor: {
      color: defaultColor,
    },
    formContainer: {
      flex: 1,
      gap: 40,
    },
    inputContainer: {
      gap: 5,
      marginHorizontal: 16,
    },
    inputTitle: {
      color: defaultColor,
      fontSize: 12,
      fontWeight: '100',
    },
    inputForm: {
      height: 42,
      borderBottomWidth: 0.5,
      borderBottomColor: defaultColor,
      fontSize: 18,
      color: defaultColor,
    },
    interestFieldOptionContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      paddingTop: 20,
      paddingBottom: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: defaultColor,
    },
    platformInputFormContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 3,
    },
    platformInputText: {
      fontSize: 18,
      color: defaultColor,
    },
    baseChip: {
      height: 30,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#323232' : '#E6E6E6',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: defaultColor,
      boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
    },
    baseChipText: {
      color: defaultColor,
      fontSize: 14,
      fontWeight: 'normal',
    },
    selectedChip: {
      height: 30,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: isDark ? '#CCFF66' : '#141414',
      borderWidth: 1,
      borderRadius: 16,
      boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: isDark ? null : '#CCFF66',
    },
    selectedChipText: {
      fontSize: 14,
      fontWeight: 'normal',
      color: isDark ? '#CCFF66' : '#141414',
    },
    modalBackground: {
      flex: 1,
      padding: 0,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
    },
    modalContainer: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: isDark ? '#141414' : '#FAFAFA',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 34,
      paddingHorizontal: 16,
    },
    modalText: {
      color: defaultColor,
      fontSize: 20,
      fontWeight: 'lighter',
    },
    modalOptionText: {
      color: defaultColor,
      fontSize: 18,
      fontWeight: 'normal',
    },
    dimmedOption: {
      opacity: 0.3,
    },
    platformModalOptionContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 18,
      marginTop: 25,
    },
    platformModalOption: {
      width: '90%',
      height: 78,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: isDark ? '#323232' : '#F4F2F2',
      borderRadius: 16,
      paddingLeft: 24,
      gap: 10,
    },
    addChannelButton: {
      width: 120,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 16,
      paddingVertical: 15,
      borderWidth: 0.5,
      borderRadius: 4,
      borderColor: defaultColor,
    },
    addedChannelContainer: {
      width: '90%',
      gap: 10,
      justifyContent: 'center',
      alignSelf: 'center',
    },
    addedChannelButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      height: 60,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: isDark ? '#FAFAFA' : '#141414',
    },
    addedChannelText: {
      fontSize: 12,
      fontWeight: 'normal',
      color: isDark ? '#FAFAFA' : '#141414',
    },
    removeChannelButton: {
      width: 70,
      height: 35,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      borderWidth: 0.5,
      borderRadius: 4,
      borderColor: isDark ? '#FAFAFA' : '#141414',
      paddingHorizontal: 10,
    },
    removeChannelButtonText: {
      fontSize: 12,
      color: isDark ? '#FAFAFA' : '#141414',
    },
  });
};
