import BirthDatePicker from '@/app/components/BirthDatePicker.js';
import GenderFemaleIcon from '@/assets/svgs/signup/gender-female-icon';
import GenderMaleIcon from '@/assets/svgs/signup/gender-male-icon';
import { Ionicons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import {
  forwardRef,
  memo,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
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
import { StepContext } from '../step-context';
import { TermContext } from '../term-context';

export default forwardRef(function UserInfo(props, ref) {
  const insets = useSafeAreaInsets();
  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);
  const { step, handleNextStep, updateForm } = useContext(StepContext);
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const { onFormStatusChange } = props;

  // 회원가입 단계 전환 조건
  const signupSchema = Yup.object().shape({
    username: Yup.string()
      .max(10, '최대 10글자까지 입력 가능합니다.')
      .required('이름을 입력해주세요.'),
    birth: Yup.string().required('생년월일을 입력해주세요.'),
    gender: Yup.string().required('성별을 선택해주세요.'),
  });

  // formik 초기 설정
  const formik = useFormik({
    initialValues: {
      username: '',
      birth: '',
      gender: '',
    },
    validationSchema: signupSchema,
  });

  // 유효성 검사
  const handleStepValidation = async () => {
    const fieldsToValidate = [];
    switch (step) {
      case 1:
        fieldsToValidate.push('username');
        break;
      case 2:
        fieldsToValidate.push('birth');
        break;
      case 3:
        fieldsToValidate.push('gender');
        break;
      default:
        return false;
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
    baseValues,
    changedField,
    changedValue,
  ) => {
    let currentValues = baseValues || {};
    if (changedField) {
      currentValues = { ...baseValues, [changedField]: changedValue };
    }

    const fieldsToCheck = [];
    if (currentStep >= 1) fieldsToCheck.push('username');
    if (currentStep >= 2) fieldsToCheck.push('birth');
    if (currentStep >= 3) fieldsToCheck.push('gender');

    return fieldsToCheck.every(
      field => currentValues[field] && currentValues[field].length > 0,
    );
  };

  // 필수 항목 모두 입력해야 다음 단계 이동 가능
  useEffect(() => {
    if (!formik.values) return;
    const currentFormikValues = formik.values || {};
    const isComplete = checkAllRequiredFieldsFilled(
      step,
      currentFormikValues,
      '',
      '',
    );
    if (onFormStatusChange) {
      onFormStatusChange(isComplete);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, onFormStatusChange]);

  useImperativeHandle(ref, () => ({
    validateAndGoNext: handleStepValidation,
  }));

  // 약관
  const {
    terms,
    setTerms,
    termsOptions,
    setTermsOptions,
    handleAllTermsCheck,
    handleFinalConfirmation,
  } = useContext(TermContext);

  // 약관 컴포넌트
  const TermOption = memo(function TermOption({ label, isChecked, onPress }) {
    return (
      <View style={styles.termOption}>
        <Pressable onPress={onPress}>
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={
              isChecked
                ? isDark
                  ? '#CCFF66'
                  : '#C6E945'
                : isDark
                  ? '#B7B7B7'
                  : '#B7B7B7'
            }
          />
        </Pressable>
        <View>
          <Text
            style={{ color: isDark ? '#FAFAFA' : '#141414', marginLeft: 10 }}
          >
            {label}
          </Text>
          {label === '모두 동의' && (
            <Text style={styles.termOptionSubText}>
              약관 및 개인정보보호방침, 마케팅 수신에 동의합니다.
            </Text>
          )}
        </View>
      </View>
    );
  });

  return (
    <View style={styles.formContainer}>
      {/* 성별 선택 폼 */}
      <View
        style={[
          styles.inputContainer,
          { display: step >= 3 ? 'flex' : 'none' },
        ]}
      >
        <Text style={styles.inputTitle} />
        <View style={[styles.inputForm, styles.genderInputFormContainer]}>
          <Text style={styles.genderInputText}>
            {formik.values.gender === '' ? '성별' : formik.values.gender}
          </Text>
          <Pressable onPress={() => setIsGenderModalVisible(true)}>
            <Ionicons
              name="chevron-down"
              size={24}
              color={isDark ? '#FAFAFA' : '#141414'}
            />
          </Pressable>
        </View>
      </View>
      {/* 생일 입력 폼 */}
      <View
        style={[
          styles.inputContainer,
          { display: step >= 2 ? 'flex' : 'none' },
        ]}
      >
        <Text style={styles.inputTitle}>생년월일 (8자리)</Text>
        <Pressable
          style={[
            styles.inputForm,
            { justifyContent: 'center', paddingLeft: 3 },
          ]}
          onPress={() => {
            setDatePickerVisible(true);
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: formik.values.birth
                ? primaryColors.color
                : isDark
                  ? '#8A8A8A'
                  : '#D3D3D3',
            }}
          >
            {formik.values.birth ? formik.values.birth : '0000.00.00'}
          </Text>
        </Pressable>
        <BirthDatePicker
          isVisible={datePickerVisible}
          initialDate={
            formik.values.birth
              ? new Date(formik.values.birth.replaceAll('.', '-'))
              : new Date()
          }
          onConfirm={async date => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}.${month}.${day}`;
            formik.handleChange('birth')(formattedDate);
            updateForm('userInfo', { birth: formattedDate });
            if (props.onFormStatusChange) {
              const isComplete = checkAllRequiredFieldsFilled(
                step,
                formik.values,
                'birth',
                formattedDate,
              );
              props.onFormStatusChange(isComplete);
            }
            setDatePickerVisible(false);
          }}
          onCancel={() => setDatePickerVisible(false)}
        />
        {step === 2 && formik.touched.birth && formik.errors.birth && (
          <Text style={styles.errorMessage}>{formik.errors.birth}</Text>
        )}
      </View>
      {/* 이름 입력 폼 */}
      <View
        style={[
          styles.inputContainer,
          { display: step >= 1 ? 'flex' : 'none' },
        ]}
      >
        <Text style={styles.inputTitle}>이름 (최대 10글자)</Text>
        <TextInput
          style={[
            styles.inputForm,
            step === 1 && formik.touched.username && formik.errors.username
              ? { borderBottomColor: '#FF0606' }
              : {},
          ]}
          placeholder="이름을 입력해주세요."
          placeholderTextColor={isDark ? '#8A8A8A' : '#D3D3D3'}
          value={formik.values.username}
          onChangeText={text => {
            formik.handleChange('username')(text);
            updateForm('userInfo', { username: text });
            if (props.onFormStatusChange) {
              const isComplete = checkAllRequiredFieldsFilled(
                step,
                formik.values,
                'username',
                text,
              );
              props.onFormStatusChange(isComplete);
            }
          }}
          onBlur={formik.handleBlur('username')}
          onSubmitEditing={async () => {
            const isValid = await handleStepValidation();
            if (isValid) {
              handleNextStep();
            }
          }}
          returnKeyType="next"
          autoCapitalize="none"
        />
        {step === 1 && formik.touched.username && formik.errors.username && (
          <Text style={styles.errorMessage}>{formik.errors.username}</Text>
        )}
      </View>
      {/* 약관 모달 */}
      <Modal
        visible={termsOptions.isTermModalVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() =>
          setTermsOptions(prev => ({ ...prev, isTermModalVisible: false }))
        }
      >
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalContainer,
              { paddingBottom: insets.bottom + 53 },
            ]}
          >
            <Text style={styles.modalText}>약관에 동의해주세요</Text>
            <View style={styles.termModalOptionContainer}>
              <TermOption
                label="모두 동의"
                isChecked={termsOptions.isAllTermsChecked}
                onPress={() => {
                  handleAllTermsCheck();
                }}
              />
              <View style={styles.divider} />
              <TermOption
                label="(필수) 만 14세 이상이에요"
                isChecked={terms.term1}
                onPress={() => setTerms({ ...terms, term1: !terms.term1 })}
              />
              <TermOption
                label="(필수) 서비스 이용 약관 동의"
                isChecked={terms.term2}
                onPress={() => setTerms({ ...terms, term2: !terms.term2 })}
              />
              <TermOption
                label="(필수) 개인정보 보호 방침 동의"
                isChecked={terms.term3}
                onPress={() => setTerms({ ...terms, term3: !terms.term3 })}
              />
              <TermOption
                label="(선택) 마케팅 수신 동의"
                isChecked={terms.term4}
                onPress={() => setTerms({ ...terms, term4: !terms.term4 })}
              />
            </View>
            <Pressable
              style={[
                styles.termConfirmButton,
                termsOptions.isTermConfirmed && {
                  backgroundColor: isDark ? '#CCFF66' : '#C6E945',
                },
              ]}
              onPress={() => {
                if (termsOptions.isTermConfirmed) {
                  setTermsOptions(prev => ({
                    ...prev,
                    isTermModalVisible: false,
                  }));
                }
                handleFinalConfirmation();
              }}
            >
              <Text style={styles.termConfirmButtonText}>동의합니다.</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* 성별 선택 모달 */}
      <Modal
        visible={isGenderModalVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() => setIsGenderModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => {
            setIsGenderModalVisible(false);
          }}
        >
          <View
            style={[
              styles.modalContainer,
              { paddingBottom: insets.bottom + 53 },
            ]}
          >
            <Text style={styles.modalText}>성별은 어떻게 되시나요?</Text>
            <View style={styles.genderModalOptionContainer}>
              <Pressable
                style={[
                  styles.genderModalOption,
                  formik.values.gender === '남성' && {
                    borderWidth: 0.5,
                    borderColor: styles.genderModalOptionBorderColor.color,
                  },
                  formik.values.gender === '여성' && styles.dimmedOption,
                ]}
                onPress={async () => {
                  const newGenderValue = '남성';
                  await formik.setFieldValue('gender', newGenderValue);
                  await formik.setFieldTouched('gender', true);
                  updateForm('userInfo', { gender: newGenderValue });
                  await handleStepValidation();
                  if (props.onFormStatusChange) {
                    const isComplete = checkAllRequiredFieldsFilled(
                      step,
                      formik.values,
                      'gender',
                      newGenderValue,
                    );
                    props.onFormStatusChange(isComplete);
                  }
                }}
              >
                <GenderMaleIcon
                  size={80}
                  color={
                    formik.values.gender === '여성'
                      ? styles.dimmedGenderOptionIconColor.color
                      : styles.selectedGenderOptionIconColor.color
                  }
                />
                <Text style={styles.modalOptionText}>남성</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.genderModalOption,
                  formik.values.gender === '여성' && {
                    borderWidth: 0.5,
                    borderColor: styles.genderModalOptionBorderColor.color,
                  },
                  formik.values.gender === '남성' && styles.dimmedOption,
                ]}
                onPress={async () => {
                  const newGenderValue = '여성';
                  await formik.setFieldValue('gender', newGenderValue);
                  await formik.setFieldTouched('gender', true);
                  updateForm('userInfo', { gender: newGenderValue });
                  await handleStepValidation();
                  if (props.onFormStatusChange) {
                    const isComplete = checkAllRequiredFieldsFilled(
                      step,
                      formik.values,
                      'gender',
                      newGenderValue,
                    );
                    props.onFormStatusChange(isComplete);
                  }
                }}
              >
                <GenderFemaleIcon
                  size={80}
                  color={
                    formik.values.gender === '남성'
                      ? styles.dimmedGenderOptionIconColor.color
                      : styles.selectedGenderOptionIconColor.color
                  }
                />
                <Text style={styles.modalOptionText}>여성</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
});

const getStyles = isDark => {
  const textColor = isDark ? '#FAFAFA' : '#141414';

  return StyleSheet.create({
    formContainer: {
      flex: 1,
      gap: 40,
    },
    inputContainer: {
      gap: 5,
      marginHorizontal: 16,
    },
    inputTitle: {
      color: textColor,
      fontSize: 12,
    },
    inputForm: {
      height: 42,
      borderBottomWidth: 0.5,
      borderBottomColor: textColor,
      fontSize: 18,
      color: textColor,
    },
    genderInputFormContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 3,
    },
    genderInputText: {
      fontSize: 18,
      color: textColor,
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
      paddingLeft: 16,
    },
    modalText: {
      color: textColor,
      fontSize: 20,
      fontWeight: 'lighter',
    },
    modalOptionText: {
      color: textColor,
      fontSize: 18,
      fontWeight: 'normal',
    },
    dimmedOption: {
      opacity: 0.3,
    },
    termModalOptionContainer: {
      width: '100%',
      paddingRight: 16,
      marginTop: 25,
      gap: 10,
    },
    divider: {
      height: 0.5,
      marginVertical: 10,
      backgroundColor: isDark ? '#F4F2F2' : '#1B1B1B',
      alignSelf: 'stretch',
      marginRight: 16,
    },
    termOption: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    termOptionSubText: {
      color: isDark ? '#FAFAFA' : '#141414',
      marginLeft: 10,
      fontSize: 12,
      fontWeight: '100',
    },
    termConfirmButton: {
      width: '100%',
      height: 40,
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: '#E6E6E6',
      borderRadius: 100,
      marginTop: 30,
      marginRight: 16,
    },
    termConfirmButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000000',
    },
    genderModalOptionContainer: {
      width: '100%',
      justifyContent: 'center',
      marginTop: 35,
      flexDirection: 'row',
      alignContent: 'center',
      gap: 30,
    },
    genderModalOption: {
      width: 140,
      height: 197,
      gap: 25,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#323232' : '#F4F2F2',
      borderRadius: 16,
    },
    genderModalOptionBorderColor: {
      borderColor: isDark ? '#FAFAFA' : '#CCFF66',
    },
    dimmedGenderOptionIconColor: {
      color: isDark ? '#CCFF66' : '#7A7C71',
    },
    selectedGenderOptionIconColor: {
      color: isDark ? '#CCFF66' : '#C6E945',
    },
    errorMessage: {
      color: '#FF0606',
      fontSize: 12,
      fontWeight: '200',
    },
  });
};
