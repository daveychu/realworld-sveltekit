import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
	return {
		status: 200
	};
};

export const post: RequestHandler = async () => {
	return {
		status: 200
	};
};
