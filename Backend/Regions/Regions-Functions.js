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

async function insert_place(table, place, id_region, id_pais){
    if(table === 'REGIONES'){
        let result = sequelize.query(`INSERT INTO REGIONES (id, region) VALUES ('NULL', ?)`, {replacements: [place]})
        return result;
    } else if(table === 'PAISES'){
        let result = sequelize.query(`INSERT INTO PAISES (id, pais, id_region) VALUES ('NULL', ?, ?)`, {replacements: [place, id_region]})
        return result;
    } else if(table === 'CIUDADES'){
        let result = sequelize.query(`INSERT INTO CIUDADES (id, ciudad, id_region, id_pais) VALUES ('NULL', ?, ?, ?)`, {replacements: [place, id_region, id_pais]})
        return result;
    }
}

async function get_all_regions () {
    let result = sequelize.query(`SELECT * FROM REGIONES`, {type: sequelize.QueryTypes.SELECT})
    return result;
}
async function get_all_countries() {
    let result = sequelize.query(`SELECT * FROM PAISES`, {type: sequelize.QueryTypes.SELECT})
    return result
}
async function get_all_cities() {
    let result = sequelize.query(`SELECT * FROM CIUDADES`, {type: sequelize.QueryTypes.SELECT})
    return result;
}

async function get_all_places(place){
    let result = sequelize.query(`SELECT * FROM ${place}`, {type: sequelize.QueryTypes.SELECT})
    return result;
}


async function get_cities_from(id, places, place) {
    let result = sequelize.query(`SELECT ciudades.id, ciudades.nombre  FROM ciudades JOIN ${places} ON 
    ${places}.id = ciudades.id_${place} WHERE ${places}.id = ${id}`, {type: sequelize.QueryTypes.SELECT})

    return result;
}

module.exports = {
    get_all_regions,
    get_all_countries,
    get_all_cities,
    get_cities_from,
    insert_place,
    get_all_places
}