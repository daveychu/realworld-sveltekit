import { User } from '$lib/db';
import bcrypt from 'bcrypt';
import type { RequestHandler } from '@sveltejs/kit';
import { toUserDto } from '$lib/service';

export const post: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as {
		user: {
			username: string;
			email: string;
			password: string;
		};
	};

	return new Promise((resolve) => {
		bcrypt.hash(body.user.password, 10, async function (err, hash) {
			const user = await User.create({
				username: body.user.username,
				email: body.user.email,
				password: hash
			});

			resolve({
				status: 200,
				body: toUserDto(user)
			});
		});
	});
};
