import Project from '@modules/projects/infra/typeorm/entities/Project';
import Tag from '@modules/tags/infra/typeorm/entities/Tag';
import { IUser } from '@modules/users/domain/models/IUser';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('users')
class User implements IUser {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];
}

export default User;
