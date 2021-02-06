const {get_place} = require('./Regions-Functions')
const {select_id_from} = require('../General-Functions/General-Functions')

const region_exists_next = (req, res, next) => {
    let {id_region} = req.body;
    if(id_region){
        select_id_from('REGIONS', id_region)
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
    let {table} = req.body;
    let {id_country, id_region} = req.query;
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
    let {id_country} = req.query;
    if(id_country){
        select_id_from('COUNTRIES', id_country)
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