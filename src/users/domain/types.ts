import { Email } from 'src/auth/domain/value-objects/email.vo';
import { Password } from 'src/auth/domain/value-objects/password.vo';
import { Username } from 'src/auth/domain/value-objects/username.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { UpdatedAt } from 'src/common/domain/identity/value-objects/updated-at.vo';
import { MediaURL } from 'src/common/domain/identity/value-objects/media-url.vo';
import { SessionCollection } from 'src/auth/domain/collections/session.collection';

/* User properties used to create a User entity*/
export type UserProps = {
    id: UserId;
    email: Email;
    username: Username;
    password: Password;
    avatar?: MediaURL;
    createdAt?: CreatedAt;
    updatedAt?: UpdatedAt;
    sessions?: SessionCollection;
};
