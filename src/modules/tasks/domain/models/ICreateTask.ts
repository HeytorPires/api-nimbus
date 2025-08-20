
export interface ICreateTask {
  title: string;
  description: string;
  variablesEnvironment: string
  InitializationVector?: string
  userId: string
}
