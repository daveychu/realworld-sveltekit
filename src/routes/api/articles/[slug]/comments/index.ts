import type { RequestHandler } from '@sveltejs/kit';
import { Article, Comment } from '$lib/db';
import { getUser, requireJwt, toCommentDto } from '$lib/service';

export const post: RequestHandler = async ({ request, locals }) => {
	const jwt = requireJwt(locals.jwtString);

	const body = (await request.json()) as {
		comment: {
			body: string;
		};
	};

	const comment = await Comment.build({
		body: body.comment.body
	});
	await comment.setUser(await getUser(jwt.email));
	await comment.save();

	return {
		status: 200,
		body: { comment: await toCommentDto(comment) }
	};
};

export const get: RequestHandler = async ({ params }) => {
	const slug = params.slug;
	const comments = await Comment.findAll({
		include: {
			model: Article,
			attributes: [],
			where: {
				slug
			}
		}
	});

	const commentDtos = await Promise.all(comments.map((comment) => toCommentDto(comment)));

	return {
		status: 200,
		body: {
			comments: commentDtos
		}
	};
};
