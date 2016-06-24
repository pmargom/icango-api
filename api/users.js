
module.exports = {
    "get": function (req, res, next) {
       var query = {
          sql: 'SELECT email, firstName, lastName, photoUrl FROM users\
                WHERE id=@id',
          parameters: [
              { name: 'id', value: req.params.id }
          ]
      };
      req.azureMobile.data.execute(query)
      .then(function (results) {
          res.json({ users: results });
      });   
    }
}
