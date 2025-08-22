export interface IProjectDTO {
  id: string;
  title: string;
  description: string;
  repository: string;
  variablesEnvironment: string;
  InitializationVector?: string;
  userId: string;
  tagId?: string;
  updated_at: Date;
}
