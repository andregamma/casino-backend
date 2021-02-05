import { Transformer } from './Transformer';
import { User } from '../entities/User';

export interface UserTransformerOptions {
  withRankPermissions?: boolean;
}

export class UserTransformer
  implements Transformer<User, UserTransformerOptions> {
  transform(user: User, options: UserTransformerOptions): any {
    const { withRankPermissions } = options;
    const rank = { name: user.rank.name };

    return {
      ...user,
      rank: withRankPermissions ? user.rank : rank,
    };
  }
}
