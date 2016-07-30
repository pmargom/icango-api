var express = require('express'),
    utils = require('./utils');

module.exports = function() {
    var router = express.Router();
    
    // Testing email sending with SendGrid
    router.post('/testEmail', function(req, res, next) {
        var from = req.body.from;
        var to = req.body.to;
        var subject = req.body.subject;
        var body = req.body.body;
        if (utils.sendEmail(from, to, subject, body)) {
            res.json({
                error: "",
                result: "Email sent successfully.",
                messageInfo: {
                    from: from,
                    to: to,
                    subject: subject,
                    body: body
                }
            });
        }
        else {
            res.json({
                error: "test error",
                result: "Sorry, problems during sending email.",
                messageInfo: null
            });
        }
    });
     
    router.post('/', function(req, res, next) {
        var query = {
            sql: 'GetLogin @email, @password',
            parameters: [
                { name: 'email', value: req.body.email }, 
                { name: 'password', value: utils.md5(req.body.password) }      
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
        })
        .catch(function (err) {
           res.json(400, err);
        });
    });

    router.get('/fb', function(req, res, next) {
        //res.json({ result: "kakakak"});
        /*req.azureMobile.user.getIdentity("facebook").then((data) => {
            res.status(200).type('application/json').json(data);
        }).catch((error) => {
            res.status(500).send(JSON.stringify(error));
        });
        */
        /*req.user.getIdentity("facebook").then((data) => {
            res.status(200).type('application/json').json(data);
        }).catch((error) => {
            res.status(500).send(JSON.stringify(error));
        });
        */
        /*req.user.getIdentities(function())*/
        var currentUser = req.azureMobile.user;
        res.json({ result: "currentUser: " + currentUser});
    });
   
    return router;
};
