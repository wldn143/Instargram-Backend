import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    uploadPhoto: protectedResolver(
      async (_, { file, caption }, { loggedInUser }) => {
        let hashtagObjs = null;
        if (caption) {
          const hashtags = caption.match(/#[\w]+/g);
          if (hashtags) {
            hashtagObjs = hashtags.map((hashtag) => ({
              where: { hashtag },
              create: { hashtag },
            }));
          }
        }

        return client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagObjs != null && {
              hashtags: {
                connectOrCreate: hashtagObjs,
              },
            }),
          },
        });
      }
    ),
  },
};
