
export interface ITaskDTO {
  id: string;
  title: string;
  description: string;
  repository: string;
  variablesEnvironment: string;
  userId: string;
  tagId?: string;
  updated_at: Date;
}
