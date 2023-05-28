const admin = require("firebase-admin");
const functions = require('firebase-functions');
const { defineInt, defineString } = require('firebase-functions/params');
const collectionDb = process.env.COLLECT_DB;
class FireStore {   

  static async insertTask(jsonData){
    try{     
      const collectionRef = admin.firestore().collection(collectionDb);
      return collectionRef
        .doc(jsonData.taskId.toString()) 
        .set(jsonData)
        .then((res) => {
          console.log('Objeto JSON agregado correctamente a Firestore => ', res);
          return res;
        })
        .catch((error) => {
          console.error('Error al agregar el objeto JSON a Firestore:', error);
          return error;
        });
    }catch(error){
      console.error('Error al agregar el objeto JSON a Firestore:', error);
      return error;
    }    
  }

  static async getTaskById(taskId){
    try {
      const collectionRef = admin.firestore().collection(collectionDb);
      const docRef = collectionRef.doc(taskId);
      const snapshot = await docRef.get();
    
      if (snapshot.exists) {
        const documentData = snapshot.data();
        console.log('Documento encontrado:', documentData);
        return documentData;
      } else {
        console.log('El documento no existe.');
        return {msg: 'no existe el taskId'}
      }
    } catch (error) {
      console.error('Error al obtener el documento:', error);
      return error;
    }
  }
}

module.exports = FireStore;