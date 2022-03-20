import { getUser, toUserDto, requireJwt } from '$lib/service';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ locals }) => {
	const jwt = requireJwt(locals.jwtString);

	return {
		status: 200,
		body: toUserDto(jwt)
	};
};

export const put: RequestHandler = async ({ request, locals }) => {
	const body = (await request.json()) as {
		user: {
			username: string;
			email: string;
			password: string;
			bio: string;
			image: string;
		};
	};

	const jwt = requireJwt(locals.jwtString);

	const user = await getUser(jwt.email);
	user.set({
		email: body.user.email,
		bio: body.user.bio ?? '',
		image: body.user.image ?? ''
	});
	user.save();

	return {
		status: 200,
		body: toUserDto(user)
	};
};
