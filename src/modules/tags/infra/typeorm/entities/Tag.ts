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
import User from '@modules/users/infra/typeorm/entities/User';
import { ITag } from '@modules/tags/domain/models/ITag';
@Entity('tags')
class Tag implements ITag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, user => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;

}

export default Tag;
