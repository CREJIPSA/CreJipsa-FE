import instagramLogo from '@/assets/images/platform_logo/instagram_logo.png';
import tiktokLogo from '@/assets/images/platform_logo/tiktok_logo.png';
import youtubeLogo from '@/assets/images/platform_logo/youtube_logo.png';
import RemoveChannelIcon from '@/assets/svgs/signup/remove-channel-icon.js';
import { Ionicons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
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
import * as Yup from 'yup';
import useThemedStyle from '../../hooks/use-themed-style';
import { StepContext } from '../step-context.js';

export default function ChannelInfo() {
  const insets = useSafeAreaInsets();
  const { isDark, styles } = useThemedStyle(getStyles);
  const { step, setStep, handleNextStep } = useContext(StepContext);

  const [isPlatformModalVisible, setPlatformModalVisible] = useState(false);

  // 회원가입 단계 전환 조건
  const signupSchema = Yup.object().shape({
    myChannels: Yup.array().of(
      Yup.object().shape({
        channelId: Yup.string().required('채널 아이디를 입력해주세요.'),
        platform: Yup.string().required('채널 플랫폼을 선택해주세요.'),
      }),
    ),
  });

  const formik = useFormik({
    initialValues: {
      myChannels: [],
    },
    validationSchema: signupSchema,
    onSubmit: values => {
      console.log('Form values:', values);
    },
  });

  const addChannel = () => {
    const newChannel = {
      channelId: '',
      platform: '',
      interests: [],
    };
    // 빈 채널 우선 추가
    formik.setFieldValue('myChannels', [
      ...formik.values.myChannels,
      newChannel,
    ]);
  };

  useEffect(() => {
    // 첫 채널 추가
    if (formik.values.myChannels.length === 0) {
      addChannel();
    }
  }, []);

  return (
    <View style={styles.formContainer}>
      {formik.values.myChannels.map((channel, index) => (
        <View key={index}>
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
              value={formik.values.myChannels[index].channelId}
              onChangeText={text => {
                formik.setFieldValue(`myChannels[${index}].channelId`, text);
              }}
              onSubmitEditing={handleNextStep}
            />
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
              <Text style={styles.platformInputText}>
                {formik.values.myChannels[index].platform === ''
                  ? '채널 플랫폼 선택'
                  : formik.values.myChannels[index].platform}
              </Text>
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
                addChannel();
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
            {formik.values.myChannels && (
              <View style={styles.addedChannelContainer}>
                {formik.values.myChannels.map((channel, index) => (
                  <View
                    key={channel.channelId || String(index)}
                    style={styles.addedChannelButton}
                  >
                    <Text style={styles.addedChannelText}>
                      {channel.channelId}
                    </Text>
                    <Pressable
                      style={styles.removeChannelButton}
                      onPress={() =>
                        formik.setFieldValue(
                          'myChannels',
                          formik.values.myChannels.filter(
                            (_, i) => i !== index,
                          ),
                        )
                      }
                    >
                      <RemoveChannelIcon
                        color={isDark ? '#FAFAFA' : '#141414'}
                      />
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
                      formik.values.myChannels[index].platform ===
                        '인스타그램' && {
                        borderWidth: 0.5,
                        borderColor: isDark ? '#E3FFAB' : '#CCFF66',
                      },
                      !(
                        formik.values.myChannels[index].platform === '' ||
                        formik.values.myChannels[index].platform ===
                          '인스타그램'
                      ) && styles.dimmedOption,
                    ]}
                    onPress={() => {
                      formik.setFieldValue(
                        `myChannels[${index}].platform`,
                        '인스타그램',
                      );
                      setPlatformModalVisible(false);
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
                      formik.values.myChannels[index].platform === '유튜브' && {
                        borderWidth: 0.5,
                        borderColor: isDark ? '#E3FFAB' : '#CCFF66',
                      },
                      !(
                        formik.values.myChannels[index].platform === '' ||
                        formik.values.myChannels[index].platform === '유튜브'
                      ) && styles.dimmedOption,
                    ]}
                    onPress={() => {
                      formik.setFieldValue(
                        `myChannels[${index}].platform`,
                        '유튜브',
                      );
                      setPlatformModalVisible(false);
                    }}
                  >
                    <Image
                      source={youtubeLogo}
                      style={{ width: 40, height: 40 }}
                    />
                    <Text style={styles.modalOptionText}>Youtube</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.platformModalOption,
                      formik.values.myChannels[index].platform === '틱톡' && {
                        borderWidth: 0.5,
                        borderColor: isDark ? '#E3FFAB' : '#CCFF66',
                      },
                      !(
                        formik.values.myChannels[index].platform === '' ||
                        formik.values.myChannels[index].platform === '틱톡'
                      ) && styles.dimmedOption,
                    ]}
                    onPress={() => {
                      formik.setFieldValue(
                        `myChannels[${index}].platform`,
                        '틱톡',
                      );
                      setPlatformModalVisible(false);
                    }}
                  >
                    <Image
                      source={tiktokLogo}
                      style={{ width: 40, height: 40 }}
                    />
                    <Text style={styles.modalOptionText}>TikTok</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          </Modal>
        </View>
      ))}
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
