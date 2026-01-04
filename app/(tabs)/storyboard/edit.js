import useThemedStyle from '@/app/hooks/use-themed-style';
import MenuIcon from '@/assets/svgs/storyboard/menu';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StoryboardDrawer from './drawer';

export default function StoryboardEdit() {
  const { styles, primaryColors } = useThemedStyle(getStyles);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [cuts, setCuts] = useState([1]);

  // 컷 컴포넌트
  const CutComponent = ({ cutNum }) => {
    return (
      <View style={styles.cutContainer}>
        <View style={styles.numberBox}>
          <Text style={styles.numberText}>{cutNum}</Text>
        </View>
        <View style={styles.contentsContainer}>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>컷 구성</Text>
            <TextInput style={styles.contentInput} />
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>대본</Text>
            <TextInput style={styles.contentInput} />
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>자막</Text>
            <TextInput style={styles.contentInput} />
          </View>
          <View style={styles.contentBox}>
            <Text style={styles.contentText}>기타</Text>
            <TextInput style={styles.contentInput} />
          </View>
        </View>
      </View>
    );
  };

  const addCut = () => {
    setCuts(prevCuts => [...prevCuts, prevCuts.length + 1]);
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={24}
          color={primaryColors.color}
          onPress={() => router.back()}
        />
        <Text style={styles.headerText}>AI 스토리보드 편집</Text>
        <Pressable onPress={() => setDrawerVisible(true)}>
          <MenuIcon color={primaryColors.color} size={24} />
        </Pressable>
      </View>
      {/* 스토리보드 */}
      {/* 제목 */}
      <View style={styles.titleContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="스토리보드 제목"
          placeholderTextColor={primaryColors.color}
        />
        <Pressable style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>저장</Text>
        </Pressable>
      </View>
      {/* 스크립트 */}
      <ScrollView contentContainerStyle={{ paddingVertical: 50 }}>
        {cuts.map((cut, index) => (
          <CutComponent key={index} cutNum={index + 1} />
        ))}
        {/* 컷 추가 버튼 */}
        <View>
          <Pressable
            style={styles.addBtn}
            onPress={() => {
              addCut();
            }}
          >
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
        </View>
      </ScrollView>
      {/* 사이드바 */}
      <StoryboardDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: primaryColors.background,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColors.color,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#454545' : '#D3D3D3',
  },
  titleInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: primaryColors.color,
    paddingVertical: 8,
  },
  saveBtn: {
    backgroundColor: primaryColors.pointColor,
    paddingVertical: 2,
    paddingHorizontal: 14,
    borderRadius: 100,
  },
  saveBtnText: {
    color: '#1B1B1B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cutContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  numberBox: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#E3FFAB' : '#C6E945',
    borderRadius: 4,
  },
  numberText: {
    fontSize: 16,
    color: '#000000',
  },
  contentsContainer: {
    flex: 1,
    gap: 16,
  },
  contentBox: {
    gap: 8,
  },
  contentText: {
    color: primaryColors.color,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentInput: {
    borderRadius: 8,
    backgroundColor: isDark ? '#454545' : '#F5F5F5',
    color: primaryColors.color,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  addBtn: {
    width: 30,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#D3D3D3' : '#E6E6E6',
    borderRadius: 4,
  },
  addBtnText: {
    fontSize: 24,
    color: isDark ? '#454545' : '#8A8A8A',
  },
});
