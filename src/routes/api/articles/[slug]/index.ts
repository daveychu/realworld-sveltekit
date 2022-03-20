import { Article, User } from '$lib/db';
import { Forbidden, requireJwt, toArticleDto } from '$lib/service';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
	const slug = params.slug;
	const article = await Article.findOne({
		where: {
			slug
		}
	});

	return {
		status: 200,
		body: {
			article: await toArticleDto(article)
		}
	};
};

export const put: RequestHandler = async ({ request, params, locals }) => {
	const jwt = requireJwt(locals.jwtString);

	const body = (await request.json()) as {
		article: {
			title?: string;
			description?: string;
			body?: string;
		};
	};

	const slug = params.slug;
	const article = await Article.findOne({
		include: {
			model: User,
			attributes: ['email']
		},
		where: {
			slug
		}
	});

	if (article.User.email !== jwt.email) {
		throw new Forbidden("Not allowed to update other user's article");
	}
	article.set({
		title: body.article.title ?? article.title,
		description: body.article.description ?? article.description,
		body: body.article.body ?? article.body,
		slug: body.article.title + 'id'
	});
	return {
		status: 200,
		body: { article: await toArticleDto(article) }
	};
};

export const del: RequestHandler = async ({ params, locals }) => {
	const jwt = requireJwt(locals.jwtString);

	const slug = params.slug;
	const article = await Article.findOne({
		where: {
			slug
		},
		include: {
			model: User,
			attributes: ['email']
		}
	});

	if (article.User.email !== jwt.email) {
		throw new Forbidden("Not allowed to delete other user's article");
	}

	await Article.destroy({
		where: {
			slug
		}
	});
	return {
		status: 200
	};
};
