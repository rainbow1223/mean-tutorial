import * as mongodb from "mongodb";
import { Employee } from "./employee";

export const collections: {
    employees? : mongodb.Collection<Employee>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("meanStackExample");
    await applySchemaValidation(db);
    console.log("db is connected");
    const employeeCollection = db.collection<Employee>("employees");
    collections.employees = employeeCollection;
}

async function applySchemaValidation(db: mongodb.Db){
    const jsonSchema = {
        $jsonSchema : {
            bsonType : "object",
            required : ["name", "position", "level"],
            additionalProperties: false,
            properties: {
                _id : {},
                name : {
                    bsonType : "string",
                    description : "name feild is required and is a string"
                },
                position : {
                    bsonType : "string",
                    description: "position feild is required and is a string",
                    minLengt: 5
                },
                level: {
                    bsonType: "string",
                    description: "level is required and one of the junior, mid, senior",
                    enum: ["junior", "mid", "senior"],
                },
            },
        },
    };

    await db.command({
        collMod: "employees",
        validator: jsonSchema
    }).catch(
        async (error: mongodb.MongoServerError) => {
            if(error.codeName == 'NamespaceNotFound') {
                await db.createCollection("employees", {validator: jsonSchema});
            }
        }
    );
}
