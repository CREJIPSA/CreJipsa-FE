import useThemedStyle from '@/app/hooks/use-themed-style';
import { Text, View } from 'react-native';

const MessageItem = ({ text, isUser }) => {
  const { styles } = useThemedStyle(getStyles);

  // 메시지가 비어있으면 렌더링하지 않음
  if (!text) {
    return null;
  }

  return (
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
          styles.messageBubble,
          isUser ? styles.userMessage : styles.aiMessage,
        ]}
      >
        <Text style={[styles.input, isUser ? styles.userText : styles.aiText]}>
          {text}
        </Text>
      </View>
    </View>
  );
};

export default MessageItem;

const getStyles = (isDark, primaryColors) => ({
  mainContainer: {
    flexDirection: 'row',
  },
  messageBubble: {
    maxWidth: '60%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 30,
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
});
