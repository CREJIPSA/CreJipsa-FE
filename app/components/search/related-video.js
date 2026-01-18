import useThemedStyle from '@/app/hooks/use-themed-style';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';

const img_placeholder = require('@/assets/images/thumbnail/no-thumbnail.png');
function extractYoutubeVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') {
      return u.pathname.replace('/', '');
    }

    const v = u.searchParams.get('v');
    if (v) return v;

    if (u.pathname.startsWith('/shorts/')) {
      return u.pathname.split('/shorts/')[1]?.split('?')[0] ?? null;
    }

    return null;
  } catch {
    return null;
  }
}

async function getVideoThumbnail(url) {
  // 인스타그램 썸네일은 표시 불가
  if (url.includes('instagram.com')) {
    return img_placeholder;
  }

  // 유튜브
  if (url.includes('youtu.be') || url.includes('youtube.com')) {
    const id = extractYoutubeVideoId(url);
    if (!id) return img_placeholder;
    return { uri: `https://img.youtube.com/vi/${id}/hqdefault.jpg` };
  }

  // 틱톡
  if (url.includes('tiktok.com')) {
    const endpoint =
      'https://www.tiktok.com/oembed?url=' + encodeURIComponent(url);
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      return img_placeholder;
    }
    const data = await res.json();
    return data.thumbnail_url ? { uri: data.thumbnail_url } : img_placeholder;
  }
}

export default function RelatedVideo({ title, views, url }) {
  const { styles } = useThemedStyle(getStyles);

  // 인스타는 조회수 표시 안 함
  const insta = url => {
    return url.includes('instagram.com') ?? false;
  };

  const [thumbnail, setThumbnail] = useState(null);
  useEffect(() => {
    getVideoThumbnail(url)
      .then(setThumbnail)
      .catch(() => setThumbnail(img_placeholder));
  }, [url]);

  return (
    <Pressable
      onPress={() => {
        if (url) {
          Linking.openURL(url);
        }
      }}
    >
      <ImageBackground
        source={thumbnail ? thumbnail : img_placeholder}
        style={styles.thumbnail}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']}
          style={styles.thumbnailGradient}
        />
        <View style={styles.videoInfoContainer}>
          <Text
            style={styles.videoTitle}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text style={styles.videoViews}>
            {!insta(url) ? `조회수 ${views}회` : ''}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
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
