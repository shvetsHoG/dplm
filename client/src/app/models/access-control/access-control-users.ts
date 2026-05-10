export class AccessControlUsers {
  public id?: number;
  public name: string;
  public email: string;
  public roleIds: number[];
  public roleCount?: number;
  public groupIds: string[];
  public username?: string;
  public extension?: string;
  public queues?: AccessControlUserQueue[];
  public callGroup?: string;
  public company?: string;
  public rolesNames?: string[];
  public roles?: AccessControlUserRole[];

  constructor(data: AccessControlUsersResp) {
    Object.assign<AccessControlUsers, AccessControlUsersResp>(this, data);
    this.roleCount = data.roleIds.length;
  }
}

export interface AccessControlUsersResp {
  id: number;
  name: string;
  email: string;
  roleIds?: number[];
  groupIds?: string[];
  username?: string;
  extension?: string;
  queues?: AccessControlUserQueue[];
  callGroup?: string;
  company?: string;
  rolesNames?: string[];
  roles?: AccessControlUserRole[];
}

export const AccessControlUsersDtoFn = (data: any) => {
  return new AccessControlUsers({
    id: data.id,
    name: data.name,
    email: data.email,
    roleIds: data.role_ids ? data.role_ids : [],
    groupIds: data.group_ids ? data.group_ids : [],
    username: data.username,
    extension: data.extension,
    queues: data.queues ? data.queues.map((_) => AccessControlUserQueueDtoFn(_)) : [],
    callGroup: data.callgroup,
    company: data.company,
    rolesNames: data.roles_names ?? [],
    roles: data.roles ? data.roles.map((_) => AccessControlUserRoleDtoFn(_)) : []
  });
};

export interface AccessControlUserQueueResp {
  queue: string;
  priority: string;
  type: string;
  groupPolicy: string;
}

export class AccessControlUserQueue {
  public queue: string;
  public priority: string;
  public type: string;
  public groupPolicy: string;

  constructor(data: AccessControlUserQueueResp) {
    Object.assign(this, data);
  }
}

export const AccessControlUserQueueDtoFn = (data: any) => {
  return new AccessControlUserQueue({
    queue: data.queue,
    priority: data.priority,
    type: data.type,
    groupPolicy: data.grouppolicy
  });
};

export interface AccessControlUserRoleResp {
  id: number;
  name: string;
  description: string;
  isAdmin: boolean;
}

export class AccessControlUserRole {
  public id: number;
  public name: string;
  public description: string;
  public isAdmin: boolean;

  constructor(data: AccessControlUserRoleResp) {
    Object.assign(this, data);
  }
}

export const AccessControlUserRoleDtoFn = (data: any) => {
  return new AccessControlUserRole({
    id: data.id,
    name: data.name,
    description: data.description,
    isAdmin: data.is_admin
  });
};

export interface AccessControlQueueResp {
  queue: string;
  name: string;
  extension: string;
  allowTransfer: boolean;
  status: AccessControlQueueStatuses;
}

export class AccessControlQueue {
  public queue: string;
  public name: string;
  public extension: string;
  public allowTransfer: boolean;
  public status: AccessControlQueueStatuses;

  constructor(data: AccessControlQueueResp) {
    Object.assign(this, data);
  }
}

export const AccessControlQueueDtoFn = (data: any) => {
  return new AccessControlQueue({
    queue: data.queue,
    name: data.name,
    extension: data.extension,
    allowTransfer: data.allow_transfer,
    status: data.status
  });
};

export enum AccessControlQueueStatuses {
  ONLINE = "Online",
  OFFLINE = "Offline"
}
