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
    } else{
        next();
    }
}

const data_request_places = (req, res, next) => {
    let {id_pais, id_region, place, tabla} = req.body;
    if(tabla === 'PAISES'){
        if(id_region && id_region > 0){
            next();
        } else{
            res.status(401).send({
                status: 401,
                messege:'Bad Request1'
            })
        }
    } else if(tabla === 'CIUDADES'){
        if(id_pais && id_region > 0){
            next();
        } else{
            res.status(401).send({
                status: 401,
                messege:'Bad Request2'
            })
        }
    }
}



const country_exists_next = (req, res, next) => {
    let {id_pais} = req.body;
    if(id_pais){
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
    } else{
        next();
    }
    
}

function get_column(tabla) {
    if(tabla === 'REGIONES'){
        return 'region'
    } else if(tabla === 'PAISES'){
        return 'pais'
    } else if(tabla === 'CIUDADES'){
        return 'ciudad'
    } 
}

const if_exits_reject = (req, res, next) => {

    let{place, tabla} = req.body;
    
    let column = get_column(tabla)

    get_place(place, tabla, column) 
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
    let {tabla} = req.body;
    if(tabla === 'REGIONES' || tabla === 'PAISES' || tabla === 'CIUDADES'){
        next();
    } else {
        res.status(401).send({
            status:401,
            messege:'/tabla/ only admits REGIONES or PAISES or CIUDADES'
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