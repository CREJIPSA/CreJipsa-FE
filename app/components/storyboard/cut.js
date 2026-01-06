import useThemedStyle from '@/app/hooks/use-themed-style';
import { Text, TextInput, View } from 'react-native';

// 컷 컴포넌트
const Cut = ({ cutNum, cut, onChangeField }) => {
  const { styles } = useThemedStyle(getStyles);

  return (
    <View style={styles.cutContainer}>
      <View style={styles.numberBox}>
        <Text style={styles.numberText}>{cutNum}</Text>
      </View>
      <View style={styles.contentsContainer}>
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>컷 구성</Text>
          <TextInput
            style={styles.contentInput}
            value={cut.description}
            onChangeText={text => onChangeField('description', text)}
          />
        </View>
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>대본</Text>
          <TextInput
            style={styles.contentInput}
            value={cut.script}
            onChangeText={text => onChangeField('script', text)}
          />
        </View>
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>자막</Text>
          <TextInput
            style={styles.contentInput}
            value={cut.subtitle}
            onChangeText={text => onChangeField('subtitle', text)}
          />
        </View>
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>기타</Text>
          <TextInput
            style={styles.contentInput}
            value={cut.etc}
            onChangeText={text => onChangeField('etc', text)}
          />
        </View>
      </View>
    </View>
  );
};

export default Cut;

const getStyles = (isDark, primaryColors) => ({
  cutContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  numberBox: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#E3FFAB' : '#C6E945',
    borderRadius: 4,
  },
  numberText: {
    fontSize: 16,
    color: '#000000',
  },
  contentsContainer: {
    flex: 1,
    gap: 16,
  },
  contentBox: {
    gap: 8,
  },
  contentText: {
    color: primaryColors.color,
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentInput: {
    borderRadius: 8,
    backgroundColor: isDark ? '#454545' : '#E6E6E6',
    color: primaryColors.color,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
});
