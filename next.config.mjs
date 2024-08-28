/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "thumb.mt.co.kr",
      "img.newspim.com",
      "file.mk.co.kr",
      "media.timeout.com",
      "i.namu.wiki",
      "jeeh-1006.s3.ap-northeast-2.amazonaws.com",
      "places.googleapis.com"
    ], // 이미지 임시로 외부에서 데이터를 받아오기 위해 도메인을 추가했습니다. api 적용하면서 제거하겠습니다
  },
  experimental: {
    serverComponentsExternalPackages: ["knex", "bullmq"],
    instrumentationHook: true
  }
};

export default nextConfig;
