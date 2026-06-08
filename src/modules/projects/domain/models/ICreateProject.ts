export interface ICreateProject {
  title: string;
  description: string;
  variablesEnvironment: string;
  InitializationVector?: string;
  user_id: string;
  tag_id?: string;
}

