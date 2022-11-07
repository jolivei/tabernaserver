/* require('dotenv').config()

const {initializeApp,applicationDefault}=require('firebase-admin/app')
const db= initializeApp({
   credential: applicationDefault()
}) */
 const admin = require('firebase-admin');
 const path = require('path');
require('dotenv').config()


/* const serviceAccount = require('./hostelgestion-6d379-firebase-adminsdk-aiof2-22839eb458.json')
const ruta=path.join(__dirname,'hostelgestion-6d379-firebase-adminsdk-aiof2-22839eb458.json')
console.log(process.env.FIREBASE_PROJECT_ID,'ooooo'); */
admin.initializeApp({
    //credential: admin.credential.cert(ruta)
   credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
});
const db = admin//.firestore();
//const fire = admin.auth(); 
module.exports= db;
