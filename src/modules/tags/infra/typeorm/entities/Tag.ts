import Project from '@modules/projects/infra/typeorm/entities/Project';
import { ITag } from '@modules/tags/domain/models/ITag';
import User from '@modules/users/infra/typeorm/entities/User';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('tags')
class Tag implements ITag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Project, (project) => project.tag)
  @JoinColumn({ name: 'user_id' })
  projects: Project[];
}

export default Tag;
