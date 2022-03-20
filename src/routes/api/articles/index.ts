import { Article, sequelize, Tag } from '$lib/db';
import { getUser, requireJwt, toArticleDto } from '$lib/service';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
	const articles = await Article.findAll();

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

export const post: RequestHandler = async ({ request, locals }) => {
	const jwt = requireJwt(locals.jwtString);

	const body = (await request.json()) as {
		article: {
			title: string;
			description: string;
			body: string;
			tagList?: string[];
		};
	};

	let article = await Article.create({
		title: body.article.title,
		description: body.article.description,
		body: body.article.body,
		slug: body.article.title + 'id'
	});
	article = await Article.findByPk(article.id);
	const user = await getUser(jwt.email);
	await article.setUser(user);

	const transaction = await sequelize.transaction();
	await Promise.allSettled(
		body.article.tagList?.map((tag) =>
			Tag.findOrCreate({
				where: {
					tag
				},
				transaction
			})
		)
	);
	transaction.commit();

	if (body.article.tagList) {
		const tags = await Tag.findAll({
			where: {
				tag: body.article.tagList
			}
		});
		await article.addArticleTag(tags);
	}

	await article.save();

	return {
		status: 200,
		body: {
			article: await toArticleDto(article)
		}
	};
};
