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

module.exports = {
    insertUser,
    search_user,
    get_users_list
}