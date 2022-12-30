import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser }) => {
        const oldPhotoHashtags = await client.photo
          .findFirst({
            where: { id, userId: loggedInUser.id },
            //select: { hashtags: true },
          })
          .hashtags({
            select: {
              hashtag: true,
            },
          });

        if (!oldPhotoHashtags) {
          return {
            ok: false,
            error: "Photo not found.",
          };
        }
        await client.photo.update({
          where: {
            id,
          },
          data: {
            caption,
            hashtags: {
              disconnect: oldPhotoHashtags,
              connectOrCreate: processHashtags(caption),
            },
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
