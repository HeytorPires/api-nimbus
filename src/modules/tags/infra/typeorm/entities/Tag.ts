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
  UpdateDateColumn,
} from 'typeorm';
@Entity('tags')
class Tag implements ITag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Project, (project) => project.tag)
  projects: Project[];
}

export default Tag;
