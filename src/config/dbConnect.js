import { connect } from "mongoose";
const dbConnect = async () => {
    try {
        console.log("Connection String:", process.env.CONNECTION_STRING);
       const mongoDbConnection = await connect(process.env.CONNECTION_STRING);
       console.log(`Database connected : ${mongoDbConnection.connection.host}`); 
    } catch (error) {
        console.log(`DataBase Connection failed ${error}`);
        process.exit(1);
    }
};

export default dbConnect;