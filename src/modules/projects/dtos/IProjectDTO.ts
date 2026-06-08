export interface IProjectDTO {
  id: string;
  title: string;
  description: string;
  repository: string;
  variablesEnvironment: string;
  InitializationVector?: string;
  user_id: string;
  tag_id?: string;
  updated_at: Date;
}
