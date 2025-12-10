export enum State {
  New = 0,
  Refinement = 1,
  ReadyForDevelopment = 2,
  InProgress = 3,
  Testing = 4,
  Deployed = 5,
  Closed = 6,
}

export const TaskStateOptions: Record<State, string> = {
  [State.New]: 'New',
  [State.Refinement]: 'Refinement',
  [State.ReadyForDevelopment]: 'ReadyForDevelopment',
  [State.InProgress]: 'InProgress',
  [State.Testing]: 'Testing',
  [State.Deployed]: 'Deployed',
  [State.Closed]: 'Closed',
};
