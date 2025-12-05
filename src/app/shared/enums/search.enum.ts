export enum Status {
  Active = 'Y',
  Inactive = 'N'
}

export const StatusOptions: Record<Status, string> = {
  [Status.Active]: 'Active',
  [Status.Inactive]: 'Inactive'
}
