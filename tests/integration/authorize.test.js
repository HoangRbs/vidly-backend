
//const indexFile = require('../../index');
const {GenreModel} = require('../../models/genre');
const {UserModel} = require('../../models/user');
const request = require('supertest');

let server;

describe('authorize middleware',() => {
    let token;

    beforeEach(() => { 
        server = require('../../index');
        token = new UserModel().generateAuthenToken();
    });

    afterEach(async () => { 
        server.close();
        await GenreModel.remove(); 
    });

    const reqSendGenre =() => {
        return request(server).post('/api/genres/create')
                              .set('userToken',token)
                              .send({name: 'hoang dep trai'})
    }

    it('should return 401 if no token is provided',async () => {
        token = '';
        const res = await reqSendGenre();
        expect(res.status).toBe(401);
    })

    it('should return 400 if token is invalid',async () => {
        token = 'a';
        const res = await reqSendGenre();
        expect(res.status).toBe(400);
    })

    it('should return 200 if token is valid',async () => {
        const res = await reqSendGenre();
        expect(res.status).toBe(200);
    })
})
