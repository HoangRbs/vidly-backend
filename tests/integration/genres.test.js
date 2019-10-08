
const request = require('supertest');
//const indexFile = require('../../index');
const {GenreModel} = require('../../models/genre');
const {UserModel} = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('test api/genres',() => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => { 
        server.close();
        await GenreModel.remove(); 
    });
    
    describe('get method',() => {
        it('should return all genres',async () => {
            await GenreModel.insertMany([
                { name: "hoang dep trai"},
                { name: "dang hoang vy"}
            ]);

            const res = await request(server).get('/api/genres');
            expect(200).toBe(res.status);
            expect(res.body.length).toBe(2); 
            expect(res.body.some(genreElem => genreElem.name === 'hoang dep trai')).toBeTruthy();
        })
    });

    describe('get method with id',() => {
        it('should return a valid genre with given id',async () => {
            const genre = new GenreModel({
                name: 'Dao Hien Anh'
            });
            await genre.save();

            const res = await request(server).get('/api/genres/find/' + genre._id);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 with invalid id',async () => {
            const res = await request(server).get('/api/genres/find/1');
            expect(res.status).toBe(404);
        });

        it('should return 404 with valid id but no genre',async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/find/' + id);
            expect(res.status).toBe(404);
        });
    });

    describe('post method ',()=> {
        it('should return 401 if user not logged in (no token created)',async ()=>{
            const res = await request(server).post('/api/genres/create').send({name: 'hoang dep trai'});
            expect(res.status).toBe(401);
        })

        it('should return 400 if genre name is less than 5 ',async ()=>{
            
            const token = new UserModel().generateAuthenToken(); 
            const res = await request(server)
                                .post('/api/genres/create')
                                .set('userToken',token)
                                .send({name: '123'});
            expect(res.status).toBe(400);
        })

        it('should return 400 if genre name is larger than 50 ',async ()=>{
            const name = new Array(55).join('a');
            const token = new UserModel().generateAuthenToken(); 
            const res = await request(server)
                                .post('/api/genres/create')
                                .set('userToken',token)
                                .send({name: name});
            expect(res.status).toBe(400);
        })

        it('should save genre if it is valid ',async ()=>{
            const token = new UserModel().generateAuthenToken(); 
            const res = await request(server)
                                .post('/api/genres/create')
                                .set('userToken',token)
                                .send({name: 'hoang dep trai'});
            const genre = await GenreModel.find({ name: 'hoang dep trai'});
            expect(genre).not.toBeNull();
        })

        it('should save genre if it is valid ',async ()=>{
            const token = new UserModel().generateAuthenToken(); 
            const res = await request(server)
                                .post('/api/genres/create')
                                .set('userToken',token)
                                .send({name: 'hoang dep trai'});
        
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name','hoang dep trai');
        })
    })
});

