import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import { ITag } from '@modules/tags/domain/models/ITag';
import Task from '@modules/tasks/infra/typeorm/entities/Task';
@Entity('tags')
class Tag implements ITag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, user => user.tags)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Task, task => task.tag)
  @JoinColumn({ name: 'user_id' })
  Tasks: Task[];

}

export default Tag;
