import type { RequestHandler } from '@sveltejs/kit';
import { followUser, unfollowUser, toProfileDto, requireJwt } from '$lib/service';

export const post: RequestHandler = async ({ params, locals }) => {
	const jwt = requireJwt(locals.jwtString);

	const username = params.username;
	const profile = await followUser(username, jwt.email);

	return {
		status: 200,
		body: toProfileDto(profile)
	};
};

export const del: RequestHandler = async ({ params, locals }) => {
	const jwt = requireJwt(locals.jwtString);

	const username = params.username;
	const profile = await unfollowUser(username, jwt.email);

	return {
		status: 200,
		body: toProfileDto(profile)
	};
};
