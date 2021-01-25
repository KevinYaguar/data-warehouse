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

const data_request = (req, res, next) => {
    let{email, password} = req.body;

    if(email && password){
        next();
    } else {
        res.status(404).send({
            status:'404 data not found',
            messege: 'You need an email and a password to login'
        })
    }
}

module.exports = {
    data_request
}