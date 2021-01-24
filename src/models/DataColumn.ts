import { Model, PaginatedResponse } from './Model';
import { dispatchRequest, PaginationOpts } from '../utils/dispatchRequest';
import { RequestInit, Response } from 'node-fetch';
import { URLSearchParams } from 'url';

export type ColumnDataType =
  | 'text'
  | 'date'
  | 'datetime'
  | 'integer'
  | 'float'
  | 'boolean'
  | 'email'
  | 'phone'
  | 'file'
  | 'group'
  | 'group_list'
  | 'list'
  | 'relative_date';

export type DataColumnDict = {
  id: string | null;
  key: string;
  label: string;
  expandedLabel: string;
  dataType: ColumnDataType;
  dedicated: boolean;
  readOnly: boolean;
  readonly createdAt: string | null;
  readonly updatedAt: string | null;
};

export type DataColumnFromServerDict = {
  id: string | null;
  key: string;
  label: string;
  expanded_label: string;
  data_type: ColumnDataType;
  dedicated: boolean;
  read_only: boolean;
  readonly created_at: string | null;
  readonly updated_at: string | null;
};

export class DataColumn extends Model implements DataColumnDict {
  static Errors = {};

  static find = findDataColumns;

  /**
   * **The CF REST API currently does not support this action. Calling this method will do nothing.**
   */
  static async findById(id: string): Promise<null> {
    return await null;
  }

  id: string | null = '';
  key = '';
  dataType: ColumnDataType = 'text';
  label = '';
  expandedLabel = '';
  dedicated = false;
  readOnly = false;
  readonly createdAt: string | null;
  readonly updatedAt: string | null;

  constructor(column: DataColumnDict) {
    super();

    this.id = column.id;
    this.key = column.key;
    this.dataType = column.dataType;
    this.label = column.label;
    this.createdAt = column.createdAt;
    this.updatedAt = column.updatedAt;
  }

  /**
   * **The CF REST API currently does not support this action. Calling this method will do nothing.**
   */
  async save(): Promise<DataColumn> {
    return await this;
  }
}

export type FindDataColumnsOpts = {
  formId?: string;
  ignoreReadOnly?: boolean;
};

async function findDataColumns(opts?: FindDataColumnsOpts): Promise<DataColumn[]> {
  const params = new URLSearchParams();

  if (opts?.formId) params.set('form_id', opts.formId);
  if (opts?.ignoreReadOnly) params.set('ignore_read_only', `${opts.ignoreReadOnly}`);

  const response = await dispatchRequest(`/data_columns?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to find data columns, receieved error code ${response.status}: ${response.statusText}`);
  }

  const dataColumns: DataColumnFromServerDict[] = (await response.json()).data_columns || [];
  const dataColumnInstances = dataColumns.map((dataColumn) => {
    return new DataColumn({
      id: dataColumn.id,
      key: dataColumn.key,
      dataType: dataColumn.data_type,
      label: dataColumn.label,
      expandedLabel: dataColumn.expanded_label,
      dedicated: dataColumn.dedicated,
      readOnly: dataColumn.read_only,
      createdAt: dataColumn.created_at,
      updatedAt: dataColumn.updated_at,
    });
  });

  return dataColumnInstances;
}
