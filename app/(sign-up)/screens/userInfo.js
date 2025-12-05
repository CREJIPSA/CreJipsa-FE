import GenderFemaleIcon from '@/assets/svgs/signup-gender-female-icon';
import GenderMaleIcon from '@/assets/svgs/signup-gender-male-icon';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
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
    genderModalOptionContainer: {
      width: '100%',
      justifyContent: 'center',
      marginTop: 35,
      flexDirection: 'row',
      justifyItems: 'center',
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
