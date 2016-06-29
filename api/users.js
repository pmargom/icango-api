
var express = require('express');
var utils = require('./utils');

module.exports = function() {
    var router = express.Router();

    // Helper method to get user by email
    function getUserByEmail(db, email, callback) {
        var query = {
            sql: 'GetUserByEmail @email',
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
            sql: 'GetUsers',
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
            sql: 'GetUserById @id',
            parameters: [
                { name: 'id', value: req.params.id }
            ]
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

    // Get services by requestuserId
    router.get('/:id/services', function(req, res, next) {
        var query = {
            sql: 'GetServicesByRequestUserId @id',
            parameters: [
                { name: 'id', value: req.params.id }
            ]
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

    // Create user
    router.post('/', function(req, res, next) {
        var db = req.azureMobile.data;
        getUserByEmail(db, req.body.email, function(results, err) {
            if (err) {
                //res.json(400,err);
                res.json({
                    totalRows: 0,
                    error: err,
                    data: {}
                });
                return;
            }

            if (err || (results && results.length > 0)) {
                //res.json(400, err || 'User already exists');
                res.json({
                    totalRows: 0,
                    error: err || 'User already exists',
                    data: {}
                });

                return;
            }

            var query = {
                sql: 'CreateUser @email, @password, @firstName, @lastName, @photoUrl, @searchPreferences, @status',
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
            })
            .catch(function (err) {
               //res.json(400, err);
                res.json({
                    totalRows: 0,
                    error: err,
                    data: {}
                });
            });
        });
    });


    return router;
};

