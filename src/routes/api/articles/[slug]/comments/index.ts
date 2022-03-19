import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async () => {
	return {
		status: 200
	};
};

export const get: RequestHandler = async () => {
	return {
		status: 200
	};
};

export const del: RequestHandler = async () => {
	return {
		status: 200
	};
};
