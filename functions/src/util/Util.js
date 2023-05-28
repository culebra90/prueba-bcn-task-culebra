const fs = require("fs");

class Util {
  static validarEventGet(req, res) {
    console.log("validarEventGet");
    if (req.params.taskId.toString().length!=13) {
      res.status(500).json({msg: "'taskId' invalido"});
      return false;
    }
  }

  static validarEventPost(req, res) {
    console.log("validarEventPost");

    if (!req.body.path) {
      res.status(500).json({msg: "'path' es requerido"});
      return false;
    }

    const path = req.body.path;

    if (this.isImageUrl(path)) {
      if (req.body.saveLocal && process.env.FUNCTIONS_EMULATOR === "true") {
        if (typeof req.body.saveLocal === "boolean") {
          return {path, type: "url", saveLocal: req.body.saveLocal};
        } else {
          res.status(500).json({message: "URL permitida, pero 'saveLocal' debe ser boolean"});
          return false;
        }
      }
      return {path, type: "url"};
    }

    if (this.validarRutaArchivo(path)) {
      const folderSearch = path.split("/")[1];
      console.log("folderSearch => ", folderSearch);
      if (folderSearch === "images") {
        const extFile = path.split(".").pop();
        console.log("extFile", extFile);
        if (["png", "jpg", "jpeg", "gif"].includes(extFile)) {
          if (fs.existsSync("./"+path) && fs.lstatSync("./"+path).isFile()) {
            if (req.body.saveLocal && process.env.FUNCTIONS_EMULATOR === "true") {
              if (typeof req.body.saveLocal === "boolean") {
                return {path, type: "file", saveLocal: req.body.saveLocal};
              } else {
                res.status(500).json({message: "Existe el fichero, pero 'saveLocal' debe ser boolean"});
                return false;
              }
            }
            return {path, type: "file"};
          } else {
            res.status(500).json({message: "No existe el fichero"});
            return false;
          }
        } else {
          res.status(500).json({message: "Formato de imagen no compatible, formatos admitidos: 'png', 'jpg', 'jpeg', 'gif', 'svg'"});
          return false;
        }
      } else {
        res.status(500).json({message: "path local no permitido, debe estar en la carpeta 'images', un ejemplo es: '/images/background-capitole.jpg'"});
        return false;
      }
    }

    res.status(500).json({error: "El valor de 'path' no es una ruta de archivo válida o URL válida de imagen"});
    return false;
  }

  static isImageUrl(url) {
    const regex = /^(http|https):\/\/[^\s/$.?#].[^\s]*\.(jpeg|jpg|gif|png)$/i;
    return regex.test(url);
  }

  static validarRutaArchivo(pathString) {
    const regex = /\/.*\.[^.]+$/;
    return regex.test(pathString);
  }

  static obtenerNameExt(path) {
    const extFile = path.split(".").pop();
    const nameFileExt = path.split("/").pop();
    const nameFile = nameFileExt.split(".").slice(0, -1).join(".");
    return {extFile, nameFile};
  }

  static getFolderOut(path, size) {
    console.log("getFolderOut => ", path);
    const {nameFile} = this.obtenerNameExt(path);
    return `/output/${nameFile}/${size}`;
  }
}

module.exports = Util;
