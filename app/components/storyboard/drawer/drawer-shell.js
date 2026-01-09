import useThemedStyle from '@/app/hooks/use-themed-style';
import { View } from 'react-native';
import Modal from 'react-native-modal';

export default function DrawerShell({ visible, onClose, children }) {
  const { styles } = useThemedStyle(getStyles);

  return (
    <Modal
      isVisible={visible}
      useNativeDriver
      hideModalContentWhileAnimating
      animationIn="slideInRight"
      animationOut="slideOutRight"
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection="right"
      onSwipeComplete={onClose}
      backdropOpacity={0.3}
      style={{ margin: 0 }}
    >
      <View style={styles.drawerContainer}>{children}</View>
    </Modal>
  );
}

const getStyles = isDark => ({
  drawerContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: Math.min(
      360,
      0.9 * require('react-native').Dimensions.get('window').width,
    ),
    backgroundColor: isDark ? '#323232' : '#FFFFFF',
  },
});
