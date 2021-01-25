require('dotenv').config();
const express = require('express');
const mysql = require('mysql2')
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const cors = require('cors');

const jwtClave = process.env.CLAVE;

const app = express();
app.use(cors());
app.use(express.json());

const {insertUser, search_user} = require('./Users/Users-Functions');

const {data_request, if_user_exist_next} = require('./Users/User-Middlewares')

app.post('/create_user', (req, res)=>{
    let {nombre, apellido, email, perfil, password} = req.body;

    insertUser(nombre, apellido, email, perfil, password)
        .then(response => {
            res.status(200).send({
                status:'ok', 
                mensaje:'usuario agregado con exito'
            })
        }).catch(e=> console.log(e))
})

app.post('/login', data_request, if_user_exist_next, (req, res)=>{
    let {email} = req.body;
    
    let token = jwt.sign({email: email}, jwtClave);

    res.status(200).send({
        status:'ok',
        messege:'Login successfull',
        token: token
    })

})

app.get('/user_info', (req, res) => {
    let {email} = req.body;

    search_user(email)
        .then(response => {
            res.status(200).send(response)
        })
})


app.listen(process.env.SERVER_PORT, (req, res) => {
    console.log(`Servidor corriendo en el puerto ${process.env.SERVER_PORT}`)
})

app.use((req, res, next, err) =>{
    if(!err){
        next();
    } else{
        console.log(JSON.stringify(err));
        res.status(500).send({
            error:500,
            mensaje:'Ah ocurrido un error inesperado!'
        })
    }
})