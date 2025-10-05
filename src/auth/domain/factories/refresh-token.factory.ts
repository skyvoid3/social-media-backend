import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenProps } from '../types';
import { JwtTokenId } from '../value-objects/jwt-token-id.vo';
import { ExpiresAt } from 'src/common/domain/identity/value-objects/expires-at.vo';
import { DateTime } from 'src/common/domain/utils/date-time';
import { CreateRefreshTokenParams } from '../params';
import { SessionId } from '../value-objects/session-id.vo';

export class RefreshTokenFactory {
    static createNew(params: CreateRefreshTokenParams, sessionId: SessionId): RefreshToken {
        const props: RefreshTokenProps = {
            id: JwtTokenId.create(),
            sessionId,
            token: params.token,
            expiresAt: ExpiresAt.create(DateTime.now().add({ days: params.expiresInDays })),
        };

        return RefreshToken.create(props);
    }

    static fromProps(props: RefreshTokenProps): RefreshToken {
        return RefreshToken.create(props);
    }
}
