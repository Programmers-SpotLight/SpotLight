# SpotLight
## 프로젝트 시작 가이드
### 패키지 설치
```bash
npm install
```

### .env 설정
```
NEXT_PUBLIC_BASE_URL=**<URL>**

## DB
DB_HOST=**<DB HOST>**
DB_PORT=**<DB PORT>**
DB_USER=**<DB USER>**
DB_PASS=**<DB PASS>**
DB_NAME=**<DB NAME>**

## AI
AI_SERVER_ADDR=**<URL>**
OPENAI_API_KEY=**<OPENAI_API_KEY>**

## GOOGLE
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=**<GOOGLE API KEY>**
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=**<GOOGLE MAP ID>**

## KAKAO
KAKAO_CLIENT_ID=**<KAKAO CLIENT ID>**
KAKAO_CLIENT_SECRET=**<KAKAO CLIENT SECRET>**

## EMAIL
NEXT_PUBLIC_EMAIL_SERVICE=**<EMAIL SERVICE NAME>** (ex : naver)
NEXT_PUBLIC_EMAIL_HOST=**<EMAIL SERVICE HOST>** 
NEXT_PUBLIC_EMAIL_PORT=**<EMAIL SERVICE PORT>** 
NEXT_PUBLIC_EMAIL_AUTH_USER=**<EMAIL>**
NEXT_PUBLIC_EMAIL_AUTH_PASS=**<EMAIL PASS>**
NEXT_PUBLIC_EMAIL_SENDER=**<SENDER EMAIL>** (ex : abcd@naver.com)
NEXT_PUBLIC_EMAIL_RECEIVER=**<RECEIVER EMAIL>**
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=**<NEXT PUBLIC RECAPTCHA SITE_KEY>**

## AWS
AWS_ACCESS_KEY_ID=**<AWS ACCESS KEY ID>**
AWS_SECRET_ACCESS_KEY=**<AWS SECRET ACCESS KEY>**
AWS_REGION=**<AWS REGION>**
S3_BUCKET_NAME=**<S3 BUCKET NAME>**
RECAPTCHA_SECRET_KEY=**<RECAPTCHA SECRET KEY>**

## AUTH
NEXTAUTH_URL=**<URL>**
NEXTAUTH_SECRET=**<NEXTAUTH SECRET>**

## Redis
REDIS_URL=**<REDIS URL>**
```

## 프로젝트 소개
Spotlight는 영화, 아이돌, 책 등 다양한 카테고리와 지역별 카테고리, 해시태그를 활용하여 Selection을 검색할 수 있습니다. 또한 셀렉션은 다양한 장소와 카테고리를 가진 Spot들을 가지고 있습니다.

## 기술 스택
<div style='display: flex;'>
  <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white"> 
  <img src="https://img.shields.io/badge/Next-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
  <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white">
</div>

## 팀원 소개
<table>
  <thead>
    <tr style="background-color:#f2f2f2;">
      <th style="padding:10px;">팀원</th>
      <th style="padding:10px;">맡은 기능 및 역할</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" style="padding:10px;">
        <a href="https://github.com/Eomjihee">
          <img src="https://avatars.githubusercontent.com/u/61967128?v=4" width="100px;" alt=""/><br />
          <b>엄지희</b>
        </a><br />
      </td>
      <td style="padding:10px;">
        - 전반적인 기획<br/>
        - UX/UI<br/>
        - DB 설계<br/>
        - 로그인/로그아웃<br/>
      </td>
    </tr>
    <tr style="background-color:#f9f9f9;">
      <td align="center" style="padding:10px;">
        <a href="https://github.com/jh0222">
          <img src="https://item.kakaocdn.net/do/47112f1ae6f87f4323cb73f65a8c5424f604e7b0e6900f9ac53a43965300eb9a" width="100px;" alt=""/><br />
          <b>서지현</b>
        </a><br />
      </td>
      <td style="padding:10px;">
        - 셀렉션 디테일 페이지<br/>
        &nbsp;&nbsp;&nbsp;- 리뷰<br/>
        - 마이페이지<br/>
        &nbsp;&nbsp;&nbsp;- 리뷰<br/>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:10px;">
        <a href="https://github.com/changchangwoo">
          <img src="https://avatars.githubusercontent.com/u/50562562?v=4" width="100px;" alt=""/><br />
          <b>이창우</b>
        </a><br />
      </td>
      <td style="padding:10px;">
        - 와이어프레임<br />
        - 검색 페이지<br />
        - 마이페이지<br />
        &nbsp;&nbsp;&nbsp;- 셀렉션<br/>
      </td>
    </tr>
    <tr style="background-color:#f9f9f9;">
      <td align="center" style="padding:10px;">
        <a href="https://github.com/7jw92nVd1kLaq1">
          <img src="https://avatars.githubusercontent.com/u/75822302?v=4" width="100px;" alt=""/><br />
          <b>위수종</b>
        </a><br />
      </td>
      <td style="padding:10px;">
        - 셀렉션 생성 및 수정<br />
        - 셀렉션 해시태그 추천 AI<br />
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:10px;">
        <a href="https://github.com/Wongilk">
          <img src="https://avatars.githubusercontent.com/u/108254103?s=96&v=4" width="100px;" alt=""/><br />
          <b>김원길</b>
        </a><br />
      </td>
      <td style="padding:10px;">
        - 셀렉션 디테일 페이지<br />
        - 지도 API<br />
      </td>
    </tr>
  </tbody>
</table>


## 화면 구성 및 서비스 기능
### 소셜 로그인
![Animation](https://github.com/user-attachments/assets/03812a0e-b60f-42d8-a802-46b6ec10a0a0)
- 구글 또는 카카오로 로그인 할 수 있습니다.
- 첫 로그인 시에는 사용자가 원하는 닉네임을 입력해야 합니다.

### 메인 화면

### 검색 화면

### 셀렉션 생성 화면

### 스팟 생성 모달

### 셀렉션 디테일 화면

#### 셀렉션 디테일 리뷰 화면

### 다른 사용자 정보 화면

### 마이페이지 화면

#### 마이 셀렉션 화면

#### 마이 리뷰 화면
