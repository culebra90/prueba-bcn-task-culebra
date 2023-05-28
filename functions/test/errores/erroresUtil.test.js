const request = require('supertest');
const { task } = require('../../index');

describe('API Tests', () => {
  it('enviar vacio', async () => {
    const response = await request(task)
      .post('/task')
      .set('Content-Type', 'application/json')
      .send({})
      .expect(500);

    //console.log("response.body 1 => ", response.body)
    expect(response.body).toEqual({ "msg": "'path' es requerido"});
  }, 600000);
  
  it('enviar URL con saveLocal NO boolean', async () => {

    process.env.FUNCTIONS_EMULATOR = "true"

    const response = await request(task)
      .post('/task')
      .set('Content-Type', 'application/json')
      .send({path:'https://capitole-consulting.com/imagen-test.jpeg', saveLocal: "true"})
      .expect(500);

    //console.log("response.body 2 => ", response.body)
    expect(response.body).toEqual({ message: "URL permitida, pero 'saveLocal' debe ser boolean" });
  }, 600000);
  
  it('enviar path con formato invalido', async () => {
    const response = await request(task)
      .post('/task')
      .set('Content-Type', 'application/json')
      .send({path:'/no-images/casa-arbol.jpg'})
      .expect(500);

    //console.log("response.body 3 => ", response.body)
    expect(response.body).toEqual({ message: "path local no permitido, debe estar en la carpeta 'images', un ejemplo es: '/images/arbol-frutal.jpg'"});
  }, 600000);

  it('enviar path con formato imagen invalida', async () => {
    const response = await request(task)
      .post('/task')
      .set('Content-Type', 'application/json')
      .send({path:'/images/casa-arbol.jpeeg'})
      .expect(500);

    //console.log("response.body 4 => ", response.body)
    expect(response.body).toEqual({ message: "Formato de imagen no compatible, formatos admitidos: 'png', 'jpg', 'jpeg', 'gif', 'svg'"});
  }, 600000);

  it('enviar path con imagen inexistente', async () => {
    const response = await request(task)
      .post('/task')
      .set('Content-Type', 'application/json')
      .send({path:'/images/inexistente.jpeg'})
      .expect(500);

    //console.log("response.body 5 => ", response.body)
    expect(response.body).toEqual({ message: 'No existe el fichero'});
  }, 600000);

  it('enviar path valido con saveLocal string', async () => {
    const response = await request(task)
      .post('/task')
      .set('Content-Type', 'application/json')
      .send({path:'/images/background-capitole.jpg', saveLocal:"true"})
      .expect(500);

    //console.log("response.body 5 => ", response.body)
    expect(response.body).toEqual({ message: "Existe el fichero, pero 'saveLocal' debe ser boolean" });
  }, 600000);
  
  it('enviar path invalido', async () => {
    const response = await request(task)
      .post('/task')
      .set('Content-Type', 'application/json')
      .send({path:'sadasdasdasd'})
      .expect(500);

    //console.log("response.body 6 => ", response.body)
    expect(response.body).toEqual({error: "El valor de 'path' no es una ruta de archivo válida o URL válida de imagen"});
  }, 600000);

  it('enviar taskId invalido', async () => {
    const response = await request(task)
      .get('/task/4545')
      .set('Content-Type', 'application/json')
      .send({path:'sadasdasdasd'})
      .expect(500);

    //console.log("response.body 6 => ", response.body)
    expect(response.body).toEqual({msg:"'taskId' invalido"});
  }, 600000);
  
});
