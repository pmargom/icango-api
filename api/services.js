
var express = require('express');
module.exports = function() {
   var router = express.Router();

   // Get all services
   router.get('/', function(req, res, next) {
      var query = {
         sql: 'SELECT id, name, description,finishedAt, finishedTime,price, tags, idUserRequest, idUserResponse, latitude, longitude, status FROM services',
         parameters: []
      };

      req.azureMobile.data.execute(query)
         .then(function (results) {
            res.json({
               totalRows: results.length,
               data: results
            })
         });
   });

   // Get service by Id
   router.get('/:id', function(req, res, next) {
      var query = {
         sql: 'SSELECT id, name, description,finishedAt, finishedTime,price, tags, idUserRequest, idUserResponse, latitude, longitude, status FROM services\
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

   // Create service
   router.post('/', function(req, res, next) {
      var db = req.azureMobile.data;

      var query = {
         sql: 'INSERT INTO services(name,  description)\
                            VALUES (@name, @description);',
         parameters: [
            { name: 'email', value: req.body.name },
            { name: 'password', value: req.body.description }
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

   return router;
};

