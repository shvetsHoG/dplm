export class AccessControlUsers {
  public id?: number;
  public name: string;
  public email: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: AccessControlUsersResp) {
    Object.assign<AccessControlUsers, AccessControlUsersResp>(this, data);

    this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
  }
}

export interface AccessControlUsersResp {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const AccessControlUsersDtoFn = (data: any) => {
  return new AccessControlUsers({
    id: data.id,
    name: data.name,
    email: data.email,
    updatedAt: data.updated_at,
    createdAt: data.created_at
  });
};
