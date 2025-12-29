import DeleteModal from '@/app/components/DeleteModal.js';
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
  useRef,
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
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState(null);

  // 회원가입 단계 전환 조건
  const channelSchema = Yup.object().shape({
    channelId: Yup.string()
      .matches(/^@/, '입력 형식이 잘못되었어요.')
      .required('채널 아이디를 입력해주세요.'),
    platform: Yup.string().required('채널 플랫폼을 선택해주세요.'),
  });

  // formik 초기 설정
  const formik = useFormik({
    initialValues: {
      platform: '',
      channelId: '',
    },
    validationSchema: channelSchema,
  });

  // 채널 추가
  const addChannel = async () => {
    const isValid = await handleStepValidation();
    if (isValid) {
      updateForm('channelInfo', [
        ...form.channelInfo,
        {
          platform: formik.values.platform,
          channelId: formik.values.channelId,
        },
      ]);
    }
  };

  // 유효성 검사
  const handleStepValidation = async () => {
    const fieldsToValidate = [];
    if (step >= 5) {
      fieldsToValidate.push(formik.values.platform);
    }
    if (step >= 6) {
      fieldsToValidate.push(formik.values.channelId);
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
  const checkAllRequiredFieldsFilled = (
    currentStep,
    overridePlatform = null,
    overrideId = null,
  ) => {
    const platform =
      overridePlatform !== null ? overridePlatform : formik.values.platform;
    const channelId =
      overrideId !== null ? overrideId : formik.values.channelId;
    if (currentStep === 7) {
      const isCurrentInputFull = platform !== '' && channelId !== '';
      const hasAddedChannels = (form.channelInfo?.length ?? 0) > 0;
      return isCurrentInputFull || hasAddedChannels;
    }

    const fieldsToValidate = [];
    if (currentStep >= 5) {
      fieldsToValidate.push(platform);
    }
    if (currentStep >= 6) {
      fieldsToValidate.push(channelId);
    }
    return fieldsToValidate.every(value => value && value.length > 0);
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
  }, [step, onFormStatusChange]);

  useImperativeHandle(ref, () => ({
    validateAndGoNext: handleStepValidation,
  }));

  // 채널 정보 최종 저장
  const hasSavedRef = useRef(false);
  useEffect(() => {
    if (step !== 8) {
      hasSavedRef.current = false;
      return;
    }
    if (hasSavedRef.current) return;
    if (!formik.values.platform || !formik.values.channelId) return;

    const saveFinalChannel = async () => {
      hasSavedRef.current = true;

      const isDuplicate = form.channelInfo.some(
        ch =>
          ch.platform === formik.values.platform &&
          ch.channelId === formik.values.channelId,
      );
      if (!isDuplicate) {
        await addChannel();
        formik.setValues({ platform: '', channelId: '' }, false);
        formik.setTouched({ platform: false, channelId: false }, false);
      }
    };
    saveFinalChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // 버튼 활성화 체크
  useEffect(() => {
    if (!onFormStatusChange) return;
    if (step === 8) {
      onFormStatusChange((form.channelInfo?.length ?? 0) > 0);
      return;
    }
    const isComplete = checkAllRequiredFieldsFilled(step);
    onFormStatusChange(isComplete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.channelInfo, step, formik.values.platform, formik.values.channelId]);

  // 채널 정보 모두 삭제 시 입력 폼 초기화
  useEffect(() => {
    if ((form.channelInfo?.length ?? 0) === 0) {
      formik.setValues({ platform: '', channelId: '' }, false);
      formik.setTouched({ platform: false, channelId: false }, false);
    }
    if (step === 8 && (form.channelInfo?.length ?? 0) === 0) {
      setStep(10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.channelInfo?.length]);

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
          style={[
            styles.inputForm,
            step >= 6 &&
            step <= 7 &&
            formik.touched.channelId &&
            formik.errors.channelId
              ? { borderBottomColor: '#FF0606' }
              : {},
          ]}
          placeholder="@크집사"
          placeholderTextColor={isDark ? '#A5A5A5' : '#B7B7B7'}
          value={formik.values.channelId}
          onChangeText={text => {
            formik.setFieldValue('channelId', text);
            if (props.onFormStatusChange) {
              const isComplete = checkAllRequiredFieldsFilled(
                step,
                formik.values.platform,
                text,
              );
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
        {step >= 6 &&
          step <= 7 &&
          formik.touched.channelId &&
          formik.errors.channelId && (
            <Text style={styles.errorMessage}>{formik.errors.channelId}</Text>
          )}
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
            {formik.values.platform === ''
              ? '채널 플랫폼 선택'
              : formik.values.platform}
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
                  formik.values.platform === '인스타그램' && {
                    borderWidth: 0.5,
                    borderColor: isDark ? '#E3FFAB' : '#CCFF66',
                  },
                  !(
                    formik.values.platform === '' ||
                    formik.values.platform === '인스타그램'
                  ) && styles.dimmedOption,
                ]}
                onPress={async () => {
                  const selected = '인스타그램';
                  await formik.setFieldValue('platform', selected, true);
                  if (props.onFormStatusChange) {
                    const isComplete = checkAllRequiredFieldsFilled(
                      step,
                      selected,
                    );
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
                  formik.values.platform === '유튜브' && {
                    borderWidth: 0.5,
                    borderColor: isDark ? '#E3FFAB' : '#CCFF66',
                  },
                  !(
                    formik.values.platform === '' ||
                    formik.values.platform === '유튜브'
                  ) && styles.dimmedOption,
                ]}
                onPress={async () => {
                  const selected = '유튜브';
                  await formik.setFieldValue('platform', selected, true);
                  if (props.onFormStatusChange) {
                    const isComplete = checkAllRequiredFieldsFilled(
                      step,
                      selected,
                    );
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
                  formik.values.platform === '틱톡' && {
                    borderWidth: 0.5,
                    borderColor: isDark ? '#E3FFAB' : '#CCFF66',
                  },
                  !(
                    formik.values.platform === '' ||
                    formik.values.platform === '틱톡'
                  ) && styles.dimmedOption,
                ]}
                onPress={async () => {
                  const selected = '틱톡';
                  await formik.setFieldValue('platform', selected, true);
                  if (props.onFormStatusChange) {
                    const isComplete = checkAllRequiredFieldsFilled(
                      step,
                      selected,
                    );
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
            { display: step === 7 || step === 10 ? 'flex' : 'none' },
          ]}
          onPress={async () => {
            await addChannel(formik.values);
            formik.setValues({ platform: '', channelId: '' });
            formik.setTouched({ platform: false, channelId: false }, false);
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
        {form.channelInfo?.length > 0 && (
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
            {form.channelInfo
              .filter(ch => ch.platform && ch.channelId)
              .map((channel, index) => (
                <View
                  key={`${channel.platform}-${channel.channelId}-${index}`}
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
                    onPress={() => {
                      setDeleteModalVisible(true);
                      setDeleteTargetIndex(index);
                    }}
                  >
                    <Ionicons
                      name="close-outline"
                      size={24}
                      style={styles.defaultColor}
                    />
                  </Pressable>
                </View>
              ))}
          </View>
        )}
      </View>
      <DeleteModal
        visible={isDeleteModalVisible}
        mainText="삭제하시겠어요?"
        subText="추가하신 채널 삭제 시, 복구가 불가능합니다."
        closeText="취소"
        confirmText="삭제하기"
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={() => {
          updateForm(
            'channelInfo',
            form.channelInfo.filter((_, i) => i !== deleteTargetIndex),
          );
          setDeleteModalVisible(false);
        }}
      />
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
      height: 45,
      gap: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 16,
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
    errorMessage: {
      color: '#FF0606',
      fontSize: 12,
      fontWeight: '200',
    },
  });
};
