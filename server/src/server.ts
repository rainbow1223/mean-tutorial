import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import ATLAS_URI from "./key";
import { employeeRouter } from "./employee.routes";

if (!ATLAS_URI) {
   console.error("No ATLAS_URI environment variable has been defined in config.env");
   process.exit(1);
}
 
connectToDatabase(ATLAS_URI)
   .then(() => {
       const app = express();
       app.use(cors());
       app.use("/employees", employeeRouter);
       
       // start the Express server
       app.listen(5200, () => {
           console.log(`Server running at http://localhost:5200...`);
       });
 
   })
   .catch(error => console.error(error));