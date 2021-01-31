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

async function insert_company(nombre, direccion, telefono, email, id_ciudad){
    
    let result = sequelize.query(`INSERT INTO COMPAÑÍAS (id, nombre, dirección, telefono, email, id_ciudad) VALUES ("NULL", ?, ?, ?, ?, ?)`, {replacements: [nombre, direccion, telefono, email, id_ciudad]})
    return result;
}

module.exports = {
    insert_company
}