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

async function insertUser (name, last_name, email, rol, password){
    let result = sequelize.query('INSERT INTO users (user_id, name, last_name, email, rol, password) VALUES (?, ?, ?, ?, ?, ?)', {
        replacements: ['NULL', name, last_name, email, rol, password]
    })
    return result;
}

async function search_user(email) {
    let result = sequelize.query(`SELECT * FROM users WHERE email = ?`, {
        replacements: [email], type: sequelize.QueryTypes.SELECT
    })
    return result;
}

async function get_users_list (){
    let result = sequelize.query(`SELECT * FROM users`, {
        type: sequelize.QueryTypes.SELECT
    })
    return result;
}

async function update_user (user, field, new_value) {
    let result = sequelize.query(`UPDATE users SET ${field} = ? WHERE email = ?`, {replacements: [ new_value, user]})

    return result;
}

async function delete_user(user) {
    let result = sequelize.query(`DELETE FROM users WHERE email = ?`, {replacements: [user]})

    return result;
}


module.exports = {
    insertUser,
    search_user,
    get_users_list,
    update_user,
    delete_user,
    
}