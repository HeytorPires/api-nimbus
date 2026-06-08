export interface IUpdateProject {
  id: string;
  title: string;
  description: string;
  variablesEnvironment: string;
  user_id: string;
  tag_id?: string;
}
