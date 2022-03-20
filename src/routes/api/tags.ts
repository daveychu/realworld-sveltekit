import { Tag } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
	const tags = await Tag.findAll();
	return {
		status: 200,
		body: {
			tags: tags.map((tag) => {
				return tag.tag;
			})
		}
	};
};
