export enum Status {
  Active = 'Y',
  Inactive = 'N',
}

export const StatusOptions: Record<Status, string> = {
  [Status.Active]: 'Active',
  [Status.Inactive]: 'Inactive',
};

export const UserStatusOptions: Record<Status, string> = {
  [Status.Active]: 'Approved',
  [Status.Inactive]: 'Pending',
};
