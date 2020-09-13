import { Service, Inject, Injectable } from '@tsed/di';
import { UserSchema } from '../models/UserSchema';
import { MongooseModel } from '@tsed/mongoose';
import { ProjectsService } from './ProjectsService';
import { ProjectSchema } from '../models/ProjectSchema';
import { Mongoose } from 'mongoose';
import { constructorOf } from '@tsed/core';
import { UserSignup } from '../models/UserSignup';
import { Hash } from 'crypto';

@Service()
export class UsersService {
  @Inject(UserSchema)
  private User: MongooseModel<UserSchema>;
  private ProjectsSvc: ProjectsService;

  async findOne(property: { [key: string]: any }): Promise<UserSchema | null> {
    return await this.User.findOne(property).exec();
  }

  async create(user: UserSignup): Promise<UserSchema | null> {
    return await this.User.create(user);
  }

  async findById(id: string): Promise<UserSchema | null> {
    return await this.User.findOne({ _id: id }).exec();
  }

  async getUserProjects(
    id: string | undefined
  ): Promise<ProjectSchema | ProjectSchema[] | null> {
    if (id) {
      const userProjects = (await this.User.findById(id).exec())?.projects;
      const projectIds = userProjects?.map((project) => project._id);
      const projects = this.ProjectsSvc.find(projectIds);
      return projects;
    } else {
      return [];
    }
  }
}
