import { Model, ObjectID, Ref, PreHook } from '@tsed/mongoose';
import { ProjectSchema } from './ProjectSchema';
import { CollectionOf, Property, Required } from '@tsed/common';
import Hash = require('password-hash');

@Model({ name: 'User' })
@PreHook('save', (user: UserSchema, next: any) => {
  if (Hash.isHashed(user.password)) {
    user.password = Hash.generate(user.password);
  }
  next();
})
export class UserSchema {
  @ObjectID('id')
  _id: string;

  @CollectionOf(ProjectSchema)
  projects?: ProjectSchema[];

  @Property()
  @Required()
  userName: string;

  @Property()
  displayName: string;

  @Property()
  @Required()
  password: string;

  @Property()
  @Required()
  email: string;

  verifyPassword(password: string): Boolean {
    return Hash.verify(password, this.password);
  }
}
