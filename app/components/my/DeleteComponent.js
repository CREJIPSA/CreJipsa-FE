import useThemedStyle from '@/app/hooks/use-themed-style';
import ThreeDotsIcon from '@/assets/svgs/my/three-dots-icon';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function DeleteComponent({ isDark, onDelete }) {
  const { styles } = useThemedStyle(getStyles);
  const [visible, setVisible] = useState(false);

  const toggleMenu = () => setVisible(!visible);

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={toggleMenu} hitSlop={15} style={styles.iconButton}>
        <ThreeDotsIcon isDark={isDark} />
      </Pressable>

      {visible && (
        <Pressable
          style={styles.deleteButtonContainer}
          onPress={() => {
            onDelete();
            setVisible(false);
          }}
        >
          <Text style={styles.deleteText}>삭제</Text>
        </Pressable>
      )}
    </View>
  );
}

const getStyles = (isDark, primaryColors) => {
  return StyleSheet.create({
    wrapper: {
      position: 'relative',
      zIndex: 5000,
    },

    iconButton: {
      padding: 5,
    },

    deleteButtonContainer: {
      position: 'absolute',
      right: 0,
      top: 25,
      backgroundColor: isDark ? '#454545' : '#D9D9D9',
      borderRadius: 8,
      minWidth: 106,
      paddingTop: 4,
      paddingBottom: 6,
      paddingLeft: 12,
      paddingRight: 60,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },

    deleteText: {
      color: primaryColors.color,
      fontSize: 14,
      fontWeight: '500',
    },
  });
};
