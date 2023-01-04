import { withFilter } from "apollo-server-express";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        //룸 존재 여부 (로그인한 유저의 room 중에 args로 요청한 roomId가 존재하는지)
        const room = await client.room.findFirst({
          where: {
            id: args.id,
            users: { some: { id: context.loggedInUser.id } },
          },
          select: { id: true },
        });
        if (!room) {
          throw new Error("You shall not see this.");
        }

        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async ({ roomUpdates }, { id }, { loggedInUser }) => {
            //방금 roomUpdates된 방이 loggedInUser의 방인지 확인
            if (id === roomUpdates.roomId) {
              const room = await client.room.findFirst({
                where: { id, users: { some: { id: loggedInUser.id } } },
                select: { id: true },
              });
              if (room) {
                return true;
              }
            }
            return false;
          }
        )(root, args, context, info);
        //subscription은 함수를 호출해야한다. subscription은 함수의 결과물이다.
      },
    },
  },
};
