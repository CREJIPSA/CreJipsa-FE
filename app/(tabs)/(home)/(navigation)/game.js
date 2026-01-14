import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { AuthContext } from '../../../_layout';
import RealTimeTrend from '../../../components/realtime-trend';
import useThemedStyle from '../../../hooks/use-themed-style';

export default function Game({ platform }) {
  const { styles } = useThemedStyle(getStyles);

  const { accessToken } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [rankTrends, setRankTrends] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    const url = `https://dev.crezipsa.site/api/main/trend?platform=${platform}&category=게임`;
    // 플랫폼과 카테고리에 따른 실시간 트렌드 데이터 가져오기
    fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async res => {
        const raw = await res.text();
        console.log('trend api status', res.status);
        console.log('trend api raw response', raw);

        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.error('Failed to parse JSON response', e);
        }

        if (!res.ok) throw new Error(`Trend API error: ${res.status}`);
        return data;
      })
      .then(data => {
        const result = data?.result;
        if (!result || !Array.isArray(result)) {
          console.error('Invalid trend data format', data);
          return;
        }
        const top4 = result
          .slice(0, 4)
          .map(({ id, keyword }) => ({ id, keyword }));
        setRankTrends(top4);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch trend data', error);
        setIsLoading(false);
      });
  }, [platform, accessToken]);

  return (
    <View style={styles.mainContainer}>
      {!isLoading && <RealTimeTrend rankTrends={rankTrends} />}
    </View>
  );
}

const getStyles = isDark => ({
  mainContainer: {
    flex: 1,
    backgroundColor: isDark ? '#202020' : '#FAFAFA',
  },
});
