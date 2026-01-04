import useThemedStyle from '@/app/hooks/use-themed-style';
import CopyIcon from '@/assets/svgs/storyboard/copy.js';
import EditIcon from '@/assets/svgs/storyboard/edit.js';
import ShareIcon from '@/assets/svgs/storyboard/share.js';
import { Pressable, Text, View } from 'react-native';

const MessageItem = ({ text, isUser }) => {
  const { styles, primaryColors } = useThemedStyle(getStyles);

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
          >
            <Text
              style={[styles.input, isUser ? styles.userText : styles.aiText]}
            >
              {text}
            </Text>
          </View>
          {/* 편집 버튼 */}
          {!isUser && (
            <View style={styles.btnContainer}>
              <Pressable>
                <ShareIcon size={20} color={primaryColors.color} />
              </Pressable>
              <Pressable>
                <CopyIcon size={24} color={primaryColors.color} />
              </Pressable>
              <Pressable style={styles.editBtn}>
                <EditIcon size={16} color="#1B1B1B" />
                <Text style={styles.editBtnText}>편집</Text>
              </Pressable>
            </View>
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
