const Sequelize = require('sequelize');
const db_data = require('../db_connection_data');
const sequelize = new Sequelize(
    db_data.conf_db_name,
    db_data.conf_user,
    db_data.conf_password, {
        host: db_data.conf_db_host,
        dialect: 'mysql',
        port: db_data.conf_port,
        dialectOptions: {
            multipleStatements: true
        }
});

async function get_place (nombre, places, column) {
    let result = sequelize.query(`SELECT * FROM ${places} WHERE ${column} = ?`, {replacements: [nombre], type: sequelize.QueryTypes.SELECT})

    return result;
}

const region_exists_next = (req, res, next) => {
    let {id_region} = req.body;
    if(id_region){
        sequelize.query(`SELECT * FROM REGIONS WHERE id = ${id_region}`, {type: sequelize.QueryTypes.SELECT})
        .then(response => {
            console.log(response)
            if(response.length === 0){
                res.status(404).send({
                    status: 404, 
                    messege: 'Region not found'
                })
            } else {
                next();
            }
        })
    } else{
        next();
    }
}

const data_request_places = (req, res, next) => {
    let {id_country, id_region, table} = req.body;
    if(table === 'COUNTRIES'){
        if(id_region && id_region > 0){
            next();
        } else{
            res.status(401).send({
                status: 401,
                messege:'You need id_region > 0 to insert a country'
            })
        }
    } else if(table === 'CITIES'){
        if(id_country && id_region > 0){
            next();
        } else{
            res.status(401).send({
                status: 401,
                messege:'You need id_country > 0 to insert a city'
            })
        }
    } else if(table === 'REGIONS'){
        next();
    } 
}



const country_exists_next = (req, res, next) => {
    let {id_country} = req.body;
    if(id_country){
        sequelize.query(`SELECT * FROM COUNTRIES WHERE id = ${id_country}`, {type: sequelize.QueryTypes.SELECT})
        .then(response => {
            console.log(response)
            if(response.length === 0){
                res.status(404).send({
                    status: 404, 
                    messege: 'Country not found'
                })
            } else {
                next();
            }
        })
    } else{
        next();
    }
    
}

function get_column(table) {
    if(table === 'REGIONS'){
        return 'region'
    } else if(table === 'COUNTRIES'){
        return 'country'
    } else if(table === 'CITIES'){
        return 'city'
    } 
}

const if_exits_reject = (req, res, next) => {

    let{place, table} = req.body;
    
    let column = get_column(table)

    get_place(place, table, column) 
        .then(response=>{
            if(response.length === 0){
                next();
            } else {
                res.status(400).send({
                    status: 400, 
                    messege: `${place} already exists`
                })
            }
        })
}

const check_table = (req, res, next) => {
    let {table} = req.body;
    if(table === 'REGIONS' || table === 'COUNTRIES' || table === 'CITIES'){
        next();
    } else {
        res.status(401).send({
            status:401,
            messege:'/table/ only admits REGIONS or COUNTRIES or CITIES'
        })
    }
}

module.exports = {
    if_exits_reject,
    region_exists_next,
    country_exists_next,
    data_request_places,
    check_table
}