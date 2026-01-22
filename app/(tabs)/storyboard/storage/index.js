import { AuthContext } from '@/app/_layout';
import { authFetch } from '@/app/api/authFetch';
import DropdownInnerOption from '@/app/components/storyboard/dropdown-inner-option';
import useThemedStyle from '@/app/hooks/use-themed-style';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function StoryboardStorage() {
  const { styles } = useThemedStyle(getStyles);

  const { accessToken } = useContext(AuthContext);

  const [myStoryboardList, setMyStoryboardList] = useState([]);

  const fetchList = useCallback(async () => {
    if (!accessToken) return;

    try {
      const res = await authFetch('https://dev.crezipsa.site/api/storyboard', {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const raw = await res.text();
      console.log('my storyboard api status', res.status);
      console.log('my storyboard api raw response', raw);

      if (!res.ok) {
        console.error(
          `Fetch My Storyboard List API error: ${res.status} raw=${raw}`,
        );
        return;
      }

      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.error('Failed to parse JSON response', e);
        return;
      }
      const result = data?.result;

      if (!Array.isArray(result)) return;

      const nextList = result
        .filter(item => item?.createdAt)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      setMyStoryboardList(nextList);
    } catch (error) {
      console.error('Failed to fetch my storyboard list', error);
    }
  }, [accessToken]);

  useFocusEffect(
    useCallback(() => {
      fetchList();
    }, [fetchList]),
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 23, gap: 20 }}
      >
        {myStoryboardList.map(item => (
          <DropdownInnerOption
            key={item.storyboardId}
            label="storyboard"
            text={item.title}
            route={item.storyboardId}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const getStyles = (isDark, primaryColors) => ({
  mainContainer: {
    flex: 1,
    backgroundColor: primaryColors.background,
    paddingHorizontal: 16,
  },
});
