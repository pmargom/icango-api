<<<<<<< HEAD

module.exports = {
    //"get": function (req, res, next) {
    //}
}
=======
var express = require('express');
var utils = require('./utils');

module.exports = function() {
    var router = express.Router();

    // Helper method to get user by email
    function getUserByEmail(db, email, callback) {
        var query = {
            sql: 'SELECT email, firstName, lastName, photoUrl FROM users\
                  WHERE email=@email',
            parameters: [
                { name: 'email', value: email }
            ]
        };
        db.execute(query)
        .then(function (results) {
            callback(results, null);
        })
        .catch(function(err) {
            callback(null, err);
        });
    }

    // Get user by Id
    router.get('/:id', function(req, res, next) {
        var query = {
            sql: 'SELECT email, firstName, lastName, photoUrl FROM users\
                  WHERE id=@id',
            parameters: [
                { name: 'id', value: req.params.id }
            ]
        };
        req.azureMobile.data.execute(query)
        .then(function (results) {
            res.json({ users: results });
        });
    });


    // Create user
    router.post('/', function(req, res, next) {
        var db = req.azureMobile.data;
        getUserByEmail(db, req.body.email, function(results, err) {
            if (err) {
                res.json(400,err);
                return;
            }

            if (err || (results && results.length > 0)) {
                res.json(400, err || 'User already exists');
                return;
            }

            var query = {
                sql: 'INSERT INTO users(email,  password,  firstName,  lastName)\
                            VALUES (@email, @password, @firstName, @lastName);',
                parameters: [
                    { name: 'email', value: req.body.email },
                    { name: 'password', value: utils.md5(req.body.password) },
                    { name: 'firstName', value: req.body.firstName },
                    { name: 'lastName', value: req.body.lastName },
                ]
            };

            db.execute(query)
            .then(function (results) {
                //res.json(results);
                res.json({demo: "Modificado por PMG"});
            })
            .catch(function (err) {
               res.json(400, err);
            });
        });
    });


    return router;
};
>>>>>>> ccff6c77172cfc8c268d9adc0e960786464c8daa
