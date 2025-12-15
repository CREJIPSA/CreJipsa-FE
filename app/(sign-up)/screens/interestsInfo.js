import { useFormik } from 'formik';
import {
  forwardRef,
  memo,
  useContext,
  useEffect,
  useImperativeHandle,
} from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Yup from 'yup';
import useThemedStyle from '../../hooks/use-themed-style';
import { StepContext } from '../step-context';

export default forwardRef(function InterestsInfo(props, ref) {
  const { styles } = useThemedStyle(getStyles);
  const { step, handleNextStep } = useContext(StepContext);
  const { onFormStatusChange } = props;

  // 단계 전환 조건
  const signupSchema = Yup.object().shape({
    interests: Yup.array()
      .min(1, '관심 분야를 최소 1개 이상 선택해주세요.')
      .required('관심 분야를 선택해주세요.'),
  });

  // 유효성 검사
  const handleStepValidation = async () => {
    const fieldsToValidate = ['interests'];
    const newTouched = fieldsToValidate.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    await formik.setTouched({ ...formik.touched, ...newTouched }, false);

    const error = await formik.validateForm();
    const hasError = fieldsToValidate.some(field => error[field]);
    if (!hasError) {
      return true;
    }
    return false;
  };

  const formik = useFormik({
    initialValues: {
      interests: [],
    },
    validationSchema: signupSchema,
    onSubmit: values => {
      console.log('Form values:', values);
      handleNextStep();
    },
  });

  useEffect(() => {
    const interestsArray = formik.values.interests || [];
    const isComplete = interestsArray.length >= 1;
    if (onFormStatusChange) {
      onFormStatusChange(isComplete);
    }
  }, [onFormStatusChange, formik.values.interests]);

  useImperativeHandle(ref, () => ({
    validateAndGoNext: handleStepValidation,
  }));

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
  const interests = formik.values.interests || [];
  const toggle = option => {
    // 최대 3개 선택 제한
    let newInterests = interests;
    if (interests.includes(option)) {
      newInterests = interests.filter(item => item !== option);
    } else {
      if (interests.length < 3) {
        newInterests = [...interests, option];
      }
    }
    formik.setFieldValue('interests', newInterests);
    if (onFormStatusChange) {
      const isComplete = newInterests.length >= 1;
      onFormStatusChange(isComplete);
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* 관심분야 선택 폼 */}
      <View
        style={[
          styles.inputContainer,
          { display: step === 4 ? 'flex' : 'none' },
        ]}
      >
        <Text style={styles.inputTitle}>관심 분야 ( 최대 3개 )</Text>
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
      {step === 4 && formik.errors.interests && formik.touched.interests && (
        <Text style={{ color: 'red', marginLeft: 16, marginTop: 4 }}>
          {formik.errors.interests}
        </Text>
      )}
    </View>
  );
});

const getStyles = isDark => {
  const defaultColor = isDark ? '#FFFFFF' : '#141414';
  return {
    formContainer: {
      flex: 1,
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
    interestFieldOptionContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      paddingTop: 20,
      paddingBottom: 10,
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
      backgroundColor: '#CCFF66',
    },
    selectedChipText: {
      fontSize: 14,
      fontWeight: 'normal',
      color: '#141414',
    },
  };
};
