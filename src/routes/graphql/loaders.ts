import DataLoader from 'dataloader';

export function buildLoaders(prisma) {
  return {
    userLoader: new DataLoader(async (ids) => {
      const users = await prisma.user.findMany({
        where: { id: { in: ids } },
      });
      const userMap = new Map(users.map((user) => [user.id, user]));
      return ids.map((id) => userMap.get(id));
    }),
    profileLoader: new DataLoader(async (userIds) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: userIds } },
      });
      const profileMap = new Map(profiles.map((profile) => [profile.userId, profile]));
      return userIds.map((userId) => profileMap.get(userId));
    }),
    postsByAuthorIdLoader: new DataLoader(async (authorIds) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: authorIds } },
      });
      const postsMap = new Map();
      posts.forEach((post) => {
        if (!postsMap.has(post.authorId)) {
          postsMap.set(post.authorId, []);
        }
        postsMap.get(post.authorId).push(post);
      });
      return authorIds.map((authorId) => postsMap.get(authorId) || []);
    }),
    userSubscribedToLoader: new DataLoader(async (userIds) => {
      const subscriptions = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: { in: userIds } },
        include: { author: true },
      });
      const subscriptionsMap = new Map();
      subscriptions.forEach((sub) => {
        if (!subscriptionsMap.has(sub.subscriberId)) {
          subscriptionsMap.set(sub.subscriberId, []);
        }
        subscriptionsMap.get(sub.subscriberId).push(sub.author);
      });
      return userIds.map((userId) => subscriptionsMap.get(userId) || []);
    }),
    subscribedToUserLoader: new DataLoader(async (userIds) => {
      const subscribers = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: userIds } },
        include: { subscriber: true },
      });
      const subscribersMap = new Map();
      subscribers.forEach((sub) => {
        if (!subscribersMap.has(sub.authorId)) {
          subscribersMap.set(sub.authorId, []);
        }
        subscribersMap.get(sub.authorId).push(sub.subscriber);
      });
      return userIds.map((userId) => subscribersMap.get(userId) || []);
    }),
    memberTypeLoader: new DataLoader(async (ids) => {
      const memberTypes = await prisma.memberType.findMany({
        where: { id: { in: ids } },
      });
      const memberTypeMap = new Map(memberTypes.map((mt) => [mt.id, mt]));
      return ids.map((id) => memberTypeMap.get(id));
    }),
    postLoader: new DataLoader(async (ids) => {
      const posts = await prisma.post.findMany({
        where: { id: { in: ids } },
      });
      const postMap = new Map(posts.map((post) => [post.id, post]));
      return ids.map((id) => postMap.get(id));
    }),
  };
}
