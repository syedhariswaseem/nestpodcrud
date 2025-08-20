import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export interface UserEntity {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  private users: UserEntity[] = [];
  private nextId = 0;

  async createUser(params: { email: string; password: string; name?: string }): Promise<Omit<UserEntity, 'passwordHash'>> {
    const existing = this.users.find((u) => u.email.toLowerCase() === params.email.toLowerCase());
    if (existing) {
      throw new BadRequestException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(params.password, 10);
    const now = new Date();
    const user: UserEntity = {
      id: String(++this.nextId),
      email: params.email,
      name: params.name,
      passwordHash,
      createdAt: now,
    };
    this.users.push(user);
    const { passwordHash: _ph, ...safe } = user;
    return safe;
  }

  async validateUser(email: string, password: string): Promise<Omit<UserEntity, 'passwordHash'> | null> {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return null;
    const { passwordHash: _ph, ...safe } = user;
    return safe;
  }

  async findById(id: string): Promise<Omit<UserEntity, 'passwordHash'> | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash: _ph, ...safe } = user;
    return safe;
  }
}
