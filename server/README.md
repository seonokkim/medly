<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## 설치방법

```bash
$ yarn install
```

## 앱 실행 방법

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## 앱 구조

```plaintext
medly-server
├── src
│   ├── app.module.ts
│   ├── main.ts
│   ├── users
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   └── entities
│   │       └── users.entity.ts
│   ├── withdrawal-logs
│   │   ├── withdrawal-logs.controller.ts
│   │   ├── withdrawal-logs.module.ts
│   │   ├── withdrawal-logs.service.ts
│   │   └── entities
│   │       └── withdrawal-logs.entity.ts
│   ├── user-logs
│   │   ├── user-logs.controller.ts
│   │   ├── user-logs.module.ts
│   │   ├── user-logs.service.ts
│   │   └── entities
│   │       └── user-logs.entity.ts
│   └── database
│       ├── data-source.ts
│       └── seeds
│           └── seed.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env
├── .eslintrc.js
├── .prettierrc
├── nest-cli.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```

## Api Document 스웨거 접속 방법

http://localhost:3000/api-docs

user: medly

password: P@assword

## 새 모듈 생성하는 법

```bash
$ nest g resource <엔티티명>
```

## 테스트 데이터 만드는 법

1. `src > database > data-source.ts` 파일에서 새로운 엔티티를 `entities: [UsersEntity, UserLogsEntity],`에 추가합니다.
2. `src > seeds` 폴더에 해당 엔티티에 해당되는 데이터를 추가합니다.
3. `yarn seed:reset` 명령어를 실행합니다.

## 조인 하는법

### 1:1 관계

#### Users 엔티티

```typescript
@OneToOne(() => WithdrawalLogsEntity, (withdrawalLog) => withdrawalLog.user)
withdrawalLog: WithdrawalLogsEntity;
```

#### WithdrawalLogs 엔티티

```typescript
@OneToOne(() => UsersEntity, (user) => user.withdrawalLog)
@JoinColumn()
user: UsersEntity;
```

### 1:N 관계

#### Users 엔티티

```typescript
@OneToMany(() => UserLogsEntity, (userLogs) => userLogs.user)
userLogs: UserLogsEntity[];
```

#### UserLogs 엔티티

```typescript
@ManyToOne(() => UsersEntity, (user) => user.userLogs)
user: UsersEntity;
```

## 의존성 주입 (Dependency Injection)

`users` 서비스에서 `withdrawalLogs` 서비스를 사용하는 경우, 다음 단계를 따릅니다:

1. **사용하려는 서비스(WithdrawalLogsService) export**

`WithdrawalLogsModule`에서 `WithdrawalLogsService`를 export 합니다.

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([WithdrawalLogsEntity])],
  controllers: [WithdrawalLogsController],
  providers: [WithdrawalLogsService],
  exports: [WithdrawalLogsService],
})
export class WithdrawalLogsModule {}
```

2. **export 한 모듈을 import에 추가**

`UsersModule`에서 `WithdrawalLogsModule`을 import 합니다.

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), WithdrawalLogsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

3. **users.service.ts constructor에 서비스 추가**

`UsersService`의 constructor에 `WithdrawalLogsService`를 추가합니다.

```typescript
constructor(
   @InjectRepository(UsersEntity)
   private usersRepo: Repository<UsersEntity>,
   private withdrawalLogsService: WithdrawalLogsService,
  ) {}
```

4. **해당 서비스 사용**

`UsersService`에서 `WithdrawalLogsService`의 메서드를 사용합니다.

```typescript
const withdrawalLog = await this.withdrawalLogsService.addWithdrawalLogs(
  idx,
  reason,
);
```

## /.env 파일 예시

```plaintext
DB_DATABASE=medly_local
DB_HOST=localhost
DB_SYNCHRONIZE=true
DB_USERNAME=
DB_PASSWORD=
DB_PORT=3306
SERVER_PORT=3000
AZURE_DB_SSL=
LETS_ENCRYPT_PRIVKEY_PATH=
LETS_ENCRYPT_FULLCHAIN_PATH=
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
