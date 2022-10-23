require('dotenv').config();
require('./database/mongodb');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require("apollo-server-core");
const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');
const { authService } = require("./authentication");
const { attachmentRepository } = require("./repositories");
const express = require('express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const depthLimit = require('graphql-depth-limit');
const cors = require('cors');
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('./assets'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + `${file.originalname}`;
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

(async function () {
    const app = express();
    const httpServer = createServer(app);
    // also we can do file upload with graphql. 
    app.put('/upload/workspace/attachment', [authService.checkRestToken, upload.single('file')], attachmentRepository.uploadWorkspaceAttachment);
    app.put('/upload/conversation/attachment', [authService.checkRestToken, upload.single('file')], attachmentRepository.uploadConversationAttachment);

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    const server = new ApolloServer({
        schema,
        validationRules: [depthLimit(3)],
        context: async ({ req }) => {
            const currentUser = authService.verifyToken(req ? req.headers.authentication : null);

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
