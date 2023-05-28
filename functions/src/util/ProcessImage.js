const fs = require("fs");
const client = require("https");
const crypto = require("crypto");
const sharp = require("sharp");
const Util = require("./Util");
const CloudStorage = require("../servicesCloud/CloudStorage");

class ProcessImage {
  static async descargarImagen(uri) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      client.get(uri, (res) => {
        if (res.statusCode === 200 && res.headers["content-type"].startsWith("image/")) {
          res.on("data", (chunk) => {
            chunks.push(chunk);
          });

          res.on("end", () => {
            const buffer = Buffer.concat(chunks);
            resolve(buffer);
          });

          res.on("error", (error) => {
            reject(error);
          });
        } else {
          res.resume();
          reject({error: "not_found"});
        }
      });
    });
  }

  static async resizeAndUpload(object, size) {
    const image = await this.resizeImage(object, size);
    const cloud = await CloudStorage.uploadFile(image, object, size);
    return {fechaCreacion: cloud.date, hash: image.hash, size, urlDescarga: cloud.urlDescarga};
  }

  static async resizeAndSaveLocal(object, size) {
    const image = await this.resizeImage(object, size);
    const local = await this.saveLocal(image, object, size);
    return {fechaCreacion: local.date, hash: image.hash, size, pathFolder: local.pathFolder};
  }

  static async resizeImage(object, size) {
    try {
      const processedData = await sharp(object.imagenBuffer)
          .resize(size, null)
          .withMetadata(true)
          .toBuffer();
      const hash = crypto.createHash("md5").update(processedData).digest("hex");
      return {hash, processedData};
    } catch (error) {
      console.error("Error al procesar la imagen:", error);
      throw error;
    }
  }

  static async saveLocal(image, object, size) {
    console.log(object);
    try {
      const folderOut = "./.."+Util.getFolderOut(object.path, size);
      if (!fs.existsSync(folderOut)) {
        fs.mkdirSync(folderOut, {recursive: true});
      }
      const {extFile} = Util.obtenerNameExt(object.path);
      console.log("extFile => ", extFile);
      const nameFile = `${image.hash}.${extFile}`;
      const pathFolder = `${folderOut}/${nameFile}`;
      console.log("pathFolder => ", pathFolder);
      return new Promise((resolve, reject) => {
        fs.writeFile(pathFolder, image.processedData, (err) => {
          if (err) {
            console.error(err);
            reject({"status": "error", "msg": err});
          } else {
            resolve({"status": "ok", "date": new Date().toISOString(), "pathFolder": pathFolder.replace("./..", "")});
          }
        });
      });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = ProcessImage;
