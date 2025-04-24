import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserRecordsEntity } from 'src/modules/userRecords/entity/userRecords.entity';

export default class MoviesTranslationsSeeder implements Seeder {
  track = false;

  async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(UserRecordsEntity);
    await repository.insert([
      {
        nameOfSurgery: '척추 디스크 수술',
        surgeryRecord: '',
        scheduledAt: new Date('2024-03-20'),
        status: false,
        user: { idx: 1 },
      },
      {
        nameOfSurgery: '무릎 관절경 수술',
        surgeryRecord: '',
        scheduledAt: new Date('2024-03-21'),
        status: true,
        user: { idx: 2 },
      },
      {
        nameOfSurgery: '어깨 관절경 수술',
        surgeryRecord: '',
        scheduledAt: new Date('2024-03-22'),
        status: false,
        user: { idx: 3 },
      },
      {
        nameOfSurgery: '발목 인대 수술',
        surgeryRecord: '',
        scheduledAt: new Date('2024-03-23'),
        status: true,
        user: { idx: 4 },
      },
      {
        nameOfSurgery: '손목 터널 증후군 수술',
        surgeryRecord: '',
        scheduledAt: new Date('2024-03-24'),
        status: false,
        user: { idx: 5 },
      },
    ]);
  }
}
