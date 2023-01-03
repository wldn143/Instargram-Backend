import client from "../client";

export default {
  Room: {
    users: ({ id }) =>
      client.room
        .findUnique({
          where: {
            id,
          },
        })
        .users(),
    messages: ({ id }) =>
      client.message.findMany({
        where: { roomId: id },
      }),
    unreadTotal: ({ id }, _, { loggedInUser }) => {
      //내가 보낸게 아닌 메세지 중 read가 false인 message의 개수
      if (!loggedInUser) return 0;
      return client.message.count({
        where: {
          roomId: id,
          read: false,
          userId: { not: loggedInUser.id },
        },
      });
    },
  },
};
