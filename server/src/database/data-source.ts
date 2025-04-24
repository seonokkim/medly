import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';

import { UsersEntity } from '../modules/users/entity/users.entity';
import { UserRecordsEntity } from '../modules/userRecords/entity/userRecords.entity';
import { UserWithdrawalLogsEntity } from '../modules/userWithdrawalLogs/entity/userWithdrawalLogs.entity';
import { DoctorsEntity } from 'src/modules/doctors/entities/doctor.entity';
import { DoctorWithdrawalLogsEntity } from 'src/modules/doctorWithdrawalLogs/entities/doctorWithdrawalLogs.entity';
import { ChatUserHistoriesEntity } from 'src/modules/chatUserHistories/entities/chatUserHistories.entity';
import { ChatBotHistoriesEntity } from 'src/modules/chatBotHistories/entities/chatBotHistories.entity';

dotenv.config({
  path: '.env',
});

if (process.env.DB_DATABASE !== 'medly_local') {
  console.error('❌ Seeding is not allowed in production environment');
  process.exit(1);
}

const options: DataSourceOptions & SeederOptions = {
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
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  seedTracking: false,
  factories: ['src/database/factories/**/*{.ts,.js}'],
  ssl:
    process.env.DB_DATABASE !== 'medly_local'
      ? {
          ca: process.env.AZURE_DB_SSL,
        }
      : false,
};

export const dataSource = new DataSource(options);
