const { describe, it } = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const url = `http://localhost:3333/graphql`;
const request = require('supertest')(url);
// Change test token it may be fail
const testToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsImlkIjoidXNfMjI0emd0c2w5bng5NHNjIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE2NjY2ODUwNjIsImV4cCI6MTY2NjcyMTA2Mn0.zNAl6s31bwWPvtO3grnrsfJIKf2c-9wXuB5BzYSRhZA";

chai.should();

describe('GraphQL', () => {
    const testEmail = "some@gmail.com"; // email for unit test
    it('Send code to email and return string', async () => {
        const res = await request.post('/').set('authentication', testToken)
            .send({
                query: `mutation{ verifyEmail (email: "${testEmail}") }`
            });
        const body = JSON.parse(res.text);
        expect(body.data.verifyEmail).to.be.a('string');
    });

    it('Create user will return token', async () => {
        const res = await request.post('/').set('authentication', testToken)
        .send({
            query: `mutation{ createUser (user: { email: "${testEmail}", password:"user1", fullName:"user" }){authToken} }`
        });
        const body = JSON.parse(res.text);
        expect(body.data).to.be.an('object');
        expect(body.data.createUser).to.have.property('authToken');
    });

    it('Returns current user', async () => {
        const res = await request.post('/').set('authentication', testToken)
            .send({ query: '{ me { id, email } }' });
        const body = JSON.parse(res.text);
        expect(body.data.me).to.have.property('id');
        expect(body.data.me).to.have.property('email');
    });

    // .
    // .
    // .
});