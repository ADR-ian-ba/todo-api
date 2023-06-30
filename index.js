// express and cors and sessiom
const express = require("express")
const cors = require('cors');

const app = express()
app.use(express.json())
app.use(express.text())
app.use(cors())

// mongoose and data
const { default: mongoose } = require("mongoose")
const UserModel = require("./models/UserModel")
const mongoPass= "BNWsImcKMmUuVAC9"
mongoose.connect(`mongodb+srv://adrianpurnama209:${mongoPass}@cluster0.ujqj9ng.mongodb.net/?retryWrites=true&w=majority`)

// bcrypt password encryption
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10)

// jwt
const jwt = require("jsonwebtoken")
const secretKey = "jwtsecretkey"



app.post("/register", async (req, res) =>{
 const{name, email, password} = req.body
 try{
    const userDoc = await UserModel.create({name, email, password:bcrypt.hashSync(password, salt), todoList: []})
 } catch (e){
    console.log(e)
 }

 res.json("succes")
})

//get todo list when login
app.post("/login", async (req,res)=>{
    const{name, password} = req.body
    const userDoc = await UserModel.findOne({name})

    try{
        const passOk = bcrypt.compareSync(password, userDoc.password)
        if(!passOk){
            return res.json("failed")
    
        }else if(passOk){
            const payload = {
                userName : userDoc.name,
                authorized : true,
            }
    
            const token = jwt.sign(payload, secretKey, {expiresIn : '1h'})
            return res.json({token, username:userDoc.name, authorized:true})
        }
    } catch(error){
        return res.json("failed")
    }
})

app.post("/validateToken", async (req, res)=> {
    const token = req.headers.authorization

    if(token === null){
        return res.json("there is no token")
    }

    jwt.verify(token, secretKey, async (err, decoded)=>{
        if(err){
            return res.json("There is no token")
        }

        const username = decoded.userName
        const authorization = decoded.authorized

        const userDoc = await UserModel.findOne({name : username})
        const getTodo = userDoc.todoList


        return res.json({username, authorization, getTodo})
    })
})

app.post("/addTodo", async (req, res)=> {
    const{todo, username} = req.body

    const userDoc = await UserModel.findOne({name : username})

    const result = await userDoc.updateOne({
        $push: {todoList : {task: todo}}
    })

    const userDocResult = await UserModel.findOne({name : username})

    getTodo = userDocResult.todoList

    res.json(getTodo)
})

app.post("/deleteTodo", async (req, res) => {
    const {id, username} = req.body

    const userDoc = await UserModel.findOne({name: username})
    await userDoc.updateOne(
        {$pull : {todoList: {_id:id}}}
    )

    const userDocResult = await UserModel.findOne({name : username})
    getTodo = userDocResult.todoList

    res.json(getTodo)
})


app.listen(4000)