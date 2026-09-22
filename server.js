import app from './app.js'
import ConnectDB from './dbConfig.js'


const Port = 5000

ConnectDB()

app.listen(Port,()=>{
    console.log(`Backend is running on http://localhost:${Port}/`)
})