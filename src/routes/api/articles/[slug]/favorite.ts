import { requireJwt, favoriteArticle, toArticleDto, unfavoriteArticle } from '$lib/service';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ params, locals }) => {
	const jwt = requireJwt(locals.jwtString);

	const slug = params.slug;
	const article = await favoriteArticle(slug, jwt.email);

	return {
		status: 200,
		body: {
			article: await toArticleDto(article, jwt.email)
		}
	};
};

export const del: RequestHandler = async ({ params, locals }) => {
	const jwt = requireJwt(locals.jwtString);

	const slug = params.slug;
	const article = await unfavoriteArticle(slug, jwt.email);

	return {
		status: 200,
		body: { article: await toArticleDto(article) }
	};
};
