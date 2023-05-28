const request = require('supertest');
const { task } = require('../../../index');

describe('API Tests', () => {
  it('Procesar OK Imagenes por URL y subirlas a la nube', async () => {
    const response = await request(task)
      .post('/task')
      .set('Content-Type', 'application/json')
      .send({ path: 'https://capitole-consulting.com/wp-content/uploads/2019/08/2.jpg' })
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

  it('Procesar OK Imagenes por URL y guardaralas en la carpeta output - en local', async () => {

    process.env.FUNCTIONS_EMULATOR = 'true';

    const response = await request(task)
      .post('/task')
      .set('Content-Type', 'application/json')
      .send({ path: 'https://capitole-consulting.com/wp-content/uploads/2019/08/2.jpg', saveLocal: true })
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
    expect(typeof response.body.image1024.pathFolder).toBe("string");
    
    expect(typeof response.body.image800.fechaCreacion).toBe("string");
    expect(typeof response.body.image800.hash).toBe("string");
    expect(response.body.image800.size).toBe(800);
    expect(typeof response.body.image800.pathFolder).toBe("string");
  }, 600000);

  it('Procesar OK Imagenes por URL y guardaralas en la carpeta output - en nube', async () => {

    process.env.FUNCTIONS_EMULATOR = 'false';

    const response = await request(task)
      .post('/task')
      .set('Content-Type', 'application/json')
      .send({ path: 'https://capitole-consulting.com/wp-content/uploads/2019/08/2.jpg', saveLocal: true })
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
});
