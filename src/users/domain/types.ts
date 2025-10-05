import { Email } from 'src/auth/domain/value-objects/email.vo';
import { Password } from 'src/auth/domain/value-objects/password.vo';
import { Username } from 'src/auth/domain/value-objects/username.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { UpdatedAt } from 'src/common/domain/identity/value-objects/updated-at.vo';
import { Session } from '../../auth/domain/entities/session.entity';
import { MediaURL } from 'src/common/domain/identity/value-objects/media-url.vo';

export type UserProps = {
    id: UserId;
    email: Email;
    username: Username;
    password: Password;
    avatar?: MediaURL;
    createdAt?: CreatedAt;
    updatedAt?: UpdatedAt;
    sessions?: Session[];
};
