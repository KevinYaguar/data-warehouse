const body_complet = (req, res, next) => {
    let {name, adress, telephone, email, city} = req.body;
    if(name, adress, telephone, email, city){
        next();
    } else {
        res.status(401).send({
            status: 'error',
            messege:'Body inclomplet'
        })
    }
}

const {get_place} = require('../Regions/Regions-Functions');

const city_exist = (req, res, next) => {
    let {city} = req.body;
    get_place(city, 'CITIES', 'city')
        .then(response => {
            if(response.length === 0){
                res.status(400).send({
                    status:400,
                    messege:'City not found'
                })
            } else {
                next();
            }
        })
}

module.exports = {
    body_complet,
    city_exist
}

