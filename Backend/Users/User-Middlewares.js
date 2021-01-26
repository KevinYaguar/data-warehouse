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

const {search_user} = require('./Users-Functions')

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

const if_user_exist_next = (req, res, next) => {
    let {email} = req.body;
    search_user(email)
        .then(response => {
            let user = response.find(u => u.email === email)
            if(user){
                return next();
            }else{
                res.status(404).send({
                    status:'404',
                    messege:'User  not found'
                })
            }
        })
}

const user_pass = (req, res, next) => {
    let {email, password} = req.body;
    search_user(email)
        .then(response => {
            let user = response.find(u => u.email === email)
            if(user.password === password){
                next();
            }else{
                res.status(403).send({
                    status:'403 FORBIDDEN',
                    messege:'Password incorrect'
                })
            }
        })
}

module.exports = {
    data_request,
    if_user_exist_next,
    user_pass
}