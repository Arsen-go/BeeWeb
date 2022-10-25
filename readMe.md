<h1>Used in the app</h1>
<ul>
  <li>NODEJS</li>
  <li>GRAPHQL
    <ul>
      <li>Apollo</li>
      <li>Express</li>
    </ul>
  </li>
    <li>Database
    <ul>
      <li>MongoDb</li>
      <li>PostgreSql</li>
    </ul>
  </li>
  <li>Other
    <ul>
      <li>Node mailer (for registering and invitation(also used graphql subscription for this))</li>
      <li>Database Transaction (only with mongodb)</li>
      <li>EsLint rules  (for clean code)</li>
      <li>Winston (for logging)</li>
      <li>i18n (for localization)</li>
      <li>Testing
          <ul>
            <li>Mocha</li>
            <li>Chai</li>
           </ul>
      </li>
    </ul>
  </li>
</ul>  

<h2>Start app with</h2>
<ul>
  <li>cd app folder</li>
  <li>npm i</li>
  <li>create .env file</li>
  <li>select db type</li>
  <li>start server.js file</li>
  <li>open http://localhost:3333/graphql</li>
  <li>set header inside playground {
                        "authentication": "Bearer e..."
                     }
  </li>
  <li>(app can has mongodb transaction error something like ts_?? it must be installed )</li>
</ul> 

<h1>MongoDb collections are in the /models folder i used Object Data Model _ Mongoose to implement</h1>
<table>
    <h1>Here is the PostgreSql tables</h1>
    <tr>
        <th scope="col">Table Name</th>
        <th scope="col">Query</th>
    </tr>
    <tr>
        <th scope="col">emailToken</th>
        <th >
        CREATE TABLE "emailToken" (
            code VARCHAR(16),
            email VARCHAR(128),   
            created_at TIMESTAMP DEFAULT NOW()
         );
        </th>
    </tr>
    <tr>
        <th scope="col">user</th>
        <th>CREATE TABLE "user" (
	_id SERIAL PRIMARY KEY,
    id VARCHAR(32),
    fullName VARCHAR(128),
    email VARCHAR(128),
    password VARCHAR(128),
    role VARCHAR(32),
    created_at TIMESTAMP DEFAULT NOW()
);</th>
    </tr>
    <tr>
        <th scope="col">workspace</th>
        <th>CREATE TABLE "workspace" (
	_id SERIAL PRIMARY KEY,
    id VARCHAR(32),
    name VARCHAR(128),
    slag VARCHAR(128),
    owner Int,
    created_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT w_owner
      FOREIGN KEY(owner) 
	  REFERENCES "user"(_id)
);</th>
    <tr>
        <th scope="col">workspaceUser</th>
        <th>
CREATE TABLE "workspaceUser" (
	_id SERIAL PRIMARY KEY,
	workspaceId Int,
	userId Int,
	created_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT workspace
     FOREIGN KEY(workspaceId) 
 	  REFERENCES "workspace"(_id),
    CONSTRAINT w_user
     FOREIGN KEY(userId) 
 	  REFERENCES "user"(_id)
)</th>
    </tr>
    <tr>
        <th scope="col">attachment</th>
        <th>CREATE TABLE "attachment" (
	_id SERIAL PRIMARY KEY,
	id VARCHAR(32) UNIQUE,
	referenceId Int,         //  can be conversation, workspace and more
	contentType VARCHAR(64),
	attachmentType VARCHAR(32),
	path VARCHAR(512),
	owner Int,
	created_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT att_owner
     FOREIGN KEY(owner) 
 	  REFERENCES "user"(_id)
)
</th>
    </tr>
        <tr>
        <th scope="col">conversation</th>
        <th>CREATE TABLE "conversation" (
	_id SERIAL PRIMARY KEY,
	id VARCHAR(32) UNIQUE,
	name VARCHAR(128),
	workspace Int,
	owner Int,
	created_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT cv_owner
     FOREIGN KEY(owner) 
 	  REFERENCES "user"(_id),
	CONSTRAINT cv_workspace
     FOREIGN KEY(workspace) 
 	  REFERENCES "workspace"(_id)
)</th>
    </tr>
            <tr>
        <th scope="col">invite</th>
        <th>CREATE TABLE "invite" (
	_id SERIAL PRIMARY KEY,
	"from" Int,
	"to" VARCHAR(128),
	inviteType VARCHAR(32),
	workspace Int,
	conversation Int,
	created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT inv_from
     FOREIGN KEY("from") 
 	  REFERENCES "user"(_id),
	CONSTRAINT ws_invite
     FOREIGN KEY(workspace) 
 	  REFERENCES "workspace"(_id),
    CONSTRAINT cv_invite
     FOREIGN KEY(conversation) 
 	  REFERENCES "conversation"(_id)
)</th>
    </tr>
</table>

<h1>.env file containing</h1>
<p>
    PORT=5555
PG_USER=user
PG_HOST=localhost
PG_PASSWORD=
PG_DATABASE=beeweb
PG_PORT=5432

DB_HOST=localhost
DB_USERNAME=beeweb
DB_PASSWORD=
DB_NAME=beeweb
DB_PORT=27017
DB_ADDRESS=

DATABASE=MONGODB     or you can change to POSTGRESQL

DB_IS_TEST=false     this filed i use for unit testing

PORT=3333
JWT_SECRET=es2im0anush0hayastani0arevaham0barn1em0sirum1
TOKEN_EXPIRES_AFTER=36000000

DEFAULT_LANGUAGE=US

MAIL_ADDRESS=matevosyan2000@gmail.com   keys are created with my gmail

MAILER_CLIENT_ID=410878323469-inbelu48g0jt9cs8qth1rk0bc8fvjffb.apps.googleusercontent.com

MAILER_CLIENT_SECRET=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

MAILER_REFRESH_TOKEN=1//046W5XKIXmmVcCgYIARAAGAQSNwF-L9IrMcLAIauaCuuojn0-niY0Qi9bBQ4wft7_VylUR9DhTWzjMY0XbYzRWaPd3_ltKnnkCUE

MAILER_ACCESS_TOKEN=ya29.a0Aa4xrXOLobMuLEtL5AkhD9itSOcEa1HjJNPR7swjjCvigMu6VDccLl50AVS4fCki8DMagfv4lIlyg9k6kTh_h2pEJswIEkAIq4beuL0f-usGU0rkN5Jx5_scOoNNwQX-bXS8CcMWzz7IeqBSHpvD5bX5YREEaCgYKATASARISFQEjDvL9piFFebClZzd2VcLyHGubsA0163
</p>

<h1 style="color:red;">!Important <h3>Postgres integration is not fully finished</h3></h1>


