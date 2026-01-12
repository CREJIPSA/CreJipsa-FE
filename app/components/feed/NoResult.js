import useThemedStyle from '@/app/hooks/use-themed-style';
import { StyleSheet, Text, View } from 'react-native';

export default function NoResult({ searchText }) {
  const { styles } = useThemedStyle(getStyles);

  return (
    <View style={styles.container}>
      <View style={styles.textBox}>
        <Text style={styles.mainText}>
          <Text style={styles.pointText}>{`'${searchText}'`}</Text>에 대한
        </Text>
        <Text style={styles.mainText}>검색 결과가 존재하지 않습니다.</Text>
      </View>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#202020' : '#FCFCFC',
      alignItems: 'center',
    },

    textBox: {
      minWidth: 260,
      marginTop: 80,
    },

    pointText: {
      color: primaryColors.pointColor,
      fontWeight: '700',
      fontSize: 20,
    },

    mainText: {
      color: primaryColors.color,
      fontWeight: '500',
      fontSize: 20,
    },
  });
};
