import { Article, User } from '$lib/db';
import { requireJwt, toArticleDto } from '$lib/service';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ locals }) => {
	const jwt = requireJwt(locals.jwtString);

	const followedUsers = await User.findAll({
		include: {
			model: User,
			as: 'Follower',
			where: {
				email: jwt.email
			},
			attributes: []
		}
	});

	const articles = await Article.findAll({
		include: {
			model: User,
			where: {
				id: [...followedUsers.map((it) => it.id)]
			},
			attributes: []
		}
	});

	const promises = articles.map((article) => toArticleDto(article));
	const dtos = await Promise.all(promises);

	return {
		status: 200,
		body: {
			articles: dtos,
			articlesCount: articles.length
		}
	};
};
