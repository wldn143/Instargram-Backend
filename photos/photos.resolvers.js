import client from "../client";

export default {
  Photo: {
    user: ({ userId }) => {
      return client.user.findUnique({ where: { id: userId } });
    },
    likes: ({ id }) => client.like.count({ where: { photoId: id } }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;
      return userId === loggedInUser.id;
    },
    isLiked: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const ok = await client.like.findUnique({
        where: {
          photoId_userId: {
            photoId: id,
            userId: loggedInUser.id,
          },
        },
        select: {
          id: true,
        },
      });
      if (ok) {
        return true;
      }
      return false;
    },
  },
  Hashtag: {
    photos: ({ id }, { page }, { loggedInUser }) => {
      return client.hashtag.findUnique({ where: { id } }).photos();
    },

    totalPhotos: ({ id }) => {
      return client.photo.count({
        where: { hashtags: { some: { id } } },
      });
    },
  },
};
