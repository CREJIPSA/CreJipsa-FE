const PLATFORM_LOGOS = {
  instagram: require('@/assets/images/platform_logo/instagram_logo.png'),
  youtube: require('@/assets/images/platform_logo/youtube_logo.png'),
  tiktok: require('@/assets/images/platform_logo/tiktok_logo.png'),
};

/**
 * 플랫폼 이름을 받아 대응하는 로고 이미지를 반환합니다.
 * @param { 'instagram' | 'youtube' | 'tiktok' } platform
 * @returns require() 형태의 이미지 소스
 */
export const getPlatformLogo = platform => {
  return PLATFORM_LOGOS[platform?.toLowerCase()] || null;
};

export default PLATFORM_LOGOS;
