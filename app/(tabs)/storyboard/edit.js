import useThemedStyle from '@/app/hooks/use-themed-style';
import MenuIcon from '@/assets/svgs/storyboard/menu';
import { useRouter } from 'expo-router';
import { memo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function StoryboardEdit() {
  const { styles, primaryColors, isDark } = useThemedStyle(getStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // 편집 옵션 상태 관리
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedContentLength, setSelectedContentLength] = useState(null);
  const [selectedCutCount, setSelectedCutCount] = useState(null);
  // const [customCutCount, setCustomCutCount] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [requiredContent, setRequiredContent] = useState('');
  const [avoidedContent, setAvoidedContent] = useState('');

  // 칩 컴포넌트
  const Chip = memo(function Chip({ label, selected, onPress }) {
    return (
      <Pressable
        style={[styles.chip, selected && styles.chipSelected]}
        onPress={onPress}
      >
        <Text style={[styles.chipLabel, selected && styles.chipSelectedLabel]}>
          {label}
        </Text>
      </Pressable>
    );
  });

  // 칩 옵션
  const PlatformChips = ['유튜브', '인스타', '틱톡'];
  const ContentLengthChips = [
    '15초 내외',
    '30초 내외',
    '1분 이상',
    '15분 이상',
  ];
  const CutCountChips = ['5컷', '7컷', '10컷', '직접 입력'];

  // 칩 토글
  const toggle = (value, setter, current) => {
    if (value === current) {
      setter(null);
    } else {
      setter(value);
    }
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={24}
          color={primaryColors.color}
          onPress={() => router.back()}
        />
        <Text style={styles.titleText}>AI 스토리보드 편집</Text>
        <MenuIcon color={primaryColors.color} size={24} />
      </View>
      <ScrollView style={styles.contentContainer}>
        {/* STEP 1 */}
        <Text style={styles.stepLabel}>STEP 01.</Text>
        <View style={styles.editOptionContainer}>
          <Text style={styles.stepTitle}>플랫폼</Text>
          <View style={styles.chipContainer}>
            {PlatformChips.map(option => (
              <Chip
                key={option}
                label={option}
                selected={selectedPlatform === option}
                onPress={() =>
                  toggle(option, setSelectedPlatform, selectedPlatform)
                }
              />
            ))}
          </View>
        </View>
        <View style={styles.editOptionContainer}>
          <Text style={styles.stepTitle}>콘텐츠 길이</Text>
          <View style={styles.chipContainer}>
            {ContentLengthChips.map(option => (
              <Chip
                key={option}
                label={option}
                selected={selectedContentLength === option}
                onPress={() =>
                  toggle(
                    option,
                    setSelectedContentLength,
                    selectedContentLength,
                  )
                }
              />
            ))}
          </View>
        </View>
        {/* 영상 목적 */}
        {/* STEP 2 */}
        <Text style={[styles.stepLabel, { marginTop: 30 }]}>STEP 02.</Text>
        <View style={styles.editOptionContainer}>
          <Text style={styles.stepTitle}>컷 개수</Text>
          <View style={styles.chipContainer}>
            {CutCountChips.map(option => (
              <Chip
                key={option}
                label={option}
                selected={selectedCutCount === option}
                onPress={() =>
                  toggle(option, setSelectedCutCount, selectedCutCount)
                }
              />
            ))}
          </View>
        </View>
        <View style={styles.editOptionContainer}>
          <Text style={styles.stepTitle}>한 줄 메세지</Text>
          <TextInput
            style={styles.textInput}
            value={customMessage}
            onChangeText={setCustomMessage}
            placeholder="예시 : 크집사 앱 소개 영상"
            placeholderTextColor={isDark ? '#D3D3D3' : '#959595'}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.editOptionContainer}>
          <Text style={styles.stepTitle}>필수로 들어가야 할 내용</Text>
          <TextInput
            style={styles.textInput}
            value={requiredContent}
            onChangeText={setRequiredContent}
            placeholder="예시 : 크집사 앱 기능 소개"
            placeholderTextColor={isDark ? '#D3D3D3' : '#959595'}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.editOptionContainer}>
          <Text style={styles.stepTitle}>기피해야 할 내용 (선택)</Text>
          <TextInput
            style={styles.textInput}
            value={avoidedContent}
            onChangeText={setAvoidedContent}
            placeholder="예시 : 크집사 앱 내 문제점"
            placeholderTextColor={isDark ? '#D3D3D3' : '#959595'}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: primaryColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColors.color,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  stepLabel: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#CCFF66' : '#A3CC52',
  },
  editOptionContainer: {
    marginTop: 24,
    gap: 8,
  },
  stepTitle: {
    fontSize: 18,
    color: primaryColors.color,
  },
  textInput: {
    backgroundColor: isDark ? '#454545' : '#E6E6E6',
    borderRadius: 100,
    paddingHorizontal: 15,
    color: primaryColors.color,
    fontSize: 14,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: isDark ? '#454545' : '#E6E6E6',
    borderRadius: 100,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  chipLabel: {
    color: primaryColors.color,
    fontSize: 14,
  },
  chipSelected: {
    backgroundColor: isDark ? '#CCFF66' : '#C6E945',
  },
  chipSelectedLabel: {
    color: '#141414',
  },
});
