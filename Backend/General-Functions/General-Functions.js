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

async function select_all_from(table) {
    let result = sequelize.query(`SELECT * FROM ${table}`, {type: sequelize.QueryTypes.SELECT})
    return result;
}

async function select_id_from(table, id) {
    let result = sequelize.query(`SELECT * FROM ${table} WHERE id = ?`, {type: sequelize.QueryTypes.SELECT, replacements:[id]})
    return result;
}

async function update(id, table, field, new_value){
    let result = sequelize.query(`UPDATE ${table} SET ${field} = ? WHERE id = ?`, {replacements: [new_value, id]})
    return result;
}

async function delete_id_from (id, table) {
    let result = sequelize.query(`DELETE FROM ${table} WHERE id = ?`, {replacements: [id]})
    return result;
}

module.exports = {
    select_all_from,
    update,
    delete_id_from,
    select_id_from
}