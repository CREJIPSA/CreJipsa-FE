import useThemedStyle from '@/app/hooks/use-themed-style';
import { Pressable, Text, View } from 'react-native';
import Modal from 'react-native-modal';

export default function DeleteModal({
  visible,
  mainText,
  subText,
  closeText,
  confirmText,
  onClose,
  onConfirm,
}) {
  const { styles } = useThemedStyle(getStyles);

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={onClose}
    >
      <View style={styles.modal}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{mainText}</Text>
          {subText && (
            <Text style={[styles.text, { fontSize: 12 }]}>{subText}</Text>
          )}
        </View>
        <View style={styles.row}>
          <Pressable style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>{closeText}</Text>
          </Pressable>
          <Pressable style={styles.okBtn} onPress={onConfirm}>
            <Text style={styles.okText}>{confirmText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (isDark, primaryColors) => {
  return {
    modal: {
      backgroundColor: isDark ? '#454545' : '#FFFFFF',
      paddingVertical: 28,
      paddingHorizontal: 24,
      borderRadius: 15,
      width: '80%',
      alignSelf: 'center',
    },
    textContainer: {
      gap: 8,
      marginBottom: 30,
    },
    text: {
      color: isDark ? '#FFFFFF' : '#000000',
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
    },
    cancelBtn: {
      flex: 1,
      marginRight: 10,
      backgroundColor: '#FAFAFA',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
    },
    okBtn: {
      flex: 1,
      backgroundColor: isDark ? '#CCFF66' : '#B8E65C',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
    },
    cancelText: {
      textAlign: 'center',
      fontWeight: '500',
    },
    okText: {
      textAlign: 'center',
      fontWeight: '500',
    },
  };
};
