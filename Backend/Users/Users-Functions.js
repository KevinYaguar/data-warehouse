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

async function insertUser (nombre, apellido, email, perfil, password){
    let result = sequelize.query('INSERT INTO usuarios (usuario_id, nombre, apellido, email, perfil, password) VALUES (?, ?, ?, ?, ?, ?)', {
        replacements: ['NULL', nombre, apellido, email, perfil, password]
    })
    return result;
}

async function search_user(email) {
    let result = sequelize.query(`SELECT * FROM usuarios WHERE email = ?`, {
        replacements: [email], type: sequelize.QueryTypes.SELECT
    })
    return result;
}

async function get_users_list (){
    let result = sequelize.query(`SELECT * FROM usuarios`, {
        type: sequelize.QueryTypes.SELECT
    })
    return result;
}

async function update_user (user, field, new_value) {
    let result = sequelize.query(`UPDATE usuarios SET ${field} = ? WHERE email = ?`, {replacements: [ new_value, user]})

    return result;
}

async function delete_user(user) {
    let result = sequelize.query(`DELETE FROM usuarios WHERE email = ?`, {replacements: [user]})

    return result;
}

async function inser_region(region) {
    let result = sequelize.query(`INSERT INTO REGIONES (id, nombre) VALUES ('NULL', ?)`, {replacements: [region]})

    return result;
}

async function get_all_regions () {
    let result = sequelize.query(`SELECT * FROM REGIONES`, {type: sequelize.QueryTypes.SELECT})

    return result;
}

module.exports = {
    insertUser,
    search_user,
    get_users_list,
    update_user,
    delete_user,
    inser_region,
    get_all_regions
}