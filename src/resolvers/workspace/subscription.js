const { withFilter } = require("graphql-subscriptions");

let pubsub;
class Subscriptions {
    constructor(_, repositories, subscription) {
        pubsub = subscription;
    }

    Subscription = {
        invitationListener: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('invitationListener'),
                async (payload, _, { currentUser }) => {
                    return currentUser && currentUser.id === payload.user.id;
                },
            ),
        },
    };
}

module.exports = { Subscriptions };