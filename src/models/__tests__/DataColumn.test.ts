import faker from 'faker';
import { DataColumn } from '../..';
import { generateRandomString } from '../../__tests__/server/data/generateCustomer';
import { randomFromArray } from './utils';
import { ColumnDataType } from '../DataColumn';

describe('DataColumn', () => {
  test('can initialize', () => {
    const dataColumn = new DataColumn({
      id: generateRandomString(),
      key: faker.random.word(),
      label: faker.random.word(),
      expandedLabel: faker.random.word(),
      dataType: generateRandomDataType(),
      dedicated: faker.random.boolean(),
      readOnly: faker.random.boolean(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    });

    assertDataColumnInitialization(dataColumn);
  });

  test('can fetch data columns', async () => {
    const dataColumns = await DataColumn.find({});
    const dataColumn = dataColumns[0];

    expect(dataColumn).toBeDefined();
    assertDataColumnInitialization(dataColumn);
  });

  test('gracefully handles lack of findById action', async () => {
    expect(await DataColumn.findById()).toBe(null);
  });

  test('gracefully handles lack of save action', async () => {
    const dataColumn = new DataColumn({
      id: generateRandomString(),
      key: faker.random.word(),
      label: faker.random.word(),
      expandedLabel: faker.random.word(),
      dataType: generateRandomDataType(),
      dedicated: faker.random.boolean(),
      readOnly: faker.random.boolean(),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    });

    expect(await dataColumn.save()).toBe(dataColumn);
  });
});

export const assertDataColumnInitialization = (dataColumn: DataColumn): void => {
  expect(typeof dataColumn.id).toBe('string');
  expect(typeof dataColumn.key).toBe('string');
  expect(typeof dataColumn.label).toBe('string');
  expect(typeof dataColumn.expandedLabel).toBe('string');
  expect(typeof dataColumn.dataType).toBe('string');
  expect(typeof dataColumn.dedicated).toBe('boolean');
  expect(typeof dataColumn.readOnly).toBe('boolean');
  expect(typeof dataColumn.createdAt).toBe('string');
  expect(typeof dataColumn.updatedAt).toBe('string');
};

export const generateRandomDataType = (): ColumnDataType =>
  randomFromArray<ColumnDataType>([
    'text',
    'date',
    'datetime',
    'integer',
    'float',
    'boolean',
    'email',
    'phone',
    'file',
    'group',
    'group_list',
    'list',
    'relative_date',
  ]);
