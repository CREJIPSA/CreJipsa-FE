import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

export default function DeleteModal({ visible, onClose, isDark }) {
  const modalBg = isDark ? '#454545' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const okBtnColor = isDark ? '#CCFF66' : '#B8E65C';

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      onBackdropPress={onClose}
    >
      <View style={[styles.modal, { backgroundColor: modalBg }]}>
        <Text style={[styles.text, { color: textColor }]}>
          회원 탈퇴 시, {'\n'}
          계정 정보는 복구가 불가능합니다.{'\n'}
          정말로 탈퇴하시겠어요?
        </Text>

        <View style={styles.row}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>계속 사용하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.okBtn, { backgroundColor: okBtnColor }]}
          >
            <Text style={styles.okText}>네 탈퇴할게요</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#454545',
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: 15,
    width: '80%',
    alignSelf: 'center',
  },
  text: {
    color: 'white',
    marginBottom: 20,
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
    backgroundColor: '#CCFF66',
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
});
