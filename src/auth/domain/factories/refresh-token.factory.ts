import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenProps } from '../props';
import { JwtTokenId } from '../value-objects/jwt-token-id.vo';
import { ExpiresAt } from 'src/common/domain/identity/value-objects/expires-at.vo';
import { DateTime } from 'src/common/domain/utils/date-time';
import { SessionId } from '../value-objects/session-id.vo';
import { JwtToken } from '../value-objects/token.vo';

export class RefreshTokenFactory {
    static createNew(
        token: JwtToken,
        sessionId: SessionId,
        params?: { expiresInDays?: number },
    ): RefreshToken {
        const props: RefreshTokenProps = {
            id: JwtTokenId.create(),
            sessionId,
            token,
            expiresAt: ExpiresAt.create(DateTime.now().add({ days: params?.expiresInDays ?? 7 })),
        };

        return RefreshToken.create(props);
    }

    static fromProps(props: RefreshTokenProps): RefreshToken {
        return RefreshToken.create(props);
    }
}
