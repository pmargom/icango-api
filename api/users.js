
var express = require('express');
var utils = require('./utils');

module.exports = function() {
    var router = express.Router();

    // Helper method to get user by email
    function getUserByEmail(db, email, callback) {
        var query = {
            sql: 'SELECT email FROM users\
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

    // Get all users
    router.get('/', function(req, res, next) {
        var query = {
            sql: 'SELECT id, email, firstName, lastName, photoUrl, searchPreferences, status, deleted FROM users',
            parameters: []
        };

        req.azureMobile.data.execute(query)
           .then(function (results) {
            if (results.length > 0)
                res.json({
                   totalRows: results.length,
                   error: '',
                   data: results
                });
            else 
                res.json({
                    totalRows: 0,
                    error: 'No data found', 
                    data: {}
                });               
           });
    });

    // Get user by Id
    router.get('/:id', function(req, res, next) {
        var query = {
            sql: 'SELECT id, email, firstName, lastName, photoUrl, searchPreferences, status, deleted FROM users\
                  WHERE id=@id',
            parameters: [
                { name: 'id', value: req.params.id }
            ]
        };
        req.azureMobile.data.execute(query)
        .then(function (results) {
           res.json({
               totalRows: results.length,
               data: results
           });
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
                sql: 'INSERT INTO users(email, password, firstName, lastName, photoUrl, searchPreferences, status)\
                            VALUES (@email, @password, @firstName, @lastName, @photoUrl, @searchPreferences, @status);',
                parameters: [
                    { name: 'email', value: req.body.email },
                    { name: 'password', value: utils.md5(req.body.password) },
                    { name: 'firstName', value: req.body.firstName },
                    { name: 'lastName', value: req.body.lastName },
                    { name: 'photoUrl', value: req.body.photoUrl },
                    { name: 'searchPreferences', value: req.body.searchPreferences },
                    { name: 'status', value: req.body.status }
                ]
            };

            db.execute(query)
            .then(function (results) {
                res.json(results);
            })
            .catch(function (err) {
               res.json(400, err);
            });
        });
    });


    return router;
};

