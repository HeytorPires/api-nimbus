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
import { IProject } from '@modules/projects/domain/models/IProject';
import User from '@modules/users/infra/typeorm/entities/User';
import Tag from '@modules/tags/infra/typeorm/entities/Tag';
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

  @ManyToOne(() => User, user => user.projects)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'tag_id' })
  tagId: string;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

}

export default Project;
