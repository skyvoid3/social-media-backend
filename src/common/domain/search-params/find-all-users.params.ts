import { SortOrder, UserSortableFields } from './sorting-types';

export class FindAllUsersParams {
    public readonly search?: string;
    public readonly isAdmin?: boolean;
    public readonly isActive?: boolean;
    public readonly role?: string;

    public readonly sortBy: UserSortableFields;
    public readonly sortOrder: SortOrder;

    constructor(
        search?: string,
        isAdmin?: boolean,
        isActive?: boolean,
        role?: string,
        sortBy: UserSortableFields = 'createdAt',
        sortOrder: SortOrder = 'desc',
    ) {
        this.search = search;
        this.isAdmin = isAdmin;
        this.isActive = isActive;
        this.role = role;

        const allowedFields: UserSortableFields[] = ['createdAt', 'name', 'email'];
        this.sortBy = allowedFields.includes(sortBy) ? sortBy : 'createdAt';

        this.sortOrder = sortOrder === 'asc' ? 'asc' : 'desc';
    }

    public getSort(): { field: UserSortableFields; order: SortOrder } {
        return { field: this.sortBy, order: this.sortOrder };
    }

    public hasFilters(): boolean {
        return Boolean(
            this.search || this.isAdmin !== undefined || this.isActive !== undefined || this.role,
        );
    }
}
