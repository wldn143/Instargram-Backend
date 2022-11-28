import client from "../../client";
import bcrypt from "bcrypt";
export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      const existingUser = await client.user.findFirst({
        where: { OR: [{ username }, { email }] },
      });
      if (!existingUser) {
        return {
          ok: false,
          error: "This username/email is already taken.",
        };
      }
      const uglyPassword = await bcrypt.hash(password, 10);
      if (uglyPassword) {
        client.user.create({
          data: {
            firstName,
            lastName,
            username,
            email,
            password: uglyPassword,
          },
        });
        return {
          ok: true,
        };
      }
    },
  },
};
