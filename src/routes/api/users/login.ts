import { getUser, toUserDto } from '$lib/service';
import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const post: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as {
		user: {
			email: string;
			password: string;
		};
	};

	const user = await getUser(body.user.email);

	return new Promise((resolve) => {
		bcrypt.compare(body.user.password, user.password, function (err, result) {
			if (err || !result) {
				resolve({
					status: 422
				});
			} else {
				resolve({
					status: 200,
					body: toUserDto(user)
				});
			}
		});
	});
};
