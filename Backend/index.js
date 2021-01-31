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

//////////////////////////////////////////////////IMPORTACIONES //////////////////////////////////////////////////////
///////USUARIOS//////////////////////////////
const {insertUser, search_user, get_users_list, update_user, delete_user} = require('./Users/Users-Functions');
const {data_request, if_user_exist_next, user_pass, check_rol} = require('./Users/User-Middlewares');
////////////////////////////////////////////
///////REGIONES, CIUDADES, PAISES////////////
const { get_cities_from, insert_place, get_all_places, delete_place, update_place} = require('./Regions/Regions-Functions');
const {if_exits_reject, region_exists_next, country_exists_next, data_request_places, check_table} = require('./Regions/Regions-Middlewares')
/////////////////////////////////////////////
///////COMPAÑIAS/////////////////////////////
const {insert_company} = require('./Companies/Companies-Functions')
//////////////////////////////////////////////

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

////////////////////////////// REGIONES, PAISES Y CIUDADES////////////////////////////

app.post('/insert_place', check_rol, check_table, data_request_places, if_exits_reject,  region_exists_next, country_exists_next, (req, res) => {
    let {place, tabla, id_region, id_pais} = req.body;
    insert_place(tabla, place, id_region, id_pais)
            .then(response => {
                res.status(200).send({
                status:'OK', 
                messege: `${place} added successfully`
                })
            })
})

app.get('/regions', check_rol, (req, res) => {
    get_all_places('REGIONES')
        .then(response => {
            res.status(200).send(response)
        })
})

app.get('/countries', check_rol, (req, res) => {
    get_all_places('PAISES')
        .then(response => {
            res.status(200).send(response)
        })
})

app.get('/cities', check_rol, (req, res) => {
    let id_region = req.query.id_region;
    let id_pais = req.query.id_pais;
    if(id_region){
        get_cities_from(id_region, 'regiones', 'region')
            .then(response=> {
                res.status(200).send(response)
            })
    } else if(id_pais){
        get_cities_from(id_pais, 'paises', 'pais')
            .then(response=> {
                res.status(200).send(response)
            })
    } else{
        get_all_places('CIUDADES')
        .then(response => {
            res.status(200).send(response)
        })
    }
})

app.delete('/delete_places', check_rol, (req, res) => {
    let {id, table} = req.body;

    delete_place(id, table)
        .then(response=> {
            res.status(200).send({
                status: 200,
                messege: `Deleted successfully`
            })
        })
})

app.put('/update_place', (req, res) => {
    let {id, table, field, new_value} = req.body;

    update_place(id, table, field, new_value)
        .then(response => {
            res.status(200).send({
                status:200,
                messege: 'Updated successfully'
            })
        })
})
//////////////////////////////////////    COMPAÑIAS     ///////////////////////////////////////

app.post('/insert_company', check_rol, (req, res) => {
    
    let {nombre, direccion, telefono, email, id_ciudad} = req.body;
    insert_company(nombre, direccion, telefono, email, id_ciudad)
        .then(response => {
            res.status(200).send({
                status:200,
                messege:'Company inserted to database'
            })
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