const { gql } = require("apollo-server");

const token = gql`
  type Token {
    authToken: String
    expiresIn: String
    refreshToken: String
    refreshTokenExpiresAfter: String
  }
`;

module.exports = {
  token,
};
