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

async function inser_region(region) {
    let result = sequelize.query(`INSERT INTO REGIONES (id, nombre) VALUES ('NULL', ?)`, {replacements: [region]})

    return result;
}

async function get_all_regions () {
    let result = sequelize.query(`SELECT * FROM REGIONES`, {type: sequelize.QueryTypes.SELECT})

    return result;
}

async function inser_country (country, id_region) {
    let result = sequelize.query(`INSERT INTO PAISES (id, nombre, id_region) VALUES ('NULL', ?, ?)`, {replacements: [country, id_region]})

    return result;
}

async function get_all_countries() {
    let result = sequelize.query(`SELECT * FROM PAISES`, {type: sequelize.QueryTypes.SELECT})

    return result
}

async function insert_city(nombre, id_region, id_pais) {
    let result = sequelize.query(`INSERT INTO CIUDADES (id, nombre, id_region, id_pais) VALUES ('NULL', ?, ?, ?)`, {
        replacements: [nombre, id_region, id_pais]
    })

    return result;
}

async function get_all_cities() {
    let result = sequelize.query(`SELECT * FROM CIUDADES`, {type: sequelize.QueryTypes.SELECT})

    return result;
}

module.exports = {
    inser_region,
    get_all_regions,
    inser_country,
    get_all_countries,
    insert_city,
    get_all_cities
}