import { getProfile, toProfileDto, getJwt } from '$lib/service';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params, locals }) => {
	const jwt = getJwt(locals.jwtString);
	const username = params.username;
	const user = await getProfile(username, jwt?.email);
	return {
		status: 200,
		body: toProfileDto(user)
	};
};
