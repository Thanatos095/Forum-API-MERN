import bson from "bson";
import fs from "fs";
import { deleteDB, loadDB } from "./setup";
loadDB();

// const data = fs.readFileSync('test/test_db.json');
// const obj = JSON.parse(data.toString());

// for(let key in obj){
//   obj[key].forEach((doc : any) => {
//     for(let innerKey in doc){
//       if(innerKey.toLowerCase().endsWith("id")){
//         doc[innerKey] = new bson.ObjectId(doc[innerKey]);
//       }
//     }
//   });
// }
// const bsonData = bson.serialize(obj);


