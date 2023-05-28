const request = require('supertest');
const { task } = require('../../../index');
const ProcessImage = require("../../../src/util/ProcessImage");
const FireStore = require('../../../src/servicesCloud/FireStore');
const CloudStore = require("../../../src/servicesCloud/CloudStorage");
const imageLocalUrl = require("../../mocks/imageLocalUrl.json");

describe('API Tests', () => {

  const buffer = Buffer.alloc(0);

  it('Procesar OK Imagenes por URL y subirlas a la nube', async () => {

    jest.spyOn(ProcessImage, 'descargarImagen').mockImplementation(() => buffer);
    jest.spyOn(ProcessImage, 'resizeImage').mockImplementation(() => imageLocalUrl.resizeImage);
    jest.spyOn(FireStore, 'insertTask').mockImplementation(() => {});
    jest.spyOn(CloudStore, 'uploadFile').mockImplementation(() => imageLocalUrl.uploadFile);

    const response = await request(task)
      .post('/task')
      .set('Content-Type', 'application/json')
      .send({ path: 'https://capitole-consulting.com/imagen-test.jpg' })
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

  it('Procesar OK Imagenes por URL y guardaralas en la carpeta output - local', async () => {

    process.env.FUNCTIONS_EMULATOR = 'true';

    jest.spyOn(ProcessImage, 'descargarImagen').mockImplementation(() => buffer);
    jest.spyOn(ProcessImage, 'resizeImage').mockImplementation(() => imageLocalUrl.resizeImage);
    jest.spyOn(FireStore, 'insertTask').mockImplementation(() => {});
    jest.spyOn(ProcessImage, 'saveLocal').mockImplementation(() => imageLocalUrl.saveLocal);

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

  it('Procesar OK Imagenes por URL y guardaralas en la carpeta output - nube', async () => {

    process.env.FUNCTIONS_EMULATOR = 'false';

    jest.spyOn(ProcessImage, 'descargarImagen').mockImplementation(() => buffer);
    jest.spyOn(ProcessImage, 'resizeImage').mockImplementation(() => imageLocalUrl.resizeImage);
    jest.spyOn(FireStore, 'insertTask').mockImplementation(() => {});
    jest.spyOn(CloudStore, 'uploadFile').mockImplementation(() => imageLocalUrl.uploadFile);

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
