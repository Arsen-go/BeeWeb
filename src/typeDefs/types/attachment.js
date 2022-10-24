const { gql } = require("apollo-server");

const attachment = gql`
  type Attachment {
    id: String!
    contentType: String
    owner: User
    createdAt: Date
  }
`;

module.exports = {
    attachment,
};
