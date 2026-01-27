// GitHub Pages에 배포된 이미지 목록
// 새 이미지 추가: github.com에서 public/images 폴더에 파일 업로드 후 여기에 파일명 추가

export const AVAILABLE_IMAGES = [
  '53618095933_87aaf22e57_b.jpg',
  '53618095938_b261990a8f_b.jpg',
  '53618156348_73505003d3_b.jpg',
  '53618210828_888417f683_b.jpg',
  '53618395435_32f2431b97_b.jpg',
  '53662149094_451ac4f80f_b.jpg',
  '53786435527_17433df4d8_b.jpg',
  '53786435532_71a623a182_b.jpg',
  '53787388841_ac27535c43_b.jpg',
  '53879429516_f2c37d8997_b.jpg',
  '53879842125_e8e6af958c_b.jpg',
  '53911971263_457184d4c0_b.jpg',
  '53928174748_96dd496038_b.jpg',
  '53928308389_705ac179e1_b.jpg',
  '53935058229_c97521cb14_b.jpg',
  '53935571015_07ec914a87_b.jpg',
  '53937223321_2718ab9056_b.jpg',
  '53942097638_989f096918_b.jpg',
  '53964377422_4c0216b542_b.jpg',
  '53967565291_bce5a19f46_b.jpg',
  '53967766648_2cfd72e9cc_b.jpg',
  '53967969555_755b521cec_b.jpg',
  '53968820042_ec311e50ec_b.jpg',
];

// 이미지 URL 생성 (GitHub Pages base path 포함)
export const getImageUrl = (filename: string): string => {
  const basePath = import.meta.env.MODE === 'production' ? '/yeongjun-portfolio' : '';
  return `${basePath}/images/${filename}`;
};

// 전체 이미지 URL 목록
export const getAvailableImageUrls = (): string[] => {
  return AVAILABLE_IMAGES.map(getImageUrl);
};
