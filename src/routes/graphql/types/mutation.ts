import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import { UserType } from './user.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import {
  CreateUserInputType,
  CreatePostInputType,
  CreateProfileInputType,
} from './inputTypes.js';
import { UUIDType } from './uuid.js';

export const MutationType = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: async (parent, { dto }, context) => {
        const user = await context.prisma.user.create({
          data: dto,
        });
        context.loaders.userLoader.prime(user.id, user);
        return user;
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      resolve: async (parent, { dto }, context) => {
        const profile = await context.prisma.profile.create({
          data: dto,
        });
        context.loaders.profileLoader.prime(profile.id, profile);
        return profile;
      },
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      resolve: async (parent, { dto }, context) => {
        const post = await context.prisma.post.create({
          data: dto,
        });
        context.loaders.postsByAuthorIdLoader.clear(dto.authorId);
        return post;
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { id }, context) => {
        await context.prisma.user.delete({
          where: { id },
        });
        context.loaders.userLoader.clear(id);
        return `User ${id} deleted successfully.`;
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { id }, context) => {
        await context.prisma.post.delete({
          where: { id },
        });
        return `Post ${id} deleted successfully.`;
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { id }, context) => {
        await context.prisma.profile.delete({
          where: { id },
        });
        context.loaders.profileLoader.clear(id);
        return `Profile ${id} deleted successfully.`;
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { userId, authorId }, context) => {
        // Implement subscription logic here
        return `User ${userId} subscribed to author ${authorId}.`;
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { userId, authorId }, context) => {
        // Implement unsubscription logic here
        return `User ${userId} unsubscribed from author ${authorId}.`;
      },
    },
  },
});
