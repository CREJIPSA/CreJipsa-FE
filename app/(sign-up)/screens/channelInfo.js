import instagramLogo from '@/assets/images/platform_logo/instagram_logo.png';
import tiktokLogo from '@/assets/images/platform_logo/tiktok_logo.png';
import youtubeLogo from '@/assets/images/platform_logo/youtube_logo.png';
import AddChannelIcon from '@/assets/svgs/signup/add-channel-icon.js';
import { Ionicons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
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

export default forwardRef(function ChannelInfo(props, ref) {
  const insets = useSafeAreaInsets();
  const { isDark, styles } = useThemedStyle(getStyles);
  const { form, step, setStep, handleNextStep, updateForm } =
    useContext(StepContext);
  const { onFormStatusChange } = props;

  const [isPlatformModalVisible, setPlatformModalVisible] = useState(false);

  // 회원가입 단계 전환 조건
  const tempChannelSchema = Yup.object().shape({
    channelId: Yup.string().required('채널 아이디를 입력해주세요.'),
    platform: Yup.string().required('채널 플랫폼을 선택해주세요.'),
  });

  // formik 초기 설정
  const formik = useFormik({
    initialValues: {
      platform: '',
      channelId: '',
    },
    validationSchema: tempChannelSchema,
  });

  // 현재 입력 채널
  const [tempChannel, setTempChannel] = useState({
    platform: '',
    channelId: '',
  });

  // 채널 추가
  const addChannel = async tempChannel => {
    const isValid = await handleStepValidation();
    if (isValid) {
      updateForm('channelInfo', [
        ...form.channelInfo,
        { platform: tempChannel.platform, channelId: tempChannel.channelId },
      ]);
      // 초기화
      setTempChannel({ platform: '', channelId: '' });
    }
  };

  // 유효성 검사
  const handleStepValidation = async () => {
    const fieldsToValidate = [];
    if (step >= 5) {
      fieldsToValidate.push('platform');
    }
    if (step >= 6) {
      fieldsToValidate.push('channelId');
    }
    const newTouched = fieldsToValidate.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    formik.setTouched({ ...formik.touched, ...newTouched }, false);
    const errors = await formik.validateForm();
    const hasErrors = fieldsToValidate.some(field => errors[field]);
    if (!hasErrors) {
      return true;
    }
    return false;
  };

  //  버튼 활성화 상태 관리
  const checkAllRequiredFieldsFilled = currentStep => {
    if (currentStep === 7) {
      return tempChannel.platform !== '' && tempChannel.channelId !== '';
    }
    const fieldsToValidate = [];
    if (currentStep >= 5) {
      fieldsToValidate.push(tempChannel.platform);
    }
    if (currentStep >= 6) {
      fieldsToValidate.push(tempChannel.channelId);
    }
    return fieldsToValidate.every(value => value && value.trim() !== '');
  };

  // 필수 항목 모두 입력해야 다음 단계 이동 가능
  useEffect(() => {
    const isComplete = checkAllRequiredFieldsFilled(step);
    if (step === 7) {
      if (onFormStatusChange) {
        onFormStatusChange(isComplete);
      }
    }
    if (onFormStatusChange) {
      onFormStatusChange(isComplete);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, tempChannel, onFormStatusChange]);

  useImperativeHandle(ref, () => ({
    validateAndGoNext: handleStepValidation,
  }));

  // 채널 정보 최종 저장
  useEffect(() => {
    if (step !== 8) return;
    (async () => {
      await addChannel(tempChannel);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (!onFormStatusChange) return;
    if (step === 8) {
      onFormStatusChange((form.channelInfo?.length ?? 0) > 0);
      return;
    }
    const isComplete = checkAllRequiredFieldsFilled(step);
    onFormStatusChange(isComplete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.channelInfo, step]);

  return (
    <View style={styles.formContainer}>
      {/* 채널 아이디 입력 폼 */}
      <View
        style={[
          styles.inputContainer,
          { display: step >= 6 && step <= 7 ? 'flex' : 'none' },
        ]}
      >
        <Text style={styles.inputTitle}>채널 아이디</Text>
        <TextInput
          style={styles.inputForm}
          placeholder="@크집사"
          placeholderTextColor={isDark ? '#A5A5A5' : '#B7B7B7'}
          value={tempChannel.channelId}
          onChangeText={text => {
            setTempChannel({ ...tempChannel, channelId: text });
            formik.setFieldValue('channelId', text);
            if (props.onFormStatusChange) {
              const isComplete = checkAllRequiredFieldsFilled(step);
              props.onFormStatusChange(isComplete);
            }
          }}
          onBlur={() => {
            formik.setFieldTouched('channelId', true);
          }}
          onSubmitEditing={async () => {
            const isValid = await handleStepValidation();
            if (isValid) {
              handleNextStep();
            }
          }}
        />
      </View>
      {/* 채널 플랫폼 선택 폼 */}
      <View
        style={[
          styles.inputContainer,
          { display: step >= 5 && step <= 7 ? 'flex' : 'none' },
        ]}
      >
        <Text style={styles.inputTitle}>채널 플랫폼</Text>
        <View style={[styles.inputForm, styles.platformInputFormContainer]}>
          <Text style={styles.platformInputText}>
            {tempChannel.platform === ''
              ? '채널 플랫폼 선택'
              : tempChannel.platform}
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
                onPress={async () => {
                  await formik.setFieldValue('platform', '인스타그램', true);
                  setTempChannel({ ...tempChannel, platform: '인스타그램' });
                  if (props.onFormStatusChange) {
                    const isComplete = checkAllRequiredFieldsFilled(step);
                    props.onFormStatusChange(isComplete);
                  }
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
                onPress={async () => {
                  await formik.setFieldValue('platform', '유튜브', true);
                  setTempChannel({ ...tempChannel, platform: '유튜브' });
                  if (props.onFormStatusChange) {
                    const isComplete = checkAllRequiredFieldsFilled(step);
                    props.onFormStatusChange(isComplete);
                  }
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
                onPress={async () => {
                  await formik.setFieldValue('platform', '틱톡', true);
                  setTempChannel({ ...tempChannel, platform: '틱톡' });
                  if (props.onFormStatusChange) {
                    const isComplete = checkAllRequiredFieldsFilled(step);
                    props.onFormStatusChange(isComplete);
                  }
                }}
              >
                <Image source={tiktokLogo} style={{ width: 40, height: 40 }} />
                <Text style={styles.modalOptionText}>TikTok</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
      {/* 채널 추가 버튼 */}
      <View>
        <Pressable
          style={[
            styles.addChannelButton,
            { display: step === 7 ? 'flex' : 'none' },
          ]}
          onPress={() => {
            addChannel(tempChannel);
            setStep(5);
          }}
        >
          <AddChannelIcon size={10} color={styles.defaultColor.color} />
          <Text style={[styles.defaultColor, { fontSize: 12 }]}>채널 추가</Text>
        </Pressable>
      </View>
      {/* 채널 추가 정보 */}
      <View
        style={{
          display: step >= 5 && step <= 8 ? 'flex' : 'none',
          width: '100%',
          flex: 1,
        }}
      >
        {form.channelInfo?.length > 0 ? (
          <View
            style={[
              styles.addedChannelContainer,
              {
                ...(step >= 5 &&
                  step <= 7 &&
                  styles.addedChannelBottomContainer),
              },
            ]}
          >
            {form.channelInfo.map((channel, index) => (
              <View
                key={channel.channelId || String(index)}
                style={styles.addedChannelButton}
              >
                <View style={styles.addedChannelInfo}>
                  <Image
                    source={
                      channel.platform === '인스타그램'
                        ? instagramLogo
                        : channel.platform === '유튜브'
                          ? youtubeLogo
                          : tiktokLogo
                    }
                    style={{ width: 15, height: 15 }}
                  />
                  <Text style={styles.addedChannelText}>
                    {channel.channelId}
                  </Text>
                </View>
                <Pressable
                  onPress={() =>
                    updateForm(
                      'channelInfo',
                      form.channelInfo.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Ionicons
                    name="close-outline"
                    size={12}
                    style={styles.defaultColor}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          step === 8 && (
            <Text
              style={{
                paddingLeft: 16,
                color: isDark ? '#FAFAFA' : '#141414',
              }}
            >
              등록된 채널이 없습니다.
            </Text>
          )
        )}
      </View>
    </View>
  );
});

const getStyles = isDark => {
  const defaultColor = isDark ? '#FAFAFA' : '#141414';
  return StyleSheet.create({
    defaultColor: {
      color: defaultColor,
    },
    formContainer: {
      flex: 1,
    },
    inputContainer: {
      gap: 5,
      marginHorizontal: 16,
      marginBottom: 40,
    },
    inputTitle: {
      color: defaultColor,
      fontSize: 12,
    },
    inputForm: {
      height: 42,
      borderBottomWidth: 0.5,
      borderBottomColor: defaultColor,
      fontSize: 18,
      color: defaultColor,
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
      gap: 10,
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
    addedChannelBottomContainer: {
      flexDirection: 'column-reverse',
      position: 'absolute',
      bottom: 20,
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
    addedChannelInfo: {
      flexDirection: 'row',
      gap: 4,
      alignItems: 'center',
    },
    addedChannelText: {
      fontSize: 12,
      fontWeight: 'normal',
      color: isDark ? '#FAFAFA' : '#141414',
    },
  });
};
