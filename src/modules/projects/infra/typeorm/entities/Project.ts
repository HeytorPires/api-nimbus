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

  @Column({ name: 'variables_environment' })
  variablesEnvironment: string;

  @Column()
  repository: string;

  @Column({ name: 'initialization_vector', nullable: true })
  initializationVector: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'tag_id' })
  tagId: string;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}

export default Project;
