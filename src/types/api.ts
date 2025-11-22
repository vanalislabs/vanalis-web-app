export interface PaginatedApiResponse<DataType> {
	statusCode: number;
	message: string;
	data: DataType;
	meta: {
		total: number;
		page: number;
		perPage: number;
		totalPages: number;
	};
}

export type ApiResponse<T> = {
	success: boolean;
	message: string;
	code: number;
	data: T;
};

export type ApiError = {
	status: boolean;
	message: string;
	error: string;
};

export type UninterceptedApiError = {
	code: number;
	status: boolean;
	message: string | Record<string, string[]>;
};

export type PaginationQueryParams = {
	page?: number;
    perPage?: number;
    search?: string;
    status?: string;
};
