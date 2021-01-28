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

const {insertUser, search_user, get_users_list, update_user, delete_user} = require('./Users/Users-Functions');

const {data_request, if_user_exist_next, user_pass, check_rol} = require('./Users/User-Middlewares');

const { inser_region, get_all_regions, inser_country, get_all_countries, insert_city, get_all_cities} = require('./Regions/Regions-Functions')

app.use(expressjwt({secret: jwtClave, algorithms:['sha1', 'RS256', 'HS256']}).unless({ path: ['/login']}));

app.post('/create_user', check_rol, (req, res)=>{
    let {nombre, apellido, email, perfil, password} = req.body;

    insertUser(nombre, apellido, email, perfil, password)
        .then(response => {
            res.status(200).send({
                status:'ok', 
                messege:'usuario agregado con exito'
            })
        }).catch(e=> console.log(e))
})

app.post('/login', data_request, if_user_exist_next, user_pass, (req, res)=>{
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

app.get('/users_list', check_rol, (req, res)=>{
    get_users_list()
        .then(response => {
            res.status(200).send(response)
        })
})

app.put('/alter_user', check_rol, if_user_exist_next, (req, res) => {
    let {email, field, new_value} = req.body;
    update_user(email, field, new_value)
        .then(response => {
            res.status(200).send({
                status:200,
                messege: 'User Updated successfully'
            })
        })
})

app.delete('/delete_user', check_rol, if_user_exist_next, (req, res)=>{
    let {email} = req.body;
    delete_user(email)
        .then(response => {
            res.status(200).send({
                status:200,
                messege:'User deleted succesfully'
            })
        })
})

////////////////////////////// REGION CIUDAD ////////////////////////////

app.post('/inser_region', check_rol, (req, res) => {
    let {region} = req.body;
    inser_region(region)
        .then(response => {
            res.status(200).send({
                status:'OK', 
                messege: 'Region added successfully'
            })
        })
})

app.get('/regions', check_rol, (req, res) => {
    get_all_regions()
        .then(response => {
            res.status(200).send(response)
        })
})

app.post('/inser_country', check_rol, (req, res) => {
    let {country, id_region} = req.body;
    inser_country(country, id_region)
        .then(response => {
            res.status(200).send({
                status:'OK', 
                messege: 'Country added successfully'
            })
        })
})

app.get('/countries', check_rol, (req, res) => {
    get_all_countries()
        .then(response => {
            res.status(200).send(response)
        })
})

app.post('/insert_city', check_rol, (req, res) => {
    let {nombre, id_region, id_pais} = req.body;
    insert_city(nombre, id_region, id_pais)
        .then(response => {
            res.status(200).send({
                status: 200,
                messege:'City added successfully'
            })
        })
})

app.get('/cities', check_rol, (req, res) => {
    get_all_cities()
        .then(response => {
            res.status(200).send(response)
        })
})

///////////////////////////////////
app.listen(process.env.SERVER_PORT, (req, res) => {
    console.log(`Servidor corriendo en el puerto ${process.env.SERVER_PORT}`)
})

app.use((err, req, res, next) =>{
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