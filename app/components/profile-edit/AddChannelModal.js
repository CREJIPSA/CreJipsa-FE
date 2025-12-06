// ChannelEditModal.js (새 파일)
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const ChannelEditModal = ({ visible, onClose, styles }) => {
  // 💡 [저장] 버튼 로직
  const handleSave = () => {
    // 1. 여기서 실제 채널 저장/업데이트 API 호출
    // 2. 저장 성공 후 모달 닫기
    onClose();
  };

  return (
    <Modal
      animationType="slide" // ⭐️ 아래에서 위로 올라오는 애니메이션
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>채널 플랫폼 선택</Text>

          {/* 여기에 유튜브, 인스타그램, 틱톡 선택 UI 구현 */}
          <View style={{ marginTop: 20 }}>
            <Text>채널 선택 및 ID 입력 UI</Text>
          </View>

          {/* ⭐️ 저장 버튼 (닫기 버튼) */}
          <Pressable
            style={[modalStyles.button, modalStyles.buttonSave]}
            onPress={handleSave} // 저장 후 닫기
          >
            <Text style={modalStyles.textStyle}>저장</Text>
          </Pressable>

          {/* 취소 버튼 (선택 사항) */}
          <Pressable
            style={[modalStyles.button, modalStyles.buttonClose]}
            onPress={onClose}
          >
            <Text style={modalStyles.textStyle}>취소</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

// 모달 전용 스타일 (예시)
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end', // ⭐️ 모달이 하단에 위치하도록 함
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: '100%',
  },
  buttonSave: {
    backgroundColor: '#A3CC52', // 포인트 색상
  },
  buttonClose: {
    backgroundColor: '#999',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ChannelEditModal;
