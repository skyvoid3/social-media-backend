import { Session } from '../entities/session.entity';
import { SessionId } from '../value-objects/session-id.vo';
import { ExpiresAt } from 'src/common/domain/identity/value-objects/expires-at.vo';
import { SessionProps } from '../props';
import { DateTime } from 'src/common/domain/utils/date-time';
import { RefreshToken } from '../entities/refresh-token.entity';
import { UserAgent } from '../value-objects/user-agent.vo';
import { IpAddress } from '../value-objects/ip-address.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';

export class SessionFactory {
    static createNew(
        userAgent: UserAgent,
        ipAddress: IpAddress,
        userId: UserId,
        refreshToken: RefreshToken,
        id: SessionId,
        params?: {
            expiresInDays?: number;
        },
    ): Session {
        // expires after seven days. The ExpiresAt API will be change to be more readable
        const expiresAt = ExpiresAt.create(
            DateTime.now().add({ days: params?.expiresInDays ?? 7 }),
        );
        const props: SessionProps = {
            id,
            expiresAt,
            refreshToken: refreshToken,
            userAgent: userAgent,
            ipAddress: ipAddress,
            userId: userId,
        };

        return Session.create(props);
    }
}
