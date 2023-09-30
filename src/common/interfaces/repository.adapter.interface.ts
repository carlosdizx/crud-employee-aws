export default interface RepositoryAdapterInterface {
  createItem(tableName: string, data: any): Promise<any>;
  getItemById(tableName: string, key: any): Promise<any | null>;
  getItemsByKey(params: any): Promise<any[]>;
  updateItemById(tableName: string, id: any, updateData: any): Promise<void>;
  deleteItemById(tableName: string, id: any): Promise<void>;
}
