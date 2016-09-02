
var express = require('express');
module.exports = function() {
   var router = express.Router();

   // Get all service images
   router.get('/', function(req, res, next) {

      var query = {
         sql: 'GetServiceImages',
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

   // Get service images by Id
   router.get('/:id', function(req, res, next) {
      var query = {
         sql: 'GetServiceImagesById @id',
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

   // Create service image
   router.post('/', function(req, res, next) {
      var db = req.azureMobile.data;

      var query = {
         sql: 'CreateServiceImage @idService, @imageUrl',
         parameters: [
            { name: 'idService', value: req.body.idService },
            { name: 'imageUrl', value: req.body.imageUrl }
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
   
   // Update service image
   router.put('/', function(req, res, next) {
      var db = req.azureMobile.data;

      var query = {
         sql: 'UpdateServiceImage @id, @idService, @imageUrl',
         parameters: [
            { name: 'id', value: req.body.id },   
            { name: 'idService', value: req.body.idService },
            { name: 'imageUrl', value: req.body.imageUrl }
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

