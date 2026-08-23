export interface ICreateProject {
  title: string;
  description: string;
  variablesEnvironment: string;
  initializationVector?: string;
  userId: string;
  tagId?: string;
}
