import { IProject } from '@modules/projects/domain/models/IProject';
import Tag from '@modules/tags/infra/typeorm/entities/Tag';
import User from '@modules/users/infra/typeorm/entities/User';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('projects')
class Project implements IProject {
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

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'tag_id' })
  tag_id: string;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}

export default Project;
