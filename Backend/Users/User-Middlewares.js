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

const jwt = require('jsonwebtoken');

const jwtClave = process.env.CLAVE;

const {search_user} = require('../Users/Users-Functions')

const data_request_login = (req, res, next) => {
    let{email, password} = req.body;
    console.log(req.body)
    if(email && password){
        next();
    } else {
        res.status(404).send({
            status:'404 data not found',
            messege: 'You need an email and a password to login'
        })
    }
}

const require_email = (req, res, next) => {
    let {email} = req.body;
    if(email){
        next();
    } else {
        res.status(401).send({
            status: 401,
            messege:' Missing data'
        })
    }
}

const data_request_create_user = (req, res, next) => {
    let {name, last_name, email, rol, password} = req.body;

    if(name && last_name && email && rol && password){
        next();
    } else {
        res.status(200).send({
            status:400,
            messege: 'Missing data'
        })
    }
}

const data_request_user_info = (req, res, next) => {
    let {email} = req.query;
    if(email){
        next();
    } else {
        res.status(400).send({
            status:400,
            messege:'Missing data'
        })
    }
}

const rol_correct = (req, res, next) => {
    let {rol} = req.body;
    if(rol === 'Admin' || rol === 'Basic') {
        next();
    }else{
        res.status(401).send({
            status:401,
            messege:'rol only admits Admin or Basic'
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
                    messege:'User not found'
                })
            }
        })
}

const if_user_exist_reject = (req, res, next) => {
    let {email} = req.body;
    search_user(email)
        .then(response => {
            let user = response.find(u => u.email === email)
            if(user){
                res.status(404).send({
                    status:'404',
                    messege:'User already exist'
                })
            }else{
                return next();
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

const check_rol = (req, res, next) => {
    let token = (req.headers.authorization).split(' ')[1];
    let decodificado = jwt.verify(token, jwtClave)
    const user = decodificado.email;
    search_user(user)
        .then(response => {
            let u = response.find(u => u.email === user);
            
            if(u.rol === 'Admin'){
                next();
            } else {
                res.status(403).send({
                    status:'NOT ALLOWED',
                    messege: 'You need to be Admin to do this'
                })
            }
        })
}

module.exports = {
    data_request_login,
    if_user_exist_next,
    user_pass,
    check_rol,
    if_user_exist_reject,
    data_request_create_user,
    rol_correct,
    data_request_user_info,
    require_email
}

