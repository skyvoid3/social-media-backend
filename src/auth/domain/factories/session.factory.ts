import { Session } from '../entities/session.entity';
import { SessionId } from '../value-objects/session-id.vo';
import { ExpiresAt } from 'src/common/domain/identity/value-objects/expires-at.vo';
import { SessionProps } from '../props';
import { DateTime } from 'src/common/domain/utils/date-time';
import { CreateSessionParams } from '../params';
import { RefreshToken } from '../entities/refresh-token.entity';

export class SessionFactory {
    static createNew(
        params: CreateSessionParams,
        refreshToken: RefreshToken,
        id: SessionId,
    ): Session {
        // expires after seven days. The ExpiresAt API will be change to be more readable
        const expiresAt = ExpiresAt.create(DateTime.now().add({ days: params.expiresInDays }));
        const props: SessionProps = {
            id,
            expiresAt,
            refreshToken: refreshToken,
            userAgent: params.userAgent,
            ipAddress: params.ipAddress,
            userId: params.userId,
        };

        return Session.create(props);
    }
}
