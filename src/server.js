require('dotenv').config();
require('./db');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require("apollo-server-core");
const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');
const { logger } = require("./logger");
const { authService } = require("./authentication");
const express = require('express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const depthLimit = require('graphql-depth-limit');
const cors = require('cors');

(async function () {
    const app = express();
    const httpServer = createServer(app);

    const verifyToken = async (authToken) => {
        try {
            if (authToken) {
                var { currentUser } = await authService.checkToken(authToken);
            }
            return currentUser;
        } catch (error) {
            logger.warn(`Unable to authenticate using auth token: ${authToken}`);
        }
    }

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    const server = new ApolloServer({
        schema,
        validationRules: [depthLimit(3)],
        context: async ({ req }) => {
            const currentUser = await verifyToken(req ? req.headers.authentication : null);

            return {
                currentUser,
            };
        },
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    });
    await server.start();
    server.applyMiddleware({ app });
    app.use(cors());

    // eslint-disable-next-line no-undef
    const PORT = process.env.PORT;
    httpServer.listen(PORT, () =>
        console.log(`Server is now running on http://localhost:${PORT}/graphql`)
    );
})();
