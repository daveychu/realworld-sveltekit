import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
	return {
		status: 200
	};
};

export const put: RequestHandler = async () => {
	return {
		status: 200
	};
};
