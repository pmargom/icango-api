
var express = require('express');
module.exports = function() {
   var router = express.Router();

   // Helper method to get images by service id
   function getImagesByServiceId(db, idService, callback) {
      var query = {
         sql: 'GetServiceImagesByServiceId @idService',
         parameters: [
            { name: 'idService', value: idService }
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

   // Get all services
   router.get('/', function(req, res, next) {

      var page = req.query.page;
      var rows = req.query.rows;
      var status = req.query.status;

      var query = {
         sql: 'GetServices @status, @page, @rows',
         parameters: [
            { name: 'status', value: status },
            { name: 'page', value: page },
            { name: 'rows', value: rows }
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

   // Get service by Id
   router.get('/:id', function (req, res, next) {
      var query = {
         sql: 'GetServiceById @id',
         parameters: [
            {name: 'id', value: req.params.id}
         ]
      };
      var db = req.azureMobile.data;
      db.execute(query)
         .then(function (results) {
            if (results.length > 0) {

               // after retrieving service data, asking the images
               getImagesByServiceId(db, results[0].id, function (resultsImages, err) {
                  var servicesImages = [];
                  if (err === null) {
                     servicesImages = resultsImages;
                  }

                  res.json({
                     totalRows: results.length,
                     error: '',
                     data: [{
                        service: results[0],
                        images: servicesImages
                     }]
                  });
               });
            }
            else
               res.json({
                  totalRows: 0,
                  error: 'No data found',
                  data: {}
               });

         });
   });

   // Get images by  service Id
   router.get('/:id/images', function(req, res, next) {
      var db = req.azureMobile.data;
      getImagesByServiceId(db, req.params.id, function(results, err) {
         if (err) {
            res.json({
               totalRows: 0,
               error: err,
               data: {}
            });
            return;
         }

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
         sql: 'CreateService @name,@description,@price,@tags,@idUserRequest,@latitude,@longitude,@status, @address',
         parameters: [
            { name: 'name', value: req.body.name },
            { name: 'description', value: req.body.description },
            { name: 'price', value: req.body.price },
            { name: 'tags', value: req.body.tags },
            { name: 'idUserRequest', value: req.body.idUserRequest },
            { name: 'latitude', value: req.body.latitude },
            { name: 'longitude', value: req.body.longitude },
            { name: 'status', value: req.body.status },
            { name: 'address', value: req.body.address }
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

   // Modify service
   router.put('/:id', function(req, res, next) {
      var db = req.azureMobile.data;
      var query = {
         sql: 'CreateService @id, @name,@description,@price,@tags,@idUserRequest,@latitude,@longitude,@status',
         parameters: [
            { name: 'id', value: req.params.id },
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

