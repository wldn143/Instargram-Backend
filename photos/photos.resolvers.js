import client from "../client";

export default {
  Photo: {
    user: ({ userId }) => {
      return client.user.findUnique({ where: { id: userId } });
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
