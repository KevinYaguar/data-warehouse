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

async function insert_company(name, adress, telephone, email, city){
    
    let result = sequelize.query(`INSERT INTO COMPANIES (id, name, adress, telephone, email, city) VALUES ("NULL", ?, ?, ?, ?, ?)`, {replacements: [name, adress, telephone, email, city]})
    return result;
}


module.exports = {
    insert_company
}