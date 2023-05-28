const request = require('supertest');
const { task } = require('../../../index');

describe('API Tests', () => {
  it('Consulta de Task por Id', async () => {
    const response = await request(task)
      .get('/task/1685248070377')
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(typeof response.body.image1024).toBe("object");
    expect(typeof response.body.image800).toBe("object");
    expect(typeof response.body.path).toBe("string");
    expect(typeof response.body.taskId).toBe("number");
    expect(typeof response.body.timestampFinish).toBe("string");
    expect(typeof response.body.timestampStart).toBe("string");

    expect(typeof response.body.image1024.fechaCreacion).toBe("string");
    expect(typeof response.body.image1024.hash).toBe("string");
    expect(response.body.image1024.size).toBe(1024);
    expect(typeof response.body.image1024.urlDescarga).toBe("string");
    
    expect(typeof response.body.image800.fechaCreacion).toBe("string");
    expect(typeof response.body.image800.hash).toBe("string");
    expect(response.body.image800.size).toBe(800);
    expect(typeof response.body.image800.urlDescarga).toBe("string");
  }, 600000);  

  it('Consulta de Task por No existe Id', async () => {
    const response = await request(task)
      .get('/task/7777777777777')
      .set('Content-Type', 'application/json')
      .expect(200);     

      expect(response.body).toEqual({ msg: 'no existe el taskId' });
    
  }, 600000);  
});
