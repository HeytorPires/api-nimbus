export interface IProjectDTO {
  id: string;
  title: string;
  description: string;
  variablesEnvironment: string;
  userId: string;
  tagId?: string;
  createdAt: Date;
  updatedAt: Date;
}
