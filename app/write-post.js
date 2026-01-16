import useThemedStyle from '@/app/hooks/use-themed-style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useRef, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';
import FilterComponent from './components/my/FilterComponent';

export default function WritePost() {
  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);
  const [openedFilter, setOpenedFilter] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const richText = useRef();

  const toggleFilter = filterName => {
    setOpenedFilter(openedFilter === filterName ? null : filterName);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('사진첩 접근 권한이 없습니다!');
      return;
    }

    const result = await launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map(asset => asset.uri);
      setImages([...images, ...selectedUris]);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>피드 작성</Text>
        <Pressable onPress={() => console.log(content)}>
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
        placeholderTextColor={primaryColors.color}
        value={title}
        onChangeText={setTitle}
        returnKeyType="next"
      />
      <View
        style={[
          styles.inputWrapper,
          images.length > 0 && styles.inputWrapperWithImages,
        ]}
      >
        <RichEditor
          ref={richText}
          style={styles.richEditor}
          placeholder="피드 내용을 입력해주세요. 각 게시판 목적과 알맞지 않은 내용의 피드는 관리자의 관리에 따라 삭제될 수 있습니다."
          editorStyle={{
            backgroundColor: 'transparent',
            color: primaryColors.color,
            placeholderColor: isDark ? '#D3D3D3' : '#666666',
            contentCSSText: 'font-size: 16px; line-height: 22px;',
          }}
          onChange={setContent}
        />
        {images.length > 0 && (
          <View style={styles.imageHorizontalList}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.previewImage} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        <RichToolbar
          editor={richText}
          actions={[actions.setBold, actions.setUnderline, 'insertImage']}
          iconMap={{
            insertImage: ({ tintColor }) => (
              <MaterialCommunityIcons
                name="image-outline"
                size={24}
                color={tintColor}
              />
            ),
          }}
          insertImage={pickImage}
          style={styles.customToolbar}
          flatContainerStyle={styles.toolbarContainer}
          selectedIconTint={primaryColors.pointColor}
          iconTint={primaryColors.color}
        />
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
    },

    inputWrapper: {
      marginTop: 25,
      borderRadius: 20,
      padding: 16,
      minHeight: 390,
      position: 'relative',
      backgroundColor: isDark ? '#323232' : '#E6E6E6',
      justifyContent: 'space-between',
    },

    richEditor: {
      flex: 1,
      backgroundColor: 'transparent',
    },

    inputWrapperWithImages: {
      minHeight: 539,
    },

    textInput: {
      fontSize: 16,
      lineHeight: 22,
      color: primaryColors.color,
      paddingBottom: 40,
    },

    imageHorizontalList: {
      height: 293,
      marginBottom: 40,
    },

    imageContainer: {
      position: 'relative',
      marginRight: 12,
    },

    previewImage: {
      width: 273,
      height: 273,
      borderRadius: 15,
      resizeMode: 'cover',
    },

    customToolbar: {
      position: 'absolute',
      bottom: 20,
      right: 16,
      backgroundColor: 'transparent',
    },

    toolbarContainer: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      gap: 8,
    },
  });
};
