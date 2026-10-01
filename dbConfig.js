// import mongoose from "mongoose";



// const ConnectDB = async ()=>{
//     try{
//         console.log('Trying to connect mongodb....')
//         const connect = await  mongoose.connect(process.env.MONGO_DB)
//         console.log('✅Mongodb connected successfully....')
//     }
//     catch(error){
//         console.log('❌failed to connect mongodb...',error)
//     }
// }


// export default ConnectDB;




import mongoose from "mongoose";

let isConnected = false;

const ConnectDB = async () => {
  if (isConnected) {
    console.log("=> using cached MongoDB connection");
    return;
  }
  try {
    console.log("Trying to connect mongodb....");
    console.log("MONGO_DB exists?", !!process.env.MONGO_DB);
    const conn = await mongoose.connect(process.env.MONGO_DB);
    isConnected = conn.connections[0].readyState;
    console.log("✅ Mongodb connected successfully....");
  } catch (error) {
    console.log("❌ failed to connect mongodb...", error);
    throw error; // so middleware can catch and return 500 cleanly
  }
};

export default ConnectDB;




