
var express = require('express');
module.exports = function() {
   var router = express.Router();

   // Get all services
   router.get('/', function(req, res, next) {
      var query = {
         sql: 'GetServices',
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

   // Get service by Id
   router.get('/:id', function(req, res, next) {
      var query = {
         sql: 'GetServiceById @id',
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

   // Create service
   router.post('/', function(req, res, next) {
      var db = req.azureMobile.data;

      var query = {
         sql: 'CreateService',
         parameters: [
            { name: 'name', value: req.body.name },
            { name: 'description', value: req.body.description },
            { name: 'price', value: req.body.price },
            { name: 'tags', value: req.body.tags },
            { name: 'idUserRequest', value: req.body.idUserRequest },
            { name: 'latitude', value: req.body.latitude },
            { name: 'longitude', value: req.body.longitude },
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

   return router;
};

