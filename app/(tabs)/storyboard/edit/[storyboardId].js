import { AuthContext } from '@/app/_layout';
import { authFetch } from '@/app/api/authFetch';
import CutComponent from '@/app/components/storyboard/cut';
import StoryboardDrawer from '@/app/components/storyboard/drawer/index.js';
import useThemedStyle from '@/app/hooks/use-themed-style';
import MenuIcon from '@/assets/svgs/storyboard/menu';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function StoryboardEdit() {
  const { storyboardId, draft } = useLocalSearchParams();
  const isDraft = draft === '1';

  const { styles, primaryColors } = useThemedStyle(getStyles);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { accessToken } = useContext(AuthContext);

  const [title, setTitle] = useState(''); // 스토리보드 제목
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [cuts, setCuts] = useState([]);

  const latestTitleRef = useRef(title);
  const latestCutsRef = useRef(cuts);

  useEffect(() => {
    latestTitleRef.current = title;
  }, [title]);

  useEffect(() => {
    latestCutsRef.current = cuts;
  }, [cuts]);

  // 저장 확인
  const savedRef = useRef(false);
  const isCutEmpty = cut => {
    const d = cut.description.trim();
    const s = cut.script.trim();
    const sub = cut.subtitle.trim();
    const e = cut.etc.trim();
    return !d && !s && !sub && !e;
  };
  const hasAnyMeaningfulCut = () => {
    if (!cuts?.length) return false;
    return cuts.some(cut => !isCutEmpty(cut));
  };
  const isStoryboardEmpty = (t, c) => {
    const trimmedTitle = (t ?? '').trim();
    if (trimmedTitle) return false;

    if (!c?.length) return true;
    if (c.length === 1 && isCutEmpty(c[0])) return true;

    return false;
  };

  // 뒤로가기 전에 저장 안 된 경우 스토리보드 삭제
  const deletingRef = useRef(false);
  const deleteIfEmptyAndNotSaved = async () => {
    if (!isDraft) return;
    if (savedRef.current) return;
    if (deletingRef.current) return;
    if (!storyboardId) return;

    const t = latestTitleRef.current;
    const c = latestCutsRef.current;

    if (!isStoryboardEmpty(t, c)) return;

    deletingRef.current = true;
    try {
      const res = await authFetch(
        `https://dev.crezipsa.site/api/storyboard/${storyboardId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const raw = await res.text();
      console.log('Delete Storyboard API response:', res.status, raw);
      if (!res.ok) {
        throw new Error(
          `Delete Storyboard API error: ${res.status} raw=${raw}`,
        );
      }
    } catch (error) {
      console.error('Error deleting storyboard:', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      return () => {
        deleteIfEmptyAndNotSaved();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, storyboardId, isDraft]),
  );

  // 기존 스토리보드 불러오기
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function loadStoryboard() {
        if (!accessToken || !storyboardId) return;

        try {
          const res = await authFetch(
            `https://dev.crezipsa.site/api/storyboard/${storyboardId}`,
            {
              method: 'GET',
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );

          const raw = await res.text();
          console.log('storyboard api status', res.status);
          console.log('storyboard api raw response', raw);

          if (!res.ok) {
            throw new Error(`Storyboard API error: ${res.status}`);
          }

          let data = null;
          try {
            data = raw ? JSON.parse(raw) : null;
          } catch (e) {
            console.error('Failed to parse JSON response', e);
            return;
          }

          const loadedCuts = (data?.result?.cuts ?? []).map(cut => ({
            localId: String(cut.cutId),
            id: cut.cutId,
            order: cut.order,
            description: cut.cutComposition || '',
            script: cut.script || '',
            subtitle: cut.caption || '',
            etc: cut.etc || '',
          }));

          console.log('loadedCuts[0]', loadedCuts[0]);

          if (!cancelled) {
            setTitle(data?.result?.title || '');
            setCuts(
              loadedCuts.length
                ? loadedCuts
                : [
                    {
                      localId: Date.now().toString(),
                      id: null,
                      order: '',
                      description: '',
                      script: '',
                      subtitle: '',
                      etc: '',
                    },
                  ],
            );
          }
        } catch (error) {
          console.error('Error loading storyboard:', error);
        }
      }
      loadStoryboard();

      return () => {
        cancelled = true;
      };
    }, [accessToken, storyboardId]),
  );

  // 스토리보드 저장 시 컷 추가 + 컷 수정 + 제목 수정
  const saveStoryboard = async () => {
    const titleRes = await authFetch(
      `https://dev.crezipsa.site/api/storyboard/${storyboardId}/title`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: title,
        }),
      },
    );
    if (!titleRes.ok) {
      const raw = await titleRes.text();
      console.log(
        'Update Storyboard Title API response:',
        titleRes.status,
        raw,
      );
      throw new Error(`Update Storyboard Title API error: ${titleRes.status}`);
    }

    const meaningfulCuts = cuts.filter(cut => !isCutEmpty(cut));

    for (const cut of meaningfulCuts) {
      await (async () => {
        // 새로운 컷이면 추가
        if (!cut.id) {
          const cutRes = await authFetch(
            `https://dev.crezipsa.site/api/storyboard/${storyboardId}/cuts`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          const cutRawData = await cutRes.text();
          console.log('created cut data', cutRes.status);
          console.log('created cut data', cutRawData);

          if (!cutRes.ok) {
            throw new Error(
              `Create Cut API error: ${cutRes.status} raw=${cutRawData}`,
            );
          }

          const cutData = cutRawData ? JSON.parse(cutRawData) : null;
          const newCutId = cutData?.result?.cutId;

          if (!newCutId) {
            throw new Error('No cutId returned from Create Cut API');
          }

          console.log('PATCH target cutId =', newCutId, 'body=', {
            cutComposition: cut.description,
            script: cut.script,
            caption: cut.subtitle,
            etc: cut.etc,
          });

          const createdRes = await authFetch(
            `https://dev.crezipsa.site/api/storyboard/cuts/${newCutId}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                cutComposition: cut.description,
                script: cut.script,
                caption: cut.subtitle,
                etc: cut.etc,
              }),
            },
          );
          const updatedRawData = await createdRes.text();
          console.log('updated cut data', createdRes.status);
          console.log('updated cut data', updatedRawData);

          if (!createdRes.ok) {
            throw new Error(`Update Cut API error: ${createdRes.status}`);
          }

          setCuts(prev =>
            prev.map(c =>
              c.localId === cut.localId ? { ...c, id: newCutId } : c,
            ),
          );

          const createdData = updatedRawData
            ? JSON.parse(updatedRawData)
            : null;
          console.log('updated cut data', createdData);
        } else {
          // 기존 컷이면 수정
          const updatedRes = await authFetch(
            `https://dev.crezipsa.site/api/storyboard/cuts/${cut.id}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                cutComposition: cut.description,
                script: cut.script,
                caption: cut.subtitle,
                etc: cut.etc,
              }),
            },
          );

          const updatedRawData = await updatedRes.text();
          console.log('updated cut data', updatedRes.status);
          console.log('updated cut data', updatedRawData);

          if (!updatedRes.ok) {
            throw new Error(`Update Cut API error: ${updatedRes.status}`);
          }

          const updatedData = updatedRawData
            ? JSON.parse(updatedRawData)
            : null;
          console.log('updated cut data', updatedData);
        }
      })();
    }
  };

  const addCut = () => {
    setCuts(prevCuts => [
      ...prevCuts,
      {
        localId: Date.now().toString(),
        id: null,
        description: '',
        script: '',
        subtitle: '',
        etc: '',
      },
    ]);
  };

  const updateCutField = (localId, field, value) => {
    setCuts(prevCuts =>
      prevCuts.map(cut =>
        cut.localId === localId ? { ...cut, [field]: value } : cut,
      ),
    );
  };

  // 자동 스크롤
  const scrollViewRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  useEffect(() => {
    if (isNearBottom) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [cuts, isNearBottom]);
  const handleScroll = event => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 100;
    const nearBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    setIsNearBottom(nearBottom);
  };

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Ionicons
          name="chevron-back"
          size={24}
          color={primaryColors.color}
          onPress={async () => {
            await deleteIfEmptyAndNotSaved();
            router.replace('/storyboard');
          }}
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
          value={title}
          onChangeText={setTitle}
        />
        <Pressable
          style={styles.saveBtn}
          onPress={async () => {
            Keyboard.dismiss();
            try {
              if (!hasAnyMeaningfulCut()) {
                Keyboard.dismiss();
                Toast.show({
                  type: 'addTrendToast',
                  text1: '스토리보드 내용을 입력하세요',
                  position: 'bottom',
                  visibilityTime: 2000,
                  bottomOffset: 130,
                });
                return;
              }
              await saveStoryboard();
              savedRef.current = true;
              console.log('Storyboard saved successfully');
              Toast.show({
                type: 'addTrendToast',
                text1: '저장이 완료되었습니다!',
                position: 'bottom',
                visibilityTime: 2000,
                bottomOffset: 130,
              });
            } catch (error) {
              console.error('Error saving storyboard:', error);
            }
          }}
        >
          <Text style={styles.saveBtnText}>저장</Text>
        </Pressable>
      </View>
      {/* 스크립트 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingVertical: 50 }}
        >
          {cuts.map((cut, index) => (
            <CutComponent
              key={cut.localId}
              cutNum={index + 1}
              cut={cut}
              onChangeField={(field, value) =>
                updateCutField(cut.localId, field, value)
              }
            />
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
      </KeyboardAvoidingView>
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
    backgroundColor: isDark ? '#CCFF66' : '#C6E945',
    paddingVertical: 2,
    paddingHorizontal: 14,
    borderRadius: 100,
  },
  saveBtnText: {
    color: '#1B1B1B',
    fontSize: 14,
    fontWeight: 'bold',
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
