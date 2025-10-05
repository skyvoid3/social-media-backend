import { DEFAULT_PAGE_SIZE } from '../constants/pagination.constants';

export class PaginatedSearch {
    private _perPage: number;
    private _offset: number;
    private _page: number;

    private constructor(page = 1) {
        if (page < 1) {
            page = 1;
        }

        this._perPage = DEFAULT_PAGE_SIZE;
        this._page = page;
        this._offset = (this._page - 1) * this._perPage;
    }

    public static create(page?: number): PaginatedSearch {
        return new PaginatedSearch(page);
    }

    get perPage(): number {
        return this._perPage;
    }

    get offset(): number {
        return this._offset;
    }

    get page(): number {
        return this._page;
    }

    nextPage(): number {
        return this._page + 1;
    }

    previousPage(): number {
        return this._page > 1 ? this._page - 1 : 1;
    }
}
