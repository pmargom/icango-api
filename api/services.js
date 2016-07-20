
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
      
      var latitude = null;
      if (req.query.latitude !== '') latitude = req.query.latitude;
      var longitude = null;
      if (req.query.longitude !== '') longitude = req.query.longitude;
      var distance = null;
      if (req.query.distance !== '') distance = req.query.distance;
      
      var searchText = req.query.searchText;

      var query = {
         sql: 'GetServices @status, @page, @rows, @latitude, @longitude, @distance, @searchText',
         parameters: [
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

                  results[0]["images"] = servicesImages;
                  res.json({
                     totalRows: results.length,
                     error: '',
                     data: [results[0]]
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

   // Get service by Id and IdUserRequest
   router.get('/:id/users/:userId', function (req, res, next) {
      var query = {
         sql: 'GetServiceByIdAndOwner @id, @idUserRequest',
         parameters: [
            {name: 'id', value: req.params.id},
            {name: 'idUserRequest', value: req.params.userId}
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

                  results[0]["images"] = servicesImages;
                  res.json({
                     totalRows: results.length,
                     error: '',
                     data: [results[0]]
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
      
      var name = req.body.name;
      var description = req.body.description;
      var idUserRequest = req.body.idUserRequest;
      var price = req.body.price;
      var tags = null;
      if (req.body.tags !== '') tags = req.body.tags;
      var latitude = null;
      if (req.body.latitude !== '') latitude = req.body.latitude;
      var longitude = null;
      if (req.body.longitude !== '') longitude = req.body.longitude;
      var address = null;
      if (req.body.address !== '') address = req.body.address;
      var status = null;
      if (req.body.status !== '') status = req.body.status;
      
      var query = {
         sql: 'CreateService @name,@description,@idUserRequest,@price,@tags,@latitude,@longitude,@status,@address',
         parameters: [
            { name: 'name', value: name },
            { name: 'description', value: description },
            { name: 'idUserRequest', value: idUserRequest },
            { name: 'price', value: price },
            { name: 'tags', value: tags },
            { name: 'latitude', value: latitude },
            { name: 'longitude', value: longitude },
            { name: 'status', value: status }, 
            { name: 'address', value: address }
         ]
      };
      
      var db = req.azureMobile.data;
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
      var name = null;
      if (req.body.name !== '') name = req.body.name;
      var description = null;
      if (req.body.description !== '') description = req.body.description;
      var idUserResponse = null;
      if (req.body.idUserResponse !== '') idUserResponse = req.body.idUserResponse;
      var price = null;
      if (req.body.price !== '') price = req.body.price;
      var tags = null;
      if (req.body.tags !== '') tags = req.body.tags;
      var latitude = null;
      if (req.body.latitude !== '') latitude = req.body.latitude;
      var longitude = null;
      if (req.body.longitude !== '') longitude = req.body.longitude;
      var address = null;
      if (req.body.address !== '') address = req.body.address;
      var status = null;
      if (req.body.status !== '') status = req.body.status;
      var id = req.params.id;
            
      var query = {
         sql: 'UpdateService @id,@name,@description,@idUserResponse,@price,@tags,@latitude,@longitude,@status,@address',
         parameters: [
            { name: 'id', value: id }, 
            { name: 'name', value: name },
            { name: 'description', value: description },
            { name: 'idUserResponse', value: idUserResponse },
            { name: 'price', value: price },
            { name: 'tags', value: tags },
            { name: 'latitude', value: latitude },
            { name: 'longitude', value: longitude },
            { name: 'status', value: status }, 
            { name: 'address', value: address }
         ]
      };
      
      var db = req.azureMobile.data;
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
   router.delete('/:id', function(req, res, next) {
      var id = req.params.id;

      var query = {
         sql: 'DeleteService @id',
         parameters: [
            { name: 'id', value: id }
         ]
      };
      
      var db = req.azureMobile.data;
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

