import { DataTypes, Model, Sequelize } from 'sequelize';
import type {
	Association,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	HasManyGetAssociationsMixin,
	HasManyAddAssociationsMixin,
	HasManyRemoveAssociationMixin,
	HasOneGetAssociationMixin,
	HasOneSetAssociationMixin,
	NonAttribute
} from 'sequelize';

export const sequelize = new Sequelize('sqlite::memory:');

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>;
	declare username: string;
	declare email: string;
	declare password: string;
	declare bio: string;
	declare image: string;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare getFollower: HasManyGetAssociationsMixin<User>;
	declare addFollower: HasManyAddAssociationsMixin<User, number>;
	declare removeFollower: HasManyRemoveAssociationMixin<User, number>;

	declare static associations: {
		followers: Association<User, User>;
	};
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		username: {
			type: new DataTypes.STRING(128),
			allowNull: false,
			unique: true
		},
		email: {
			type: new DataTypes.STRING(128),
			allowNull: false,
			unique: true
		},
		password: {
			type: new DataTypes.STRING(128),
			allowNull: false
		},
		bio: {
			type: new DataTypes.STRING(128),
			allowNull: false,
			defaultValue: ''
		},
		image: {
			type: new DataTypes.STRING(128),
			allowNull: false,
			defaultValue: ''
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE
	},
	{
		tableName: 'users',
		sequelize
	}
);

User.belongsToMany(User, {
	through: 'followers',
	as: 'Follower'
});

export class Article extends Model<InferAttributes<Article>, InferCreationAttributes<Article>> {
	declare id: CreationOptional<string>;
	declare slug: string;
	declare title: string;
	declare description: string;
	declare body: string;

	declare favorite?: NonAttribute<User[]>;
	declare getFavorite: HasManyGetAssociationsMixin<User>;
	declare addFavorite: HasManyAddAssociationsMixin<User, number>;
	declare removeFavorite: HasManyRemoveAssociationMixin<User, number>;

	declare getArticleTag: HasManyGetAssociationsMixin<Tag>;
	declare addArticleTag: HasManyAddAssociationsMixin<Tag, number>;

	declare User?: User;
	declare getUser: HasOneGetAssociationMixin<User>;
	declare setUser: HasOneSetAssociationMixin<User, number>;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Article.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		slug: {
			type: new DataTypes.STRING(128),
			allowNull: false
		},
		title: {
			type: new DataTypes.STRING(128),
			allowNull: false
		},
		description: {
			type: new DataTypes.STRING(128)
		},
		body: {
			type: new DataTypes.STRING(128)
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE
	},
	{
		tableName: 'articles',
		sequelize
	}
);

Article.belongsTo(User);
User.hasMany(Article);

Article.belongsToMany(User, { through: 'favorites', as: 'Favorite' });
User.belongsToMany(Article, { through: 'favorites', as: 'Favorite' });

export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
	declare id: CreationOptional<string>;
	declare body: string;

	declare getUser: HasOneGetAssociationMixin<User>;
	declare setUser: HasOneSetAssociationMixin<User, number>;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}
Comment.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		body: {
			type: new DataTypes.STRING(128)
		},
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE
	},
	{
		tableName: 'comments',
		sequelize
	}
);

Article.hasMany(Comment);
Comment.belongsTo(Article);
User.hasMany(Comment);
Comment.belongsTo(User);

export class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
	declare id: CreationOptional<string>;
	declare tag: string;
}
Tag.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		tag: {
			type: new DataTypes.STRING(128)
		}
	},
	{
		tableName: 'tags',
		sequelize
	}
);

Article.belongsToMany(Tag, {
	through: 'articleTags',
	as: 'ArticleTag'
});
Tag.belongsToMany(Article, {
	through: 'articleTags',
	as: 'ArticleTag'
});
