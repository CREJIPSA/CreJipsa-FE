import { AuthContext } from '@/app/_layout';
import useThemedStyle from '@/app/hooks/use-themed-style';
import CopyIcon from '@/assets/svgs/storyboard/copy.js';
import EditIcon from '@/assets/svgs/storyboard/edit.js';
import ShareIcon from '@/assets/svgs/storyboard/share.js';
import { router } from 'expo-router';
import { useContext, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const MessageItem = ({ text, isUser, chatMessageId }) => {
  const { styles, primaryColors } = useThemedStyle(getStyles);

  const { accessToken } = useContext(AuthContext);

  const msgIdNum = Number(chatMessageId);
  const hasValidMessageId = Number.isFinite(msgIdNum);

  // 말풍선이 작으면 버튼 재배치
  const [isNarrow, setIsNarrow] = useState(false);
  const bubbleWidthRef = useRef(0);
  const buttonWidthRef = useRef(0);
  const updateNarrow = () => {
    const bubbleWidth = bubbleWidthRef.current;
    const buttonWidth = buttonWidthRef.current;
    if (bubbleWidth && buttonWidth) {
      const next = bubbleWidth < buttonWidth + 20; // 여유 공간 20px
      setIsNarrow(prev => (prev === next ? prev : next));
    }
  };

  // 스토리보드 편집 화면으로 이동
  const handlePressEdit = async () => {
    try {
      const res = await fetch(
        `https://dev.crezipsa.site/api/storyboard/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title: null,
            ...(hasValidMessageId ? { chatMessageId: msgIdNum } : {}),
          }),
        },
      );

      const raw = await res.text();
      console.log('Create Storyboard API response:', res.status, raw);

      if (!res.ok) {
        throw new Error(
          `Create Storyboard API error: ${res.status} raw=${raw}`,
        );
      }

      const data = raw ? JSON.parse(raw) : null;
      const storyboardId = data?.result?.storyboardId;

      if (!storyboardId)
        throw new Error(`No storyboardId in response raw=${raw}`);

      router.push({
        pathname: `/storyboard/edit/${storyboardId}`,
        params: { chatMessageId }, // 필요하면 넘기고
      });
    } catch (e) {
      console.error('Failed to create storyboard:', e);
    }
  };

  // 메시지가 비어있으면 렌더링하지 않음
  if (!text) {
    return null;
  }

  return (
    <View style={{ marginBottom: 30 }}>
      <View
        style={[
          styles.mainContainer,
          isUser
            ? { justifyContent: 'flex-end' }
            : { justifyContent: 'flex-start' },
        ]}
      >
        <View
          style={[
            styles.wrapper,
            isUser ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' },
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              isUser ? styles.userMessage : styles.aiMessage,
            ]}
            onLayout={e => {
              bubbleWidthRef.current = e.nativeEvent.layout.width;
              updateNarrow();
            }}
          >
            <Text
              style={[styles.input, isUser ? styles.userText : styles.aiText]}
            >
              {text}
            </Text>
          </View>
          {/* 편집 버튼 */}
          {!isUser && (
            <>
              {/* 여백 맞추기 용도 */}
              <View
                style={styles.measureRow}
                pointerEvents="none"
                onLayout={e => {
                  if (buttonWidthRef.current) return;
                  buttonWidthRef.current = e.nativeEvent.layout.width;
                  updateNarrow();
                }}
              >
                <ShareIcon size={20} color={primaryColors.color} />
                <CopyIcon size={24} color={primaryColors.color} />
                <View style={styles.editBtn}>
                  <EditIcon size={16} color="#1B1B1B" />
                  <Text style={styles.editBtnText}>편집</Text>
                </View>
              </View>
              {/* 버튼 컨테이너 */}
              <View
                style={[
                  styles.btnContainer,
                  isNarrow && styles.btnContainerNarrow,
                ]}
              >
                {isNarrow ? (
                  // 말풍선이 좁으면 버튼 세로 배치
                  <>
                    <Pressable style={styles.editBtn} onPress={handlePressEdit}>
                      <EditIcon size={16} color="#1B1B1B" />
                      <Text style={styles.editBtnText}>편집</Text>
                    </Pressable>
                    <View style={styles.iconRow}>
                      <Pressable>
                        <ShareIcon size={20} color={primaryColors.color} />
                      </Pressable>
                      <Pressable>
                        <CopyIcon size={24} color={primaryColors.color} />
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <>
                    <Pressable>
                      <ShareIcon size={20} color={primaryColors.color} />
                    </Pressable>
                    <Pressable>
                      <CopyIcon size={24} color={primaryColors.color} />
                    </Pressable>
                    <Pressable style={styles.editBtn} onPress={handlePressEdit}>
                      <EditIcon size={16} color="#1B1B1B" />
                      <Text style={styles.editBtnText}>편집</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default MessageItem;

const getStyles = (isDark, primaryColors) => ({
  mainContainer: {
    flexDirection: 'row',
  },
  wrapper: {
    maxWidth: '80%',
  },
  messageBubble: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  userMessage: {
    borderBottomRightRadius: 0,
    backgroundColor: isDark ? '#EEFFCD' : '#D6F663',
  },
  aiMessage: {
    borderBottomLeftRadius: 0,
    backgroundColor: isDark ? '#454545' : '#E6E6E6',
  },
  input: {
    fontSize: 14,
  },
  userText: {
    color: '#141414',
  },
  aiText: {
    color: primaryColors.color,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  btnContainerNarrow: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  measureRow: {
    position: 'absolute',
    opacity: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primaryColors.pointColor,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 100,
  },
  editBtnText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#1B1B1B',
  },
});
