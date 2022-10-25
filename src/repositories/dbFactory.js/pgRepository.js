// This class and the functions will work the same way get some data do some action and return the same types that mongo does
// this isn't finished fully 
// create and get functions are finished
const { db } = require("../../database");
const uniqid = require("uniqid");

class PgRepository {
    async createUser(user) {
        user.id = `pg_us_${uniqid()}`;
        const text = `
          INSERT INTO "user" (id, fullName, password, email, role)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, fullName, password, email, role
        `;
        const values = [user.id, user.fullName, user.password, user.email, "USER"];
        const result = await db.query(text, values);
        return result.rows[0];
    }

    async getUser(findBy, selectedFields) {
        const select = this.#getSelectQuery(selectedFields);
        const text = `SELECT ${select} FROM "user" WHERE id = $1 or email = $2 or fullName = $3`;
        const values = [
            findBy.id,
            findBy.email,
            findBy.fullName
        ];
        const result = await db.query(text, values);
        return result.rows.length ? result.rows[0] : null;
    }

    async createEmailToken(token) {
        const text = `
          INSERT INTO "emailToken" (code, email)
          VALUES ($1, $2)
          RETURNING code, email
        `;
        const values = [token.code, token.email];
        const result = await db.query(text, values);
        return result.rows.length ? result.rows[0] : null;
    }

    async getEmailToken(findBy) {
        const text = `SELECT * FROM "emailToken" WHERE email = $1 and code = $2`;
        const values = [
            findBy.email,
            findBy.code,
        ];
        const result = await db.query(text, values);
        return result.rows.length ? result.rows[0] : null;
    }

    async deleteEmailToken(findBy) {
        const text = `DELETE FROM "emailToken" WHERE email = $1 and code = $2;`;
        const values = [
            findBy.email,
            findBy.code,
        ];
        await db.query(text, values);
    }

    async comparePassword(user, inputPassword) {
        const text = `SELECT * FROM "user" WHERE email = $1 and password = $2;`;
        const values = [
            user.email,
            inputPassword,
        ];
        const result = await db.query(text, values);
        return result.rows.length ? result.rows[0] : null;
    }

    async createWorkspace(workspace) {
        workspace.id = `pg_ws_${uniqid()}`;
        const text = `
          INSERT INTO "workspace" (id, name, slag, owner)
          VALUES ($1, $2, $3, $4)
          RETURNING _id, id, name, slag, owner
        `;
        const values = [workspace.id, workspace.name, workspace.slag, workspace.owner];
        const result = await db.query(text, values);
        return result.rows.length ? result.rows[0] : null;
    }

    async getWorkspace(findBy, selectedFields) {
        const select = this.#getSelectQuery(selectedFields);
        const text = `SELECT ${select} FROM "workspace" WHERE id = $1 or name = $2 or slag = $3`;
        const values = [
            findBy.id,
            findBy.name,
            findBy.slag
        ];
        const result = await db.query(text, values);
        return result.rows.length ? result.rows[0] : null;
    }

    async createConversation(conversation) {
        conversation.id = `pg_cv_${uniqid()}`;
        const text = `
          INSERT INTO "conversation" (id, name, workspace, owner)
          VALUES ($1, $2, $3, $4)
          RETURNING _id, id, name, workspace, owner
        `;
        const values = [conversation.id, conversation.name, conversation.workspace, conversation.owner];
        const result = await db.query(text, values);
        return result.rows.length ? result.rows[0] : null;
    }

    async createInvite(invite) {
        try {
            invite.id = `pg_inv_${uniqid()}`;
            const text = `
              INSERT INTO "invite" ("from", "to", inviteType, conversation, workspace)
              VALUES ($1, $2, $3, $4, $5)
              RETURNING "from", "to", inviteType, conversation, workspace
            `;
            const values = [invite.from, invite.to, invite.inviteType, invite.conversation, invite.workspace];
            const result = await db.query(text, values);
            return result.rows.length ? result.rows[0] : null;
        } catch (error) {
            console.log(error)
        }
    }

    async getInvite(findBy, selectedFields) {
        const select = this.#getSelectQuery(selectedFields);
        const text = `SELECT ${select}, "user".* FROM "invite" inner join "user" on "user"._id = "invite".from WHERE "from" = $1 or "to" = $2 or inviteType = $3 or workspace = $4 or conversation = $5;`;
        const values = [
            findBy.from,
            findBy.to,
            findBy.inviteType,
            findBy.workspace,
            findBy.conversation
        ];
        const result = await db.query(text, values);
        return result.rows.length ? result.rows[0] : null;
    }

    async getWorkspaces(findBy, selectedFields, options = { limit: 10, skip: 0 }) {
        const text = `SELECT "workspace".* FROM "user"  
                            inner join "workspace" on "workspace".owner = "user"._id WHERE "user"._id = $1 LIMIT ${options.limit} OFFSET ${options.skip};`;
        const values = [options.currentUser._id];
        const result = await db.query(text, values);
        return result.rows;  //returned type must be changed to be like mongodb(graphql) types 
    }

    #getSelectQuery(selectedFields = {}) {
        let select = "";
        const keys = Object.keys(selectedFields);
        keys.forEach((k, i) => {
            if (k == "salt") return; //the reason is mongodb and postgresql difference
            if (i == keys.length - 1) {
                select += k;
            } else {
                select += k + ", ";
            }
        });
        return select.length ? select : "*";
    }
}


module.exports = PgRepository;