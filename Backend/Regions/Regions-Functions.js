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

async function insert_place(table, place, id_region, id_country){
    
    if(table === 'REGIONS'){
        let result = sequelize.query(`INSERT INTO REGIONS (id, region) VALUES ('NULL', ?)`, {replacements: [place]})
        return result;
    } else if(table === 'COUNTRIES'){
        let result = sequelize.query(`INSERT INTO COUNTRIES (id, country, id_region) VALUES ('NULL', ?, ?)`, {replacements: [place, id_region]})
        return result;
    } else if(table === 'CITIES'){
        let result = sequelize.query(`INSERT INTO CITIES (id, city, id_region, id_country) VALUES ('NULL', ?, ?, ?)`, {replacements: [place, id_region, id_country]})
        return result;
    }
}




async function get_cities_from(id, places, place) {
    let result = sequelize.query(`SELECT CITIES.id, CITIES.city  FROM CITIES JOIN ${places} ON 
    ${places}.id = CITIES.id_${place} WHERE ${places}.id = ${id}`, {type: sequelize.QueryTypes.SELECT})

    return result;
}

async function get_place (nombre, places, column) {
    let result = sequelize.query(`SELECT * FROM ${places} WHERE ${column} = ?`, {replacements: [nombre], type: sequelize.QueryTypes.SELECT})

    return result;
}


module.exports = {
    get_cities_from,
    insert_place,
    get_place
}