
module.exports = function() {
	var router = express.Router();

    // Create user    
    router.post('/', function(req, res, next) {
        var db = req.azureMobile.data;

/*

        createdAt
Date
true
…
version
Version
false
…
deleted
Boolean
false
…
name
String
false
…
description
String
false
…
finishedAt
Date
false
…
finishedTime
String
false
…
price
Number
false
…
tags
String
false
…
idUserRequest
String
false
…
idUserResponse
String
false
…
latitude
String
false
…
longitude
String
false
…
status
String
false
*/

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