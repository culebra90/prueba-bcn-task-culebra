const admin = require("firebase-admin");
const Util = require("./../util/Util");
const serviceAccount = require("./../../.credentials/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${process.env.PROJECT_ID}.appspot.com`
});

class CloudStorage {
  static async uploadFile(image, object, size) {
    try {
      const bucket = admin.storage().bucket();
      const folderOut = Util.getFolderOut(object.path, size);
      const {extFile} = Util.obtenerNameExt(object.path);
      const rutaArchivo = `${folderOut}/${image.hash}.${extFile}`;

      await bucket.file(rutaArchivo).save(image.processedData, {
        metadata: {
          contentType: `image/${extFile}`,
        },
        public: true,
      });

      console.log("Archivo subido exitosamente.");
      const fechaCreacion = new Date().toISOString();
      const urlDescarga = `https://storage.googleapis.com/${bucket.name}${rutaArchivo}`;
      return {status: "ok", date: fechaCreacion, urlDescarga};
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      throw error;
    }
  }
}

module.exports = CloudStorage;
