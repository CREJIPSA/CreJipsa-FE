import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import instagramLogo from '../assets/images/instagram_logo.png';
import tictokLogo from '../assets/images/tictok_logo.png';
import youtubeLogo from '../assets/images/youtube_logo.png';

const chipOptions = ['일상/밈', '뷰티', '게임', '패션', '음악', '스포츠', '반려동물'];
const Chip = memo(function Chip({ label, isSelected, onPress }) {
  return (
    <Pressable 
      style={[
        isSelected ? styles.selectedChip : styles.baseChip
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          isSelected ? styles.selectedChipText : styles.baseChipText
        ]}
      >
        {label}
      </Text>
    </Pressable>)
});

export default function SignUp() {

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [username, setUsername] = useState(); // 이름
  const [birthday, setBirthday] = useState(); // 생년월일
  const [gender, setGender] = useState(null); // 성별
  const [platform, setPlatform] = useState(null); // 채널 플랫폼
  const [channelId, setChannelId] = useState(''); // 채널 아이디
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false); // 성별 선택 모달 표시 여부
  const [isPlatformModalVisible, setPlatformModalVisible] = useState(false); // 플랫폼 선택 모달 표시 여부

  const [step, setStep] = useState(1); // 회원가입 단계 구분  
  const handleNextStep = () => {
    if (step < 8) {
      setStep(step + 1);
    }
  };
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const [selectedChips, setSelectedChips] = useState([]);
  const toggle = useCallback((option) => {
    if (selectedChips.includes(option)) {
      setSelectedChips(selectedChips.filter((chip) => chip !== option));
    } else {
      if (selectedChips.length < 3) {
        setSelectedChips([...selectedChips, option]);
      }
    }
  }, [selectedChips]);

  return (
    <View style={[ styles.signUpContainer, { paddingTop: insets.top, paddingBottom: insets.bottom } ]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            if (step === 1) {
              router.back();
            } else {
              handlePreviousStep();
            }
          }}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>
      </View>

      {/* 바디 */}
      <View style={{ flex: 17 }}>
        {/* 회원가입 단계별 문구 */}
        <View style={[styles.titleContainer, { display: step <= 7 ? 'flex' : 'none' }]}>
          <Text style={styles.titleText}>
            {step === 1 && `반갑습니다!\n어떻게 불러드리면 될까요?`}
            {step === 2 && `${username}님의 생일을 알려주세요`}
            {step === 3 && `성별은 어떻게 되시나요?`} 
            {step === 4 && `${username}님이 운영하시는\n채널의 플랫폼 형태를 알려주세요`}
            {step === 5 && `${username}님이 운영하시는\n채널의 관심 분야를 알려주세요!`}
            {step === 6 && `${username}님이 운영하시는\n채널의 아이디를 알려주세요.`}
            {step === 7 && `정보가 모두 맞나요?`}
          </Text>
        </View>
        <View style={{ flex: 15 }}>
          {/* 회원가입 단계별 입력 폼 */}
          <View style={[styles.formContainer, { display: step <= 7 ? 'flex' : 'none' }]}>
            {/* 이름 */}
            <View style={{ display: step >= 1 && step <= 3 ? 'flex' : 'none' }}>
              <Text style={styles.inputTitle}>이름 또는 닉네임</Text>
              <TextInput
                style={styles.nameInputForm}
                value={username}
                onChangeText={setUsername}
                onSubmitEditing={handleNextStep}
              />
            </View>
            {/* 생년월일 */}
            <View style={{ display: step >= 2 && step <= 3 ? 'flex' : 'none' }}>
              <Text style={styles.inputTitle}>생년월일 (8자리)</Text>
              <TextInput
                style={styles.birthdayInputForm}
                placeholder='1990.01.01'
                value={birthday}
                onChangeText={setBirthday}
                onSubmitEditing={handleNextStep}
              />
            </View>
            {/* 성별 */}
            <View style={{ display: step === 3 ? 'flex' : 'none' }}>
              <Text style={styles.inputTitle}/>
              <View style={styles.genderInputFormContainer}>
                  {gender === null ? <Text style={{ color: '#a5a5a5' }}>성별</Text> : <Text>{gender}</Text>}
                  <Pressable
                    onPress={() => setIsGenderModalVisible(true)}  
                  >
                    <Ionicons name="chevron-down" size={24} color="#a5a5a5" />
                  </Pressable>
              </View>
            </View>
            {/* 채널 플랫폼 */}
            <View style={{ display: step >= 4 && step <= 7 ? 'flex' : 'none' }}>
              <Text style={styles.inputTitle}>채널 플랫폼</Text>
              <View style={styles.platformInputFormContainer}>
                {platform === null ? <Text>채널 플랫폼 선택</Text> : <Text>{platform}</Text>}
                <Pressable
                  onPress={() => {setPlatformModalVisible(true)}}
                >
                  <Ionicons name="chevron-down" size={24} color="#a5a5a5" />
                </Pressable>
              </View>
            </View>
            {/* 관심 분야 */}
            <View style={{ display: step >= 5 && step <= 7 ? 'flex' : 'none' }}>
              <Text style={styles.inputTitle}>관심 분야 ( 중복 가능 / 최대 3가지 선택 )</Text>
              <View style={styles.interestFieldOptionContainer}>
                {chipOptions.map((option) => (
                  <Chip 
                    key={option}
                    label={option}
                    isSelected={selectedChips.length === 0 || selectedChips.includes(option)}
                    onPress={() => toggle(option)}
                  />
                ))}
                <Pressable
                  onPress={() => handleNextStep()}
                >
                  <Ionicons name="chevron-forward" size={20} color="#000000" />
                </Pressable>
              </View>
            </View>
            {/* 채널 아이디 */}
            <View style={{ display: step >= 6 && step <= 7 ? 'flex' : 'none' }}>
              <Text style={styles.inputTitle}>채널 아이디</Text>
              <TextInput
                style={styles.channelIdInputForm}
                placeholder='@Krzipsa'
                value={channelId}
                onChangeText={setChannelId}
                onSubmitEditing={handleNextStep}
              />
            </View>
          </View>
          {/* 채널 추가 */}
          <View>
            <Pressable
              style={[
                styles.addChannelButton, 
                { display: step === 7 ? 'flex' : 'none'}
              ]}
            >
              <Ionicons name="add" size={24} color="#000000" />
              <Text style={{ fontSize: 12, fontWeight: 'medium' }}>채널 추가</Text>
            </Pressable>
          </View>
          {/* 가입 완료 */}
          <View style={ [ styles.completedContainer, { display: step === 8 ? 'flex' : 'none' } ] }>
            <Text style={styles.completedText}>{`${username}님, 환영합니다!\n가입이 완료되었습니다`}</Text>
            {/* 추후 로고 대체 */}
            <Ionicons name="checkmark-circle-outline" size={100} color="#4A49F6" /> 
          </View>
        </View>
        {/* 정보 확인 버튼 */}
        <View>
          <Pressable
            style={[
              styles.confirmButton, 
              { display: step === 7 ? 'flex' : 'none'}
            ]}
            onPress={() => handleNextStep()}
          >
            <Text style={styles.confirmButtonText}>확인했어요</Text>
          </Pressable>
        </View>
      </View>

      {/* 성별 선택 모달 */}
      <Modal
        visible={isGenderModalVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() => setIsGenderModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[ styles.modalContainer, { paddingBottom: insets.bottom + 53 } ]}>
            <Text style={styles.modalText}>
              성별은 어떻게 되시나요?
            </Text>
            <View style={styles.genderModalOptionContainer}>
              <Pressable 
                style={[
                  styles.genderModalOption,
                  gender === '여성' && styles.dimmedOption
                ]}
                onPress={() => {
                  setGender('남성');
                  setTimeout(() => {
                    setIsGenderModalVisible(false);
                    handleNextStep();
                  }, 300);
                }}  
              >
                <Ionicons name="male" size={80} color="#4A49F6" />
                <Text style={styles.modalOptionText}>남성</Text>
              </Pressable>
              <Pressable 
                style={[
                  styles.genderModalOption,
                  gender === '남성' && styles.dimmedOption
                ]}
                onPress={() => {
                  setGender('여성');
                  setTimeout(() => {
                    setIsGenderModalVisible(false);
                    handleNextStep();
                  }, 300);
                }}
              >
                <Ionicons name="female" size={80} color="#4A49F6" />
                <Text style={styles.modalOptionText}>여성</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* 플랫폼 선택 모달 */}
      <Modal
        visible={isPlatformModalVisible}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() => setPlatformModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[ styles.modalContainer, { paddingBottom: insets.bottom + 53 } ]}>
            <Text style={styles.modalText}>
              채널 플랫폼을 선택해주세요.
            </Text>  
            <View style={styles.platformModalOptionContainer}>
                <Pressable
                  style={[
                    styles.platformModalOption,
                    !(platform === null || platform === '인스타그램') && styles.dimmedOption
                  ]}
                  onPress={() => {
                    setPlatform('인스타그램');
                    setTimeout(() => {
                      setPlatformModalVisible(false);
                      handleNextStep();
                    }, 300);
                  }}
                >
                  <Image source={instagramLogo} style={{ width: 40, height: 40 }} />
                  <Text style={styles.modalOptionText}>Instagram</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.platformModalOption,
                    !(platform === null || platform === '유튜브') && styles.dimmedOption
                  ]}
                  onPress={() => {
                    setPlatform('유튜브');
                    setTimeout(() => {
                      setPlatformModalVisible(false);
                      handleNextStep();
                    }, 300);
                  }}
                >
                  <Image source={youtubeLogo} style={{ width: 40, height: 40 }} />
                  <Text style={styles.modalOptionText}>Youtube</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.platformModalOption,
                    !(platform === null || platform === '틱톡') && styles.dimmedOption
                  ]}
                  onPress={() => {
                    setPlatform('틱톡');
                    setTimeout(() => {
                      setPlatformModalVisible(false);
                      handleNextStep();
                    }, 300);
                  }}
                >
                  <Image source={tictokLogo} style={{ width: 40, height: 40 }} />
                  <Text style={styles.modalOptionText}>Tictok</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.platformModalOption,
                    !(platform === null || platform === '기타 플랫폼') && styles.dimmedOption
                  ]}
                  onPress={() => {
                    setPlatform('기타 플랫폼');
                    setTimeout(() => {
                      setPlatformModalVisible(false);
                      handleNextStep();
                    }, 300);
                  }}
                >
                  <Text style={styles.modalOptionText}>기타 플랫폼</Text>
                </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  signUpContainer: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 16,
    marginBottom: 36,
  },
  titleContainer: {
    flex: 2,
    paddingLeft: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'medium',
  },
  formContainer: {
    position: 'relative',
    width: 380,
    paddingLeft: 16,
    flexDirection: 'column-reverse',
    justifyContent: 'flex-end',
    gap: 40,
  },
  inputTitle: {
    fontSize: 12,
    fontWeight: 200,
  },
  nameInputForm: {
    height: 42,
    paddingLeft: 3,
    borderBottomWidth: 0.5,
  },
  birthdayInputForm: {
    height: 42,
    paddingLeft: 3,
    borderBottomWidth: 0.5,
  },
  genderInputFormContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 42,
    paddingLeft: 3,
    borderBottomWidth: 0.5,
  },
  modalBackground: {
    flex: 1,
    padding: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 34,
    paddingLeft: 16,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'medium',
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
    borderRadius: 16,
    shadowOpacity: 0.15,
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.15)',
  },
  dimmedOption: {
    opacity: 0.3,
  },
  modalOptionText: {
    fontSize: 18,
    fontWeight: 'medium',
  },
  platformInputFormContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 42,
    paddingLeft: 3,
    borderBottomWidth: 0.5,
  },
  platformModalOptionContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginTop: 25,
  },
  platformModalOption: {
    width: 314,
    height: 78,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 16,
    shadowOpacity: 0.15,
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.15)',
    paddingLeft: 24,
    gap: 10,
  },
  interestFieldOptionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 0.5,
    gap: 12,
    paddingVertical: 20,
  },
  baseChip: {
    height: 20,
    paddingHorizontal: 23,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A7A7A7',
    borderRadius: 100,
    borderWidth: 0.5, 
    borderColor: '#A7A7A7',
  },
  baseChipText: {
    fontSize: 12,
    fontWeight: 'medium',
  },
  selectedChip: {
    height: 20,
    paddingHorizontal: 23,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#4A49F6',
    borderWidth: 0.5,
    borderRadius: 16,
  },
  selectedChipText: {
    fontSize: 12,
    fontWeight: 'medium',
    color: '#4A49F6',
  },
  channelIdInputForm: {
    height: 42,
    paddingLeft: 3,
    borderBottomWidth: 0.5,
  },
  addChannelButton: {
    width: 120,
    height: 45,
    marginTop: 42,
    marginLeft: 16,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 0.5,
    borderRadius: 4,
  },
  confirmButton: {
    width: 380,
    height: 60,
    position: 'absolute',
    bottom: 15,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#4A49F6',
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  completedContainer: {
    flex: 17,
    width: '100%',
    alignItems: 'center',
    gap: 36,
  },
  completedText: {
    textAlign: 'center',
    paddingTop: 180,
    fontSize: 20,
    fontWeight: 'medium',
  },
})