import faker from 'faker';
import { DataColumnFromServerDict } from '../../../models/DataColumn';
import { generateRandomDataType } from '../../../models/__tests__/DataColumn.test';
import { randomFromArray } from '../../../models/__tests__/utils';
import { generateRandomString } from './generateCustomer';

export const formIds = [
  'asd7h3',
  'a8923k',
  'djf90d',
  'jf9023',
  'dfj90a',
  'f93jdc',
  'fh9832',
  'jf82kd',
  'vn029kf',
  'io940ld',
];

export function generateDataColumn(): DataColumnFromServerDict {
  return {
    id: generateRandomString(),
    key: faker.random.word(),
    label: faker.random.word(),
    expanded_label: faker.random.word(),
    data_type: generateRandomDataType(),
    dedicated: faker.random.boolean(),
    read_only: faker.random.boolean(),
    _$form_ids: faker.random.boolean() ? [randomFromArray(formIds)] : [],
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
  };
}
