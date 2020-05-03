require('dotenv').config()
const express = require('express');
const bcrypt = require('bcrypt')
const app = express()
app.use(express.json())

let users = [];

app.get('/users',(req,res)=>{
    res.status(200).send(users)
})

app.post('/users',async(req,res)=>{

    let salt = await bcrypt.genSalt();

    let hashedPassword = await bcrypt.hash(req.body.password,salt)

    let user = {name:req.body.name, password:hashedPassword}

    users.push(user)

    res.status(201).send();
})

app.post('/user/login',async (req,res)=>{

    let user = users.find(user=>user.name == req.body.name);

    if(user == null) return res.send("No user Found")

    try{
        if(await bcrypt.compare(req.body.password,user.password)){
            res.send("Login Successful")
        }else{
            res.status(403).send("Not allowed")
        }
    }catch{
        res.status(500).send()
    }

})

app.listen(3000)
