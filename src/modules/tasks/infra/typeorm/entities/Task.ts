import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ITask } from '@modules/tasks/domain/models/ITask';
import User from '@modules/users/infra/typeorm/entities/User';
@Entity('users')
class Task implements ITask {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    variablesEnvironment: string;

    @Column()
    repository: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, user => user.tasks)
    user: User;

}

export default Task;
