/**
 * HTML 태그 및 엔티티를 제거하여 순수 텍스트만 추출하는 함수
 */
export const stripHtmlTags = str => {
  if (!str) return '';

  return str
    .replace(/<[^>]*>?/gm, '') // HTML 태그 제거
    .replace(/&nbsp;/g, ' ') // 공백 엔티티 변환
    .replace(/&[a-z0-9]+;/gi, '') // 기타 엔티티 제거
    .trim();
};
