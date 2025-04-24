import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import * as path from 'path';

import { UsersModule } from './modules/users/users.module';
import { UsersEntity } from './modules/users/entity/users.entity';
import { UserRecordsModule } from './modules/userRecords/userRecords.module';
import { UserRecordsEntity } from './modules/userRecords/entity/userRecords.entity';
import { UserWithdrawalLogsModule } from './modules/userWithdrawalLogs/userWithdrawalLogs.module';
import { UserWithdrawalLogsEntity } from './modules/userWithdrawalLogs/entity/userWithdrawalLogs.entity';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { DoctorWithdrawalLogsModule } from './modules/doctorWithdrawalLogs/doctorWithdrawalLogs.module';
import { DoctorsEntity } from './modules/doctors/entities/doctor.entity';
import { DoctorWithdrawalLogsEntity } from './modules/doctorWithdrawalLogs/entities/doctorWithdrawalLogs.entity';
import { ChatUserHistoriesModule } from './modules/chatUserHistories/chatUserHistories.module';
import { ChatUserHistoriesEntity } from './modules/chatUserHistories/entities/chatUserHistories.entity';
import { ChatBotHistoriesModule } from './modules/chatBotHistories/chatBotHistories.module';
import { ChatBotHistoriesEntity } from './modules/chatBotHistories/entities/chatBotHistories.entity';
import { AuthModule } from './modules/auth/auth.module';
import { ChatsModule } from './modules/chats/chats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(process.env.PWD, '.env'),
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_SYNCHRONIZE: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'mysql',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [
            UsersEntity,
            UserRecordsEntity,
            UserWithdrawalLogsEntity,
            DoctorsEntity,
            DoctorWithdrawalLogsEntity,
            ChatUserHistoriesEntity,
            ChatBotHistoriesEntity,
          ],
          synchronize: process.env.DB_SYNCHRONIZE === 'true',
          logging: true,
          timezone: 'Z',
          ssl:
            process.env.DB_DATABASE !== 'medly_local'
              ? {
                  ca: process.env.AZURE_DB_SSL,
                }
              : false,
        };
      },
    }),
    UsersModule,
    UserRecordsModule,
    UserWithdrawalLogsModule,
    DoctorsModule,
    DoctorWithdrawalLogsModule,
    ChatUserHistoriesModule,
    ChatBotHistoriesModule,
    AuthModule,
    ChatsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
