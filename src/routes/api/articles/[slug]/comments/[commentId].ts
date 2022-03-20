import type { RequestHandler } from '@sveltejs/kit';
import { Comment, User } from '$lib/db';
import { Forbidden, requireJwt } from '$lib/service';

export const del: RequestHandler = async ({ params, locals }) => {
	const jwt = requireJwt(locals.jwtString);

	const id = params.commentId;

	const comment = await Comment.findOne({
		where: { id },
		include: {
			model: User
		}
	});

	if (comment) {
		if ((await comment.getUser()).email !== jwt.email) {
			throw new Forbidden("Not allowed to delete other user's comments!");
		}

		if (comment) {
			await comment.destroy();
		}
	}

	return {
		status: 200
	};
};
