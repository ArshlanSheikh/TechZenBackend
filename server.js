import app from './app.js'


const Port = 5000

app.listen(Port,()=>{
    console.log(`Backend is running on http://${Port}`)
})