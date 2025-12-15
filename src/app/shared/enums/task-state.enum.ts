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
  [State.ReadyForDevelopment]: 'Ready For Development',
  [State.InProgress]: 'In Progress',
  [State.Testing]: 'Testing',
  [State.Deployed]: 'Deployed',
  [State.Closed]: 'Closed',
};

export const TaskStateColorOptions: Record<State, string> = {
  [State.New]: '#B3B3B3',
  [State.Refinement]: '#9B59B6',
  [State.ReadyForDevelopment]: '#00A3A3',
  [State.InProgress]: '#0078D4',
  [State.Testing]: '#FFB900',
  [State.Deployed]: '#0E8A16',
  [State.Closed]: '#107C10',
};
