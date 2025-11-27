import { Text, View, useColorScheme } from 'react-native';


export default function Pet() {

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  return (
    <View style={styles.mainContainer}>
      <Text style={{color: isDark ? '#fff' : '#000'}}>pet</Text>
    </View>
  )
}

const getStyles = (isDark) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: isDark ? '#202020' : '#fff',
  },
});