import { gql } from "apollo-server";

export default gql`
  type Mutation {
    deleteRoom(id: Int!): MutationResponse!
  }
`;
