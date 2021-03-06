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

//////////////////////////////////////////////////IMPORTS //////////////////////////////////////////////////////
///////////////////GENERAL////////////
const {select_all_from, update, delete_id_from} = require('./General-Functions/General-Functions')

///////USERS//////////////////////////////
const {insertUser, search_user, update_user, delete_user} = require('./Users/Users-Functions');
const {data_request_login, if_user_exist_next, user_pass, check_rol, if_user_exist_reject, data_request_create_user, rol_correct, data_request_user_info, require_email} = require('./Users/User-Middlewares');
////////////////////////////////////////////

///////REGIONS, CITIES, COUNTRIES////////////
const { get_cities_from, insert_place} = require('./Regions/Regions-Functions');
const {if_exits_reject, region_exists_next, country_exists_next, data_request_places, check_table} = require('./Regions/Regions-Middlewares')
/////////////////////////////////////////////

///////COMPANIES/////////////////////////////
const {insert_company} = require('./Companies/Companies-Functions')
const {body_complet, city_exist} = require('./Companies/Companies-Middlewares')

//////////////////////////////////////////////

app.use(expressjwt({secret: jwtClave, algorithms:['sha1', 'RS256', 'HS256']}).unless({ path: ['/login']}));


app.post('/create_user', check_rol, data_request_create_user, rol_correct, if_user_exist_reject, (req, res)=>{
    let {name, last_name, email, rol, password} = req.body;

    insertUser(name, last_name, email, rol, password)
        .then(response => {
            res.status(200).send({
                status:'ok', 
                messege:'User added successfully'
            })
        }).catch(e=> console.log(e))
})

app.post('/login', data_request_login, if_user_exist_next, user_pass, (req, res)=>{
    let {email} = req.body;
    
    let token = jwt.sign({email: email}, jwtClave);

    res.status(200).send({
        status:'ok',
        messege:'Login successfull',
        token: token
    })

})

app.get('/user_info', data_request_user_info, (req, res) => {
    let {email} = req.query;
    
    search_user(email)
        .then(response => {
            res.status(200).send(response)
        })
})

app.get('/users_list', check_rol, (req, res)=>{
    select_all_from('USERS')
        .then(response => {
            res.status(200).send(response)
        })
})

app.put('/alter_user', check_rol, require_email, if_user_exist_next, (req, res) => {
    let {email, field, new_value} = req.body;
    update_user(email, field, new_value)
        .then(response => {
            res.status(200).send({
                status:200,
                messege: 'User updated successfully'
            })
        })
})

app.delete('/delete_user', check_rol, require_email,if_user_exist_next, (req, res)=>{
    let {email} = req.body;
    delete_user(email)
        .then(response => {
            res.status(200).send({
                status:200,
                messege:'User deleted succesfully'
            })
        })
})

////////////////////////////// REGIONS, COUNTRIES Y CITIES////////////////////////////

app.post('/insert_place', check_rol, check_table, data_request_places, if_exits_reject,  region_exists_next, country_exists_next, (req, res) => {
    let {place, table} = req.body;
    let {id_region, id_country} = req.query;
    insert_place(table, place, id_region, id_country)
            .then(response => {
                res.status(200).send({
                status:'OK', 
                messege: `${place} added successfully`
                })
            })
})

app.get('/regions', check_rol, (req, res) => {
    select_all_from('REGIONS')
        .then(response => {
            res.status(200).send(response)
        })
})

app.get('/countries', check_rol, (req, res) => {
    select_all_from('COUNTRIES')
        .then(response => {
            res.status(200).send(response)
        })
})

app.get('/cities', check_rol, (req, res) => {
    let id_region = req.query.id_region;
    let id_country = req.query.id_country;
    if(id_region){
        get_cities_from(id_region, 'regions', 'region')
            .then(response=> {
                res.status(200).send(response)
            })
    } else if(id_country){
        get_cities_from(id_country, 'countries', 'country')
            .then(response=> {
                res.status(200).send(response)
            })
    } else{
        select_all_from('CITIES')
        .then(response => {
            res.status(200).send(response)
        })
    }
})

app.delete('/delete_places', check_rol, (req, res) => {
    let {id, table} = req.body;

    delete_id_from(id, table)
        .then(response=> {
            res.status(200).send({
                status: 200,
                messege: `Deleted successfully`
            })
        })
})

app.put('/update_place', (req, res) => {
    let {id, table, field, new_value} = req.body;

    update(id, table, field, new_value)
        .then(response => {
            res.status(200).send({
                status:200,
                messege: 'Updated successfully'
            })
        })
})
//////////////////////////////////////    COMPAÑIAS     ///////////////////////////////////////

app.post('/insert_company', check_rol, body_complet, city_exist, (req, res) => {
    
    let {name, adress, telephone, email, city} = req.body;
    insert_company(name, adress, telephone, email, city)
        .then(response => {
            res.status(200).send({
                status:200,
                messege:'Company inserted to database'
            })
        })
})

app.get('/companies', check_rol,(req, res) => {
    select_all_from('COMPANIES')
        .then(response => {
            res.status(200).send(response);
        })
})

app.delete('/delete_company', (req, res) => {
    let {id_company} = req.body;

    delete_id_from(id_company, 'COMPANIES')
        .then(response => {
            res.status(200).send({
                status:200,
                messege:` Company deleted successfully`
            })
        })
})

app.put('/update_company', (req, res) => {
    let {company_id, field, new_value} = req.body;

    update(company_id, 'COMPANIES', field, new_value)
        .then(response => {
            res.status(200).send({
                status: 'ok',
                messege: `Company number ${company_id} updated successfully`
            })
        })
})


///////////////////////////////////
app.listen(process.env.SERVER_PORT, (req, res) => {
    console.log(`Server running on the port ${process.env.SERVER_PORT}`)
})

app.use((err, req, res, next) =>{
    if(!err){
        next();
    } else{
        console.log(JSON.stringify(err));
        res.status(500).send({
            error:500,
            mensaje:'An unexpected error has ocurred!'
        })
        
    }
})

