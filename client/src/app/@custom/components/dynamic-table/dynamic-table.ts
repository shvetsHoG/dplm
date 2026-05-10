export interface DynamicTableCell<T = any> {
  columnId: number | string;
  color?: string;
  text?: string | Record<string, string | number>;
  additionalData?: T;
}

export interface DynamicTableRow<T = any> {
  label: string;
  data: DynamicTableCell[];
  additionalData?: T;
}
