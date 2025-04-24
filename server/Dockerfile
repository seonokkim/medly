# Node.js 이미지를 기반으로 빌드
FROM node:20 AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 yarn.lock 파일을 복사
COPY package.json yarn.lock ./

# 의존성 설치
RUN yarn install

# 애플리케이션 소스 코드 복사
COPY . .

# 빌드 (NestJS 앱 빌드)
RUN yarn build

# 실제 실행을 위한 image 설정
FROM node:20 AS production

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치 (production 모드)
COPY --from=build /app/package.json /app/yarn.lock ./
RUN yarn install --production

# 빌드된 파일 복사
COPY --from=build /app/dist ./dist

# 환경 변수 파일 복사
COPY .env .env

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["yarn", "start:prod"]
