const request = require('supertest')
const app = require('./app2')

describe('get Endpoints', () => {
    it('should get letters', async () => {
        const res = await request(app)
            .get('/letter')
        expect(res.statusCode).toEqual(200)
        
        
    })
})