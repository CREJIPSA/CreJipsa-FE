export const COMMUNITY_FIELDS = {
  ALL: '전체',
  RECOMMEND: '추천',
  TIP: '팁',
  COLLAB: '같이 촬영해요',
};

export const getWriteFieldOptions = () => {
  return Object.keys(COMMUNITY_FIELDS)
    .filter(key => key !== 'ALL')
    .map(key => COMMUNITY_FIELDS[key]);
};

export const getFieldKeyByLabel = label => {
  return Object.keys(COMMUNITY_FIELDS).find(
    key => COMMUNITY_FIELDS[key] === label,
  );
};

export const getCommunityFieldLabels = () => Object.values(COMMUNITY_FIELDS);
