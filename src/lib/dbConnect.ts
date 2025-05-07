import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
dotenv.config();


type ConnectionObject = {
    isConnected?:number
}

// It is not giving error bcz we have kept type as optional otherwise it will give error.
const connection: ConnectionObject = {
   
}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("DB is already Connected");
        return 
    }

    try{

        const connect = await mongoose.connect(process.env.DB_CONNECT_PATH || '');
        
        console.log(connect);

        connection.isConnected = connect.connections[0].readyState;

        console.log("Connection est Successfully");
    }catch(err){
        console.log("DataBase connection Failed",err);
        process.exit(1);
      
    }
}

export default dbConnect;

