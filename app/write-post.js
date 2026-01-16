import useThemedStyle from '@/app/hooks/use-themed-style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import FilterComponent from './components/my/FilterComponent';

export default function WritePost() {
  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [openedFilter, setOpenedFilter] = useState(null);

  const toggleFilter = filterName => {
    setOpenedFilter(openedFilter === filterName ? null : filterName);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>피드 작성</Text>
        <Pressable onPress={() => console.log('업로드')}>
          <Text style={styles.uploadBtnText}>업로드</Text>
        </Pressable>
      </View>
      <View style={styles.filterComponent}>
        <FilterComponent
          text={'전체'}
          isOpen={openedFilter === 'category'}
          onPress={() => toggleFilter('category')}
          options={['일반', '팁', '같이 촬영해요']}
        />
      </View>
      <TextInput
        style={styles.titleInput}
        placeholder="제목을 입력해주세요"
        placeholderTextColor={primaryColors.color} // 테마에 따른 placeholder 색상
        value={title}
        onChangeText={setTitle}
        returnKeyType="next" // 키보드에서 '다음' 버튼 표시
      />
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="피드 내용을 입력해주세요. 각 게시판 목적과 알맞지 않은 내용의 피드는 관리자의 관리에 따라 삭제될 수 있습니다."
          placeholderTextColor={isDark ? '#D3D3D3' : '#666666'}
          multiline
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
        />
        <View style={styles.toolbar}>
          <View style={styles.formatIcons}>
            <Pressable onPress={() => console.log('Bold')}>
              <MaterialCommunityIcons
                name="format-bold"
                size={24}
                color={primaryColors.color}
              />
            </Pressable>
            <Pressable onPress={() => console.log('Underline')}>
              <MaterialCommunityIcons
                name="format-underline"
                size={24}
                color={primaryColors.color}
              />
            </Pressable>
            <Pressable onPress={() => console.log('Image Picker')}>
              <MaterialCommunityIcons
                name="image-outline"
                size={24}
                color={primaryColors.color}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: primaryColors.background,
      paddingHorizontal: 16,
      paddingVertical: 61,
    },

    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    headerText: {
      fontSize: 20,
      fontWeight: '700',
      color: primaryColors.color,
    },

    uploadBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: primaryColors.pointColor,
    },

    filterComponent: {
      marginTop: 35,
      alignSelf: 'flex-start',
      zIndex: 100,
    },

    titleInput: {
      marginTop: 25,
      fontSize: 20,
      fontWeight: '700',
      color: primaryColors.color,
      paddingVertical: 10,
      backgroundColor: 'transparent',
      outlineStyle: 'none',
    },

    inputWrapper: {
      marginTop: 25,
      borderRadius: 20,
      padding: 16,
      minHeight: 390,
      position: 'relative',
      backgroundColor: isDark ? '#323232' : '#E6E6E6',
    },

    textInput: {
      fontSize: 16,
      lineHeight: 22,
      color: primaryColors.color,
      paddingBottom: 40,
    },

    toolbar: {
      position: 'absolute',
      bottom: 30,
      right: 16,
      flexDirection: 'row',
    },

    formatIcons: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
  });
};
