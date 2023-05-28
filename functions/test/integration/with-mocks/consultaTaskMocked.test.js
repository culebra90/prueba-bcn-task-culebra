const request = require('supertest');
const { task } = require('../../../index');
const FireStore = require('../../../src/servicesCloud/FireStore');
const consultaTask = require("../../mocks/consultaTask.json")

describe('API Tests', () => {
  it('Consulta de Task por Id', async () => {

    jest.spyOn(FireStore, 'getTaskById').mockImplementation(() => consultaTask.consultaExistente);

    const response = await request(task)
      .get('/task/1685284754689')
      .set('Content-Type', 'application/json')
      .expect(200);    
    
    expect(response.body).toEqual(consultaTask);
    
  }, 600000);  

  it('Consulta de Task por No existe Id', async () => {

    jest.spyOn(FireStore, 'getTaskById').mockImplementation(() => consultaTask.consultaInesixtente);

    const response = await request(task)
      .get('/task/7777777777777')
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(response.body).toEqual({ msg: 'no existe el taskId' });
  }, 600000);  
});
