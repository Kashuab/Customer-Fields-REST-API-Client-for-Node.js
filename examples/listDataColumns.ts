import { DataColumn } from '../src';

export async function listDataColumns(formId?: string): Promise<DataColumn[]> {
  let columns: DataColumn[];

  if (formId) {
    columns = await DataColumn.find({ formId });
    console.log(`You have ${columns.length} data columns.`);
  } else {
    columns = await DataColumn.find({});
    console.log(`You have ${columns.length} data columns.`);
  }

  const column = columns[0];

  console.log(column);

  return columns;
}
