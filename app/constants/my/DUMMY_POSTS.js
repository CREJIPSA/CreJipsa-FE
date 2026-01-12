const DUMMY_POSTS = [
  {
    id: '1',
    category: '일반',
    title: '같이 샤넬 챌린지 하실 분 구해요',
    content:
      '홍대입구역에서 15~18시쯤 모여서 촬영하실 분 구합니다! 제 채널 보시고 잘 어울릴 것 같은 분은 댓글 주세요!',
    author: {
      name: '혜안',
      handle: '@hxxax',
      profileImage: 'https://picsum.photos/200',
      isCreator: true,
    },
    timeAgo: '1시간 전',
    likeCount: 34,
    commentCount: 4,
    imageUrls: [],
    comments: [
      {
        id: 'c1',
        author: {
          name: '크리에이터',
          handle: '@creator',
          profileImage: 'https://picsum.photos/201',
          isCreator: true,
        },
        text: '저 하고 싶어요!',
        timeAgo: '1시간 전',
        replies: [
          {
            id: 'r1',
            author: {
              name: '혜안',
              handle: '@hxxax',
              profileImage: 'https://picsum.photos/200',
              isCreator: true,
            },
            text: '제 채널로 DM 주세요!',
            timeAgo: '1시간 전',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    category: '팁',
    title: '장소 꿀팁: 00입구역 근처 촬영 스팟 3곳',
    content:
      '자연광이 예쁘게 들어오는 00입구역 근처 촬영 스팟 3곳을 공유합니다. 가성비 좋은 공간 위주로 모았으니 확인해 보세요!',
    author: {
      name: '스팟마스터',
      handle: '@spot_m',
      profileImage: 'https://picsum.photos/203',
      isCreator: true,
    },
    timeAgo: '1시간 전',
    likeCount: 120,
    commentCount: 15,
    imageUrls: [
      'https://picsum.photos/400/300',
      'https://picsum.photos/400/301',
      'https://picsum.photos/400/302',
    ],
    comments: [],
  },
  {
    id: '3',
    category: '같이 촬영해요',
    title: '급! 야외 촬영 모델 구합니다 (내일)',
    content:
      '00시 공원에서 진행하는 000 컨셉의 야외 촬영 모델 구인합니다. 포트폴리오 목적으로 진행되며, 페이는 소정 지급합니다.',
    author: {
      name: '포토그래퍼',
      handle: '@photo_graph',
      profileImage: 'https://picsum.photos/204',
      isCreator: false,
    },
    timeAgo: '2시간 전',
    likeCount: 90,
    commentCount: 8,
    imageUrls: ['https://picsum.photos/400/303'],
    comments: [],
  },
  {
    id: '4',
    category: '일반',
    title: '강남 스튜디오 대여합니다 (오후)',
    content:
      '강남역 근처 인테리어 깔끔한 스튜디오 오후 시간대 저렴하게 대여해 드립니다.',
    author: {
      name: '스튜디오대여',
      handle: '@studio_rent',
      profileImage: 'https://picsum.photos/205',
      isCreator: false,
    },
    timeAgo: '3시간 전',
    likeCount: 205,
    commentCount: 22,
    imageUrls: [
      'https://picsum.photos/400/304',
      'https://picsum.photos/400/305',
      'https://picsum.photos/400/306',
      'https://picsum.photos/400/307',
      'https://picsum.photos/400/308',
    ],
    comments: [],
  },
  {
    id: '5',
    category: '팁',
    title: '편집 시간 단축 팁: 프리미어 프로 단축키 5가지',
    content:
      '영상 편집 시간을 획기적으로 줄여줄 프리미어 프로의 숨겨진 단축키 5가지를 공개합니다.',
    author: {
      name: '편집왕',
      handle: '@edit_king',
      profileImage: 'https://picsum.photos/206',
      isCreator: true,
    },
    timeAgo: '1일 전',
    likeCount: 301,
    commentCount: 55,
    imageUrls: [
      'https://picsum.photos/400/309',
      'https://picsum.photos/400/310',
    ],
    comments: [],
  },
  {
    id: '6',
    category: '같이 촬영해요',
    title: '주말 홍대입구역 댄스 영상 촬영 크루 모집',
    content:
      '주말에 홍대입구역 근처에서 댄스 커버 영상을 촬영할 크루를 모집합니다.',
    author: {
      name: '댄스홀릭',
      handle: '@dance_holic',
      profileImage: 'https://picsum.photos/207',
      isCreator: false,
    },
    timeAgo: '2일 전',
    likeCount: 88,
    commentCount: 11,
    imageUrls: [
      'https://picsum.photos/400/311',
      'https://picsum.photos/400/312',
      'https://picsum.photos/400/313',
      'https://picsum.photos/400/314',
    ],
    comments: [],
  },
];

export default DUMMY_POSTS;
