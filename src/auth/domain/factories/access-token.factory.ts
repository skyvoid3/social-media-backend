import { AccessToken } from '../entities/access-token.entity';
import { AccessTokenProps } from '../props';
import { JwtTokenId } from '../value-objects/jwt-token-id.vo';
import { ExpiresAt } from 'src/common/domain/identity/value-objects/expires-at.vo';
import { DateTime } from 'src/common/domain/utils/date-time';
import { SessionId } from '../value-objects/session-id.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { JwtToken } from '../value-objects/token.vo';

export class AccessTokenFactory {
    static createNew(
        token: JwtToken,
        sessionId: SessionId,
        userId: UserId,
        params?: {
            expiresInSeconds?: number;
        },
    ): AccessToken {
        const props: AccessTokenProps = {
            id: JwtTokenId.create(),
            sessionId,
            userId,
            token,
            expiresAt: ExpiresAt.create(
                // expires in one hour. The DateTime class will be changed to be more readable
                DateTime.now().add({ seconds: params?.expiresInSeconds ?? 1 * 60 * 60 }),
            ),
        };

        return AccessToken.create(props);
    }

    static fromProps(props: AccessTokenProps): AccessToken {
        return AccessToken.create(props);
    }
}
