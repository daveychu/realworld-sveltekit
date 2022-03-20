import { sequelize } from '$lib/db';
import { getJwtString, HttpError } from '$lib/service';
import type { Handle } from '@sveltejs/kit';

// Workaround for doing something at start-up, see https://github.com/sveltejs/kit/issues/927#issuecomment-922249364
const setup = (async () => {
	await sequelize.sync({ force: true });
})().catch((err) => {
	console.log(err);
	// Exit the app if setup has failed
	process.exit(-1);
});

export const handle: Handle = async ({ event, resolve }) => {
	await setup;
	event.locals.jwtString = await getJwtString(event.request);

	try {
		return await resolve(event);
	} catch (e) {
		if (e instanceof HttpError) {
			return new Response(e.message, {
				status: e.status
			});
		}
	}
};
