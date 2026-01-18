import { AuthContext } from '@/app/_layout';
import DropdownInnerOption from '@/app/components/storyboard/dropdown-inner-option';
import useThemedStyle from '@/app/hooks/use-themed-style';
import { useContext, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function StoryboardStorage() {
  const { styles } = useThemedStyle(getStyles);

  const { accessToken } = useContext(AuthContext);

  const [myStoryboardList, setMyStoryboardList] = useState([]);

  useEffect(() => {
    fetch('https://dev.crezipsa.site/api/storyboard', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(async res => {
        const raw = await res.text();
        console.log('my storyboard api status', res.status);
        console.log('my storyboard api raw response', raw);

        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (e) {
          console.error('Failed to parse JSON response', e);
        }

        if (!res.ok) throw new Error(`My Storyboard API error: ${res.status}`);
        return data;
      })
      .then(data => {
        const result = data?.result;
        if (!result || !Array.isArray(result)) {
          console.error('Invalid my storyboard data format', data);
          return;
        }
        const nextList = result
          .filter(item => item?.createdAt)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        setMyStoryboardList(nextList);
      })
      .catch(error => {
        console.error('Failed to fetch my storyboard data', error);
      });
  }, [accessToken]);

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 23, gap: 20 }}
      >
        {myStoryboardList.map(item => (
          <DropdownInnerOption
            key={item.id}
            label="storyboard"
            text={item.text}
            route={item.route}
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
