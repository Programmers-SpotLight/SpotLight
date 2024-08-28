<img src="https://github.com/user-attachments/assets/821dae4c-fa28-49aa-a5db-8e5b9c96adcf" style="width: 100px; height:100px; border-radius: 8px;" />

# SpotLight
## 📄 프로젝트 시작 가이드
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

## ✨ 프로젝트 소개
Spotlight는 영화, 아이돌, 책 등 다양한 카테고리와 지역별 카테고리, 해시태그를 활용하여 Selection을 검색할 수 있습니다. 또한 셀렉션은 다양한 장소와 카테고리를 가진 Spot들을 가지고 있습니다.

## 📚 기술 스택
<div style='display: flex;'>
  <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white"> 
  <img src="https://img.shields.io/badge/Next-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
  <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white">
</div>

## 👥 팀원 소개
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


## 🖥️ 화면 구성 및 서비스 기능
### 소셜 로그인
![Animation](https://github.com/user-attachments/assets/03812a0e-b60f-42d8-a802-46b6ec10a0a0)
- 구글 또는 카카오로 로그인 할 수 있습니다.
- 첫 로그인 시에는 사용자가 원하는 닉네임을 입력해야 합니다.

### 메인 화면
![Animation](https://github.com/user-attachments/assets/c415f361-4f73-4e3c-b067-a44964e9e68b)
- 메인 화면에서는 서비스가 추천하는 셀렉션, 최근 인기 많은 셀렉션, AI 기술을 활용한 사용자 맞춤 추천 셀렉션들을 볼 수 있습니다.
- 맨 아래 푸터에서는 서비스 노션, 깃허브 주소가 있고 문의 할 수 있는 버튼이 있습니다.
- 문의하기는 사용자가 문의하고 싶은 내용을 등록하면 저희 서비스 메일로 해당 내용이 전달됩니다.

### 검색 화면
![검색](https://github.com/user-attachments/assets/fbba3e30-f990-4d57-a054-eb508c55fbe9)
- 상단에서 해시태그 검색이 가능합니다.
- 검색시 관련 해시태그를 볼 수 있어 사용자의 검색을 돕습니다.
- 검색화면에서는 카테고리, 지역, 해시태그를 통해 검색할 수 있습니다.
- 또한 최신순, 오름차순, 인기순(북마크 기준)으로 정렬이 가능합니다.
- 마음에 드는 셀렉션은 북마크가 가능합니다.

### 셀렉션 생성 화면
- 셀렉션 제목, 설명을 입력하고 셀렉션 카테고리(영화, 아이돌, 도서, 애니메이션, 기타)를 선택합니다.
- 지역은 국내, 해외로 구분되어 있고 국내는 시도별, 해외는 대륙별로 나뉘어 있습니다.
- 셀렉션 썸네일은 셀렉션 카드에 보이는 이미지를 말합니다.
- 태그 등록에서는 셀렉션 생성을 하면서 사용자가 적은 값들을 토대로 AI 추천을 받을 수 있습니다.
  - 또한 사용자가 여기서 입력한 태그를 통해 셀렉션 검색이 가능합니다.
  - 태그 등록은 최대 8개까지 가능합니다.
- 셀렉션은 임시저장이 가능하고 임시저장된 셀렉션은 마이페이지에서 확인 가능합니다.
- 제출을 클릭하면 셀렉션이 등록됩니다.

### 스팟 생성 모달
- 주소는 지도에서 직접 마커를 클릭하여 받거나, 검색으로 받을 수 있습니다.
- 스팟의 이름과 상세설명을 입력할 수 있습니다.
- 스팟 카테고리(관광지, 기타, 맛집, 쇼핑, 카페)를 선택합니다.
- 스팟과 관련된 이미지 등록도 가능합니다.
- 스팟에서도 태그는 8개까지 등록 가능합니다.
  
### 셀렉션 디테일 화면
- 셀렉션 디테일에서는 셀렉션 정보와 스팟 정보를 확인 할 수 있습니다.
- 셀렉션은 공유 및 북마크가 가능합니다.
- 셀렉션 스팟 리스트를 클릭시 해당 주소로 지도가 나타납니다.

#### 셀렉션 디테일 리뷰 화면
- 셀렉션 리뷰는 셀렉션 리뷰수, 평점등을 확인 할 수 있습니다.
- 셀렉션 리뷰를 등록할 때는 별점, 내용, 이미지를 등록 할 수 있습니다.
- 리뷰 수정/삭제는 자신이 등록한 리뷰만 가능합니다.
- 리뷰별 좋아요가 가능합니다.
- 리뷰는 인기순/최신순 별 정령이 가능합니다.
- 셀렉션의 스팟 별로 리뷰 조회/등록/수정/삭제도 가능합니다.

### 다른 사용자 정보 화면
- 다른 사용자의 자기소개, 작성한 셀렉션, 북마크 셀렉션을 볼 수 있습니다.

### 마이페이지 화면
- 마이페이에서는 자기소개 관심있는 해시태그를 수정할 수 있고 자신이 작성한 셀렉션, 북막크 셀렉션, 셀렉션/스팟 리뷰 수를 확인할 수 있습니다.
- 셀렉션 관리 탭에서는 작성한 셀렉션, 북마크 셀렉션, 임시저장 셀렉션을 확인할 수 있습니다.
  - 셀렉션은 수정하거나 삭제할 수 있고 자신이 등록한 셀렉션의 공개/비공개를 설정 할 수 있습니다.
- 리뷰 관리 탭에서는 셀렉션 리뷰/ 스팟 리뷰 별 수정 삭제가 가능합니다.
