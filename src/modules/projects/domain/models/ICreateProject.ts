export interface ICreateProject {
  title: string;
  description: string;
  variablesEnvironment: string;
  InitializationVector?: string;
  userId: string;
  tagId?: string;
}
