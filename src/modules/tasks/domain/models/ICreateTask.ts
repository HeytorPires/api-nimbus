import { IUser } from "@modules/users/domain/models/IUser";

export interface ICreateTask {
    title: string;
    description: string;
    variablesEnvironment: string;
    userId: string
}
