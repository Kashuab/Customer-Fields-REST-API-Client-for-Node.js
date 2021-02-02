import { rest } from 'msw';
import { URLSearchParams } from 'url';
import { DataColumnFromServerDict } from '../../models/DataColumn';
import { generateDataColumn } from './data/generateDataColumn';
import { getMockErrorResponse } from './Server';

export const dataColumns: DataColumnFromServerDict[] = [];

for (let i = 0; i < 100; i++) {
  dataColumns.push(generateDataColumn());
}

export default [
  rest.get('http://localhost/api/v2/data_columns', (req, res, ctx) => {
    const err = getMockErrorResponse(res, ctx);
    if (err) return err;

    const params: URLSearchParams = req.url.searchParams;

    const ignoreReadOnly = params.get('ignore_read_only') == 'true';
    const formId = params.get('form_id');

    let columnsToRespondWith = dataColumns;

    if (ignoreReadOnly) columnsToRespondWith = columnsToRespondWith.filter((column) => !column.read_only);
    if (formId) {
      columnsToRespondWith = columnsToRespondWith.filter((column) => !!column._$form_ids?.includes(formId));
    }

    return res(ctx.json({ data_columns: columnsToRespondWith }));
  }),
];
