import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import { UserType } from './user.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { MemberType } from './memberType.js';
import { UUIDType } from './uuid.js';
import { MemberTypeIdEnum } from './memberType.js';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (parent, args, context) => {
        try {
          const memberTypes = await context.prisma.memberType.findMany();
          return memberTypes;
        } catch (error) {
          console.error('Error in memberTypes resolver:', error);
          throw error;
        }
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
      resolve: async (parent, { id }, context) => {
        return context.prisma.memberType.findUnique({ where: { id } });
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, args, context, info) => {
        const parsedInfo = parseResolveInfo(info);
        if (!parsedInfo?.fieldsByTypeName.User) {
          return context.prisma.user.findMany();
        }

        const fields = parsedInfo.fieldsByTypeName.User;

        const include: any = {};
        if (fields['profile']) {
          include.profile = true;
        }
        if (fields['posts']) {
          include.posts = true;
        }
        if (fields['userSubscribedTo']) {
          include.userSubscribedTo = true;
        }
        if (fields['subscribedToUser']) {
          include.subscribedToUser = true;
        }

        const users = await context.prisma.user.findMany({ include });
        users.forEach((user) => {
          context.loaders.userLoader.prime(user.id, user);
        });
        return users;
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { id }, context) => {
        return context.prisma.user.findUnique({ where: { id } });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (parent, args, context) => {
        const posts = await context.prisma.post.findMany();
        posts.forEach((post) => {
          context.loaders.postLoader.prime(post.id, post);
        });
        return posts;
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { id }, context) => {
        return context.prisma.post.findUnique({ where: { id } });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (parent, args, context) => {
        const profiles = await context.prisma.profile.findMany();
        profiles.forEach((profile) => {
          context.loaders.profileLoader.prime(profile.id, profile);
        });
        return profiles;
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { id }, context) => {
        return context.prisma.profile.findUnique({ where: { id } });
      },
    },
  },
});
