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

    router.get('/fb', function(req, res, next) {
        req.azureMobile.user.getIdentity("facebook").then((data) => {
            res.status(200).type('application/json').json(data);
        }).catch((error) => {
            res.json({result: "fb result"});
            //res.status(500).send(JSON.stringify(error));
        });
    });
    
    return router;
};
