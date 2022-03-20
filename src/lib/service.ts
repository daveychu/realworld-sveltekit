import jwt from 'jsonwebtoken';
import { Article, User, Comment } from './db';

const secret = 'shhhhh';

export function signJwt(user: JwtClaims) {
	return jwt.sign(
		{
			email: user.email,
			username: user.username,
			bio: user.bio,
			image: user.image
		},
		secret,
		{ expiresIn: 60 * 60 }
	);
}

export function requireJwt(token: string) {
	try {
		return jwt.verify(token, secret) as JwtClaims;
	} catch (e) {
		console.log(e);
		throw new Unauthorized('Not allowed');
	}
}

export function getJwt(token: string) {
	try {
		return jwt.verify(token, secret) as JwtClaims;
	} catch (e) {
		return null;
	}
}

export class HttpError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}
export class Unauthorized extends HttpError {
	constructor(message: string) {
		super(message, 401);
	}
}

export class Forbidden extends HttpError {
	constructor(message: string) {
		super(message, 403);
	}
}

export class ValidationError extends HttpError {
	constructor(message: string) {
		super(message, 422);
	}
}

export function toUserDto(user: JwtClaims) {
	return {
		user: {
			email: user.email,
			token: signJwt(user),
			username: user.username,
			bio: user.bio,
			image: user.image
		}
	};
}

export async function toArticleDto(article: Article, email?: string) {
	const favorites = await article.getFavorite();

	return {
		slug: article.slug,
		title: article.title,
		description: article.description,
		body: article.body,
		tagList: (await article.getArticleTag())?.map((t) => t.tag).sort() ?? [],
		createdAt: article.createdAt,
		updatedAt: article.updatedAt,
		favorited: email ? favorites?.map((fav) => fav.email).includes(email) : false,
		favoritesCount: favorites?.length ?? 0,
		author: await getProfile((await article.getUser()).username, email)
	};
}

export async function toCommentDto(comment: Comment, email?: string) {
	return {
		id: comment.id,
		createdAt: comment.createdAt,
		updatedAt: comment.updatedAt,
		body: comment.body,
		author: await getProfile((await comment.getUser()).username, email)
	};
}

export function toProfileDto({ username, bio, image, following }) {
	return {
		profile: {
			username: username,
			bio: bio,
			image: image,
			following: following
		}
	};
}

export async function getJwtString(request: Request): Promise<string> {
	const auth = await request.headers.get('Authorization');
	if (auth) {
		return auth.replace('Token ', '');
	}
	return null;
}

export async function getUser(email: string) {
	return await User.findOne({
		where: {
			email
		}
	});
}

export async function getProfile(username: string, follower?: string) {
	const user = await User.findOne({
		where: {
			username
		},
		include: 'Follower'
	});
	const emails = (await user.getFollower()).map((user) => user.email);

	const following = emails.includes(follower);
	return {
		username: user.username,
		bio: user.bio,
		image: user.image,
		following: following
	};
}

export async function followUser(username: string, follower: string) {
	const user = await User.findOne({
		where: {
			username
		},
		include: 'Follower'
	});

	const followerEntity = await getUser(follower);

	if (!(await user.getFollower()).map((user) => user.email).includes(follower)) {
		user.addFollower([followerEntity]);
		user.save();
	}
	return {
		username: user.username,
		bio: user.bio,
		image: user.image,
		following: true
	};
}

export async function unfollowUser(username: string, follower: string) {
	const user = await User.findOne({
		where: {
			username
		},
		include: 'Follower'
	});

	const followerEntity = await getUser(follower);

	if ((await user.getFollower()).map((user) => user.email).includes(follower)) {
		user.removeFollower(followerEntity);
		user.save();
	}
	return {
		username: user.username,
		bio: user.bio,
		image: user.image,
		following: false
	};
}

export async function favoriteArticle(slug: string, email: string) {
	const article = await Article.findOne({
		where: {
			slug
		},
		include: 'Favorite'
	});

	const user = await getUser(email);

	if (!(await article.getFavorite()).map((user) => user.email).includes(email)) {
		await article.addFavorite([user]);
		await article.save();
	}

	return article;
}

export async function unfavoriteArticle(slug: string, email: string) {
	const article = await Article.findOne({
		where: {
			slug
		},
		include: 'Favorite'
	});

	const user = await getUser(email);

	if ((await article.getFavorite()).map((user) => user.email).includes(email)) {
		article.removeFavorite(user);
		article.save();
	}

	return article;
}

export type JwtClaims = {
	username: string;
	email: string;
	bio: string;
	image: string;
};
