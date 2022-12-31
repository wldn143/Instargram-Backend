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
