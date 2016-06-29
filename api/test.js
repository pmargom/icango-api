var express = require('express'),
    utils = require('./utils');

module.exports = function() {
    var router = express.Router();
    
    router.get('/', function (req, res, next) {
        var accessToken = 'EAAWabAlAZAlABAPBezv9yVAOLqwJxwBN5K79i7avGoplT5IyrBzieZCyp1pZCKPfVzDSZC9h6GYQvuu3d1zQGdCqmlJhxZCM4jlTUbZBHuPuc68ExrYOCb0v879ZBw1oDOQHCTZA7XoUWQ1tFxeXNFki';
        var url = null;
        var oauth = null;
        url = 'https://graph.facebook.com/me?access_token=' + accessToken;
        res.json({url: url});
        /*if (url) {
            var requestCallback = function (err, resp, body) {
                if (err || resp.statusCode !== 200) {
                    console.error('Error sending data to the provider: ', err);
                    req.respond(500, body);
                } else {
                    try {
                        var userData = JSON.parse(body);
                        resp.send(200, { message : userData });
                    } catch (ex) {
                        console.error(
             'Error parsing response from the provider API: ', 
                           ex);
                        req.respond(500, ex);
                    }
                }
            }
            var req2 = require('request');
            var reqOptions = {
                uri: url,
                headers: { Accept: "application/json" }
            };
            if (oauth) {
                reqOptions.oauth = oauth;
            }
            req2(reqOptions, requestCallback);
        } else {
            res.send(200, { message : 'Error!' });
        }*/
        
    });
    
    return router;
};
