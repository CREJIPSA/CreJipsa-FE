import { createPost, getPresignedUrl, uploadFileToS3 } from '@/app/api/feed';
import {
  COMMUNITY_FIELDS,
  getFieldKeyByLabel,
  getWriteFieldOptions,
} from '@/app/constants/common/COMMUNITY_FIELDS';
import useThemedStyle from '@/app/hooks/use-themed-style';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { router } from 'expo-router';
import { useContext, useRef, useState } from 'react';
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
import { AuthContext } from './_layout';
import FilterComponent from './components/my/FilterComponent';

export default function WritePost() {
  const { accessToken } = useContext(AuthContext);
  const [isUploading, setIsUploading] = useState(false);
  const { isDark, styles, primaryColors } = useThemedStyle(getStyles);
  const [openedFilter, setOpenedFilter] = useState(null);
  const [selectedField, setSelectedField] = useState('RECOMMEND');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const richText = useRef();

  const handleSelectFilter = label => {
    const key = getFieldKeyByLabel(label);
    if (key) {
      setSelectedField(key);
    }
    setOpenedFilter(null);
  };

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

  const handleUpload = async () => {
    if (isUploading) return;

    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (!title.trim() || !plainText) {
      Alert.alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setIsUploading(true);
      const uploadedImageUrls = [];

      for (const uri of images) {
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1].toLowerCase()}` : `image/jpeg`;
        const uniqueFileName = `community/${Date.now()}-${filename}`;

        // 1. Presigned URL 발급 및 검증
        const urlData = await getPresignedUrl(
          uniqueFileName,
          type,
          accessToken,
        );

        if (!urlData?.success) {
          throw new Error('업로드 주소 발급에 실패했습니다.');
        }

        const { uploadUrl, fileUrl } = urlData.result;

        // 2. S3 업로드 및 검증
        const uploadResp = await uploadFileToS3(uploadUrl, uri, type);

        if (!uploadResp.ok) {
          const errorText = await uploadResp.text();
          throw new Error(`이미지 서버 업로드 실패: ${errorText}`);
        }

        uploadedImageUrls.push(fileUrl);
      }

      // 3. 최종 게시글 생성 데이터 구성
      const postData = {
        title,
        content,
        field: selectedField,
        imageUrls: uploadedImageUrls,
      };

      // 4. 게시글 API 호출 및 결과 처리
      const result = await createPost(postData, accessToken);

      if (!result?.success) {
        Alert.alert(
          '업로드 실패',
          result?.message ?? '서버 오류가 발생했습니다.',
        );
        return;
      }

      // 최종 성공 시 처리
      Alert.alert('성공', '게시글이 업로드되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/feed');
            }
          },
        },
      ]);
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert(
        '오류 발생',
        error.message || '알 수 없는 오류가 발생했습니다.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>피드 작성</Text>
        <Pressable onPress={handleUpload}>
          <Text style={styles.uploadBtnText}>업로드</Text>
        </Pressable>
      </View>
      <View style={styles.filterComponent}>
        <FilterComponent
          text={COMMUNITY_FIELDS[selectedField]}
          isOpen={openedFilter === 'category'}
          onPress={() => toggleFilter('category')}
          options={getWriteFieldOptions}
          onSelect={handleSelectFilter}
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
