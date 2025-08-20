import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { IUser } from '@modules/users/domain/models/IUser';
import Task from '@modules/tasks/infra/typeorm/entities/Task';
import Tag from '@modules/tags/infra/typeorm/entities/Tag';
@Entity('users')
class User implements IUser {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Task, task => task.user)
  tasks: Task[];

  @OneToMany(() => Tag, tag => tag.user)
  tags: Tag[];

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      return null;
    }
    return `${process.env.APP_API_URL}/files/${this.avatar}`;
  }
}

export default User;
