import GenderFemaleIcon from '@/assets/svgs/signup/gender-female-icon';
import GenderMaleIcon from '@/assets/svgs/signup/gender-male-icon';
import { Ionicons } from '@expo/vector-icons';
import { memo, useContext, useEffect, useState } from 'react';
import {
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

export default function UserInfo() {
  const insets = useSafeAreaInsets();
  const { isDark, styles } = useThemedStyle(getStyles);
  const { step, form, updateForm, handleNextStep } = useContext(StepContext);
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
  const [isTermModalVisible, setIsTermModalVisible] = useState(true); // 약관 모달 표시 여부
  const [isAllTermsChecked, setIsAllTermsChecked] = useState(false); // 전체 약관 동의 여부
  const [isTerm1Checked, setIsTerm1Checked] = useState(false); // 14세 이상 동의 여부
  const [isTerm2Checked, setIsTerm2Checked] = useState(false); // 서비스 이용 약관 동의 여부
  const [isTerm3Checked, setIsTerm3Checked] = useState(false); // 개인정보 보호 방침 동의 여부
  const [isTerm4Checked, setIsTerm4Checked] = useState(false); // 마케팅 수신 동의 여부
  const [isTermConfirmed, setIsTermConfirmed] = useState(true); // 약관 동의 확인 여부

  // 전체 약관 동의 상태 동기화
  useEffect(() => {
    if (isTerm1Checked && isTerm2Checked && isTerm3Checked && isTerm4Checked) {
      setIsAllTermsChecked(true);
    } else {
      setIsAllTermsChecked(false);
    }
  }, [isTerm1Checked, isTerm2Checked, isTerm3Checked, isTerm4Checked]);

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
          {form.userInfo.gender === '' ? (
            <Text style={styles.genderInputText}>성별</Text>
          ) : (
            <Text style={styles.genderInputText}>{form.userInfo.gender}</Text>
          )}
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
        <TextInput
          style={styles.inputForm}
          value={form.userInfo.birth}
          onChangeText={text =>
            updateForm({ userInfo: { ...form.userInfo, birth: text } })
          }
          onSubmitEditing={handleNextStep}
        />
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
          style={styles.inputForm}
          value={form.userInfo.username}
          onChangeText={text =>
            updateForm({ userInfo: { ...form.userInfo, username: text } })
          }
          onSubmitEditing={handleNextStep}
        />
      </View>
      {/* 약관 모달 */}
      <Modal
        visible={isTermModalVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() => setIsTermModalVisible(false)}
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
                isChecked={isAllTermsChecked}
                onPress={() => {
                  setIsAllTermsChecked(!isAllTermsChecked);
                  setIsTerm1Checked(!isAllTermsChecked);
                  setIsTerm2Checked(!isAllTermsChecked);
                  setIsTerm3Checked(!isAllTermsChecked);
                  setIsTerm4Checked(!isAllTermsChecked);
                }}
              />
              <View
                style={{
                  height: 0.5,
                  marginVertical: 10,
                  backgroundColor: isDark ? '#F4F2F2' : '#1B1B1B',
                  alignSelf: 'stretch',
                  marginRight: 16,
                }}
              />
              <TermOption
                label="(필수) 만 14세 이상이에요"
                isChecked={isTerm1Checked}
                onPress={() => setIsTerm1Checked(!isTerm1Checked)}
              />
              <TermOption
                label="(필수) 서비스 이용 약관 동의"
                isChecked={isTerm2Checked}
                onPress={() => setIsTerm2Checked(!isTerm2Checked)}
              />
              <TermOption
                label="(필수) 개인정보 보호 방침 동의"
                isChecked={isTerm3Checked}
                onPress={() => setIsTerm3Checked(!isTerm3Checked)}
              />
              <TermOption
                label="(선택) 마케팅 수신 동의"
                isChecked={isTerm4Checked}
                onPress={() => setIsTerm4Checked(!isTerm4Checked)}
              />
              {!isTermConfirmed && (
                // 필수 약관 미동의 시 경고 문구 표시(추후 수정)
                <Text
                  style={{
                    color: 'red',
                    fontStyle: 'italic',
                    justifyContent: 'center',
                    marginTop: 10,
                  }}
                >
                  필수 약관에 모두 동의해 주세요.
                </Text>
              )}
            </View>
            <Pressable
              style={styles.termConfirmButton}
              onPress={() => {
                if (isTerm1Checked && isTerm2Checked && isTerm3Checked) {
                  setIsTermModalVisible(false);
                  setIsTermConfirmed(true);
                } else {
                  setIsTermConfirmed(false);
                }
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
          onPress={() => setIsGenderModalVisible(false)}
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
                  form.userInfo.gender === '남성' && {
                    borderWidth: 0.5,
                    borderColor: styles.genderModalOptionBorderColor.color,
                  },
                  form.userInfo.gender === '여성' && styles.dimmedOption,
                ]}
                onPress={e => {
                  updateForm({
                    userInfo: { ...form.userInfo, gender: '남성' },
                  });
                }}
              >
                <GenderMaleIcon
                  size={80}
                  color={
                    form.userInfo.gender === '여성'
                      ? styles.dimmedGenderOptionIconColor.color
                      : styles.selectedGenderOptionIconColor.color
                  }
                />
                <Text style={styles.modalOptionText}>남성</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.genderModalOption,
                  form.userInfo.gender === '여성' && {
                    borderWidth: 0.5,
                    borderColor: styles.genderModalOptionBorderColor.color,
                  },
                  form.userInfo.gender === '남성' && styles.dimmedOption,
                ]}
                onPress={e => {
                  updateForm({
                    userInfo: { ...form.userInfo, gender: '여성' },
                  });
                }}
              >
                <GenderFemaleIcon
                  size={80}
                  color={
                    form.userInfo.gender === '남성'
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
}

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
      fontWeight: '100',
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
      backgroundColor: isDark ? '#CCFF66' : '#C6E945',
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
  });
};
