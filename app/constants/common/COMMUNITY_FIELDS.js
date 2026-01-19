export const COMMUNITY_FIELDS = {
  RECOMMEND: '추천',
  TIP: '팁',
  COLLAB: '같이 촬영해요',
};

export const getFieldKeyByLabel = label => {
  return Object.keys(COMMUNITY_FIELDS).find(
    key => COMMUNITY_FIELDS[key] === label,
  );
};

export const getCommunityFieldLabels = () => Object.values(COMMUNITY_FIELDS);
