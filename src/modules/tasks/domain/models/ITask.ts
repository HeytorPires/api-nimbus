import { IUser } from "@modules/users/domain/models/IUser";

export interface ITask {
    id: string;
    title: string;
    description: string;
    variablesEnvironment: string;
    user: IUser
    updated_at: Date;
}
