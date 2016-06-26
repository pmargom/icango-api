var express = require('express'),
    utils = require('./utils');

module.exports = function() {
    var router = express.Router();
     
    router.post('/', function(req, res, next) {
        var query = {
            sql: 'SELECT email, firstName, lastName, photoUrl, searchPreferences, status, deleted FROM users\
                  WHERE email=@email AND password=@password',
            parameters: [
                { name: 'email', value: req.body.email }, 
                { name: 'password', value: utils.md5(req.body.password) }      
            ]
        };
        
        req.azureMobile.data.execute(query)
        .then(function (results) {
            res.json({ data: results[0] });
        })
        .catch(function (err) {
           res.json(400, err);
        });
    });
    
    return router;
};
