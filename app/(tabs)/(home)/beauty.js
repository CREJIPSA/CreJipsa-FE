import { Text, View, useColorScheme } from 'react-native';

export default function Beauty() {

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  return (
    <View style={styles.mainContainer}>
      <Text style={{color: isDark ? '#fff' : '#000'}}>beauty</Text>
    </View>
  )
}

const getStyles = (isDark) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: isDark ? '#202020' : '#fff',
  },
});