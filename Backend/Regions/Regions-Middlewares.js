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
    sequelize.query(`SELECT * FROM REGIONES WHERE id = ${id_region}`, {type: sequelize.QueryTypes.SELECT})
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
}

const country_exists_next = (req, res, next) => {
    let {id_pais} = req.body;
    sequelize.query(`SELECT * FROM PAISES WHERE id = ${id_pais}`, {type: sequelize.QueryTypes.SELECT})
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
}

const if_exits_reject = (req, res, next) => {
    let {region} = req.body;
    let {country} = req.body;
    let {city} = req.body;

    if(region){
        get_place(region, 'REGIONES', 'region') 
        .then(response=>{
            if(response.length === 0){
                next();
            } else {
                res.status(400).send({
                    status: 400, 
                    messege: `${region} already exists`
                })
            }
        })
    } else if(country){
        get_place(country, 'PAISES', 'pais') 
        .then(response=>{
            if(response.length === 0){
                next();
            } else {
                res.status(400).send({
                    status: 400, 
                    messege: `${country} already exists`
                })
            }
        })
    }else if(city){
        get_place(city, 'CIUDADES', 'ciudad') 
        .then(response=>{
            if(response.length === 0){
                next();
            } else {
                res.status(400).send({
                    status: 400, 
                    messege: `${city} already exists`
                })
            }
        })
    }
}

module.exports = {
    if_exits_reject,
    region_exists_next,
    country_exists_next
}