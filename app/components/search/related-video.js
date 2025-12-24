import useThemedStyle from '@/app/hooks/use-themed-style';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Text, View } from 'react-native';

export default function RelatedVideo({ title, views, thumbnailUrl }) {
  const { styles } = useThemedStyle(getStyles);

  return (
    <ImageBackground source={thumbnailUrl} style={styles.thumbnail}>
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']}
        style={styles.thumbnailGradient}
      />
      <View style={styles.videoInfoContainer}>
        <Text style={styles.videoTitle} ellipsizeMode="tail" numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.videoViews}>조회수 {views}회</Text>
      </View>
    </ImageBackground>
  );
}

const getStyles = (isDark, primaryColor) => ({
  thumbnail: {
    width: 140,
    height: 245,
    borderRadius: 15,
    marginRight: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    resizeMode: 'cover',
  },
  thumbnailGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoInfoContainer: {
    paddingBottom: 15,
    paddingHorizontal: 17,
    gap: 2,
  },
  videoTitle: {
    fontSize: 14,
    color: '#F4F2F2',
  },
  videoViews: {
    fontSize: 12,
    color: '#F4F2F2',
    fontWeight: '200',
  },
});
