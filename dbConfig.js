import mongoose from "mongoose";



const ConnectDB = async ()=>{
    try{
        console.log('Trying to connect mongodb....')
        const connect = await  mongoose.connect(process.env.MONGO_DB)
        console.log('✅Mongodb connected successfully....')
    }
    catch(error){
        console.log('❌failed to connect mongodb...',error)
    }
}


export default ConnectDB;