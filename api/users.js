
var express = require('express');
var utils = require('./utils');

module.exports = function() {
    var router = express.Router();

    // Helper method to get user by email
    function GetUserByEmailAndPassword(db, email, password, callback) {
        var query = {
            sql: 'GetUserByEmailAndPassword @email, @password',
            parameters: [
                { name: 'email', value: email },
                { name: 'password', value: password }
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

      var page = req.query.page;
      var rows = req.query.rows;
      var status = req.query.status;
      
      var latitude = null;
      if (req.query.latitude !== '') latitude = req.query.latitude;
      var longitude = null;
      if (req.query.longitude !== '') longitude = req.query.longitude;
      var distance = null;
      if (req.query.distance !== '') distance = req.query.distance;
      
      var searchText = req.query.searchText;

      var query = {
         sql: 'GetServicesByUserId @id, @type, @status, @page, @rows, @latitude, @longitude, @distance, @searchText',
         parameters: [
            {name: 'id', value: req.params.id},
            {name: 'type', value: req.query.type},
            { name: 'status', value: status },
            { name: 'page', value: page },
            { name: 'rows', value: rows },
            { name: 'latitude', value: latitude },
            { name: 'longitude', value: longitude },
            { name: 'distance', value: distance },
            { name: 'searchText', value: searchText }
         ],
         multiple: true // this allows to receive multiple resultsets
      };
      req.azureMobile.data.execute(query)
            .then(function (results) {

           if (results.length > 0)
               res.json({
                  totalRows: results[0][0].totalRows,
                  page: page,
                  rows: rows,
                  error: '',
                  data: results[1]
               });
            else
               res.json({
                  totalRows: 0,
                  page: 0,
                  rows: 0,
                  error: 'No data found',
                  data: {}
               });
            });
    });

    // Confirm the email address
    router.get('/confirm/:id', function(req, res, next) {
      var query = {
         sql: 'ConfirmRegistry @id',
         parameters: [
            {name: 'id', value: req.params.id}
         ]
      };
      req.azureMobile.data.execute(query)
            .then(function (results) {

           if (results.length > 0)
               res.json({
                  totalRows: 1,
                  page: 1,
                  rows: 1,
                  error: '',
                  data: results
               });
            else
               res.json({
                  totalRows: 0,
                  page: 0,
                  rows: 0,
                  error: 'Error during email confirmation process.',
                  data: {}
               });
            });        
    });
    
    // Create user
    router.post('/', function(req, res, next) {
        var db = req.azureMobile.data;
        GetUserByEmailAndPassword(db, req.body.email,utils.md5(req.body.password), function(results, err) {
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
                if (results.length > 0) {
                    res.json({
                        totalRows: results.length,
                        error: '',
                            data: results
                        });
                        // After creating the new user in db, we have to send an email to confirm the registry
                        var from = "hello@icango.com";
                        var to = req.body.email;
                        var subject = "Please, confirm your email address";
                        var body = "Hi";
                        body += " " + req.body.firstName + " " + req.body.lastName;
                        body += "<br> Please confirm to email address <a href='" + process.env.API_BASE_URL + "users/confirm/" + results[0].id  + "'>here</a>";
                        utils.sendEmail(from, to, subject, body, function(emailReponse) {
                            if (emailReponse.statusCode !== 202) {
                                console.log('CreateUser - send email confirmation error: ', emailReponse);             
                            } 
                        });
                    }
                    else {
                        res.json({
                            totalRows: 0,
                            error: 'No data found',
                            data: {}
                        });
                    }
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
    
    // Modify profile user
    router.put('/:id', function(req, res, next) {
        
		if (!utils.validateParam({ 'name': 'firstName', 'value': req.body.firstName }, res)) return;
		if (!utils.validateParam({ 'name': 'lastName', 'value': req.body.lastName }, res)) return;
		if (!utils.validateParam({ 'name': 'searchPreferences', 'value': req.body.searchPreferences }, res)) return;
		if (!utils.validateParam({ 'name': 'oldPassword', 'value': req.body.oldPassword }, res)) return;
		if (!utils.validateParam({ 'name': 'password', 'value': req.body.password }, res)) return;
		if (!utils.validateParam({ 'name': 'photoUrl', 'value': req.body.photoUrl }, res)) return;
		if (!utils.validateParam({ 'name': 'email', 'value': req.body.email }, res)) return;
		
        var id = req.params.id;
        var db = req.azureMobile.data;
        GetUserByEmailAndPassword(db, req.body.email, utils.md5(req.body.oldPassword), function(results, err) {
            if (err) {
                //res.json(400,err);
                res.json({
                    totalRows: 0,
                    error: err,
                    data: {}
                });
                return;
            }

            if (err || (results && results.length == 0)) {
                res.json({
                    totalRows: 0,
                    error: err || 'User not found.',
                    data: {}
                });

                return;
            }

            var query = {
                sql: 'UpdateUser @id, @password, @firstName, @lastName, @photoUrl, @searchPreferences',
                parameters: [
                    { name: 'id', value: id },
                    { name: 'password', value: utils.md5(req.body.password) },
                    { name: 'firstName', value: req.body.firstName },
                    { name: 'lastName', value: req.body.lastName },
                    { name: 'photoUrl', value: req.body.photoUrl },
                    { name: 'searchPreferences', value: req.body.searchPreferences }
                ]
            };

            db.execute(query)
            .then(function (results) {
                if (results.length > 0) {
                    res.json({
                        totalRows: results.length,
                        error: '',
                            data: results
                        });
                        // After updating the user data in db, we have to send an email to user
                    }
                    else {
                        res.json({
                            totalRows: 0,
                            error: 'No data found',
                            data: {}
                        });
                    }
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

