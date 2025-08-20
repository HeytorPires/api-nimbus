import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ITask } from '@modules/tasks/domain/models/ITask';
import User from '@modules/users/infra/typeorm/entities/User';
@Entity('tasks')
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

  @Column({ name: 'InitializationVector', nullable: true })
  InitializationVector: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.tasks)
  @JoinColumn({ name: 'userId' }) // nome da coluna FK
  user: User;

}

export default Task;
