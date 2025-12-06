import BeautyIcon from '@/assets/svgs/field_icon/beauty_icon.js';
import DailyIcon from '@/assets/svgs/field_icon/daily_icon.js';
import FashionIcon from '@/assets/svgs/field_icon/fashion_icon.js';
import GameIcon from '@/assets/svgs/field_icon/game_icon.js';
import MusicIcon from '@/assets/svgs/field_icon/music_icon.js';
import PetIcon from '@/assets/svgs/field_icon/pet_icon.js';
import SportsIcon from '@/assets/svgs/field_icon/sports_icon.js';
import { StyleSheet, Text, View } from 'react-native';
import useThemedStyle from '../hooks/use-themed-style';

const ICON_MAP = {
  '일상/밈': DailyIcon,
  뷰티: BeautyIcon,
  패션: FashionIcon,
  게임: GameIcon,
  음악: MusicIcon,
  반려동물: PetIcon,
  스포츠: SportsIcon,
};

const TrendKeywordCard = ({ tag, title, showTag }) => {
  const { isDark, styles } = useThemedStyle(getStyles);
  const Icon = ICON_MAP[tag];

  return (
    <View style={styles.trendKeywordCard}>
      {/* 아이콘 */}
      {Icon && (
        <Icon size={showTag ? 30 : 20} color={isDark ? '#5B5AFF' : '#5686FF'} />
      )}
      <View style={styles.trendKeywordContents}>
        {/* 키워드 */}
        <Text style={styles.trendKeywordTitleText}>{title}</Text>
        {/* 태그 */}
        {showTag && (
          <View style={styles.trendKeywordTag}>
            <Text style={styles.trendKeywordTagText}>#{tag}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
export default TrendKeywordCard;

const getStyles = isDark => {
  return StyleSheet.create({
    trendKeywordCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FAFAFA',
      borderRadius: 10,
      padding: 10,
      marginRight: 8,
      gap: 13,
      borderWidth: 1,
      borderColor: isDark ? '#141414' : '#D6D6D6',
    },
    trendKeywordContents: {
      alignItems: 'flex-start',
    },
    trendKeywordTitleText: {
      fontSize: 14,
      color: '#141414',
    },
    trendKeywordTag: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginTop: 8,
      backgroundColor: '#202020',
      borderRadius: 20,
    },
    trendKeywordTagText: {
      fontSize: 10,
      color: '#FAFAFA',
    },
  });
};
