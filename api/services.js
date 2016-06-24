
module.exports = function() {
   var router = express.Router();

   // Get all users
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

   // Create user
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
}