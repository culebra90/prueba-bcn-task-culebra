const ProcessImage = require("./util/ProcessImage");
const FireStore = require("./servicesCloud/FireStore");

class ServiceTask { //
  static async obtenerTask(taskId) { 
    try {
      console.log("obtenerTask!");
      const resultDb = await FireStore.getTaskById(taskId);
      return resultDb;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async procesarTask(object) { 
    try {
      const timestampStart = Date.now();
      const { type, path } = object;      
      const imagenBuffer = (type === "url")
        ? await ProcessImage.descargarImagen(path)
        : `.${path}`;
      let image1024, image800;
      const objectProcessImage = { ...object, imagenBuffer };

      if(object.saveLocal){
        [image1024, image800] = await Promise.all([
          ProcessImage.resizeAndSaveLocal(objectProcessImage,1024),
          ProcessImage.resizeAndSaveLocal(objectProcessImage,800)
        ]);
      }else{
        [image1024, image800] = await Promise.all([
          ProcessImage.resizeAndUpload(objectProcessImage,1024),
          ProcessImage.resizeAndUpload(objectProcessImage,800)
        ]);    
      }  
      const timestampFinish = new Date().toISOString();
      const jsonData = {
        taskId: timestampStart, 
        timestampStart: new Date(timestampStart).toISOString(), 
        timestampFinish: new Date(timestampFinish).toISOString(),
        path: object.path,
        image1024, 
        image800
      };
      const result = await FireStore.insertTask(jsonData);
      console.log(result)
      return jsonData;      
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
  
module.exports = ServiceTask;