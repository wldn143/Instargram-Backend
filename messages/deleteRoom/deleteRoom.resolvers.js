import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    deleteRoom: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const room = await client.room.findFirst({
        where: { id, users: { some: { id: loggedInUser.id } } },
        select: { id: true },
      });
      if (!room) {
        return {
          ok: false,
          error: "Room not found",
        };
      }
      await client.room.delete({
        where: { id },
      });
      return {
        ok: true,
      };
    }),
  },
};
