export interface IProjectDTO {
  id: string;
  title: string;
  description: string;
  variablesEnvironment: string;
  user_id: string;
  tag_id?: string;
  created_at: Date;
  updated_at: Date;
}
