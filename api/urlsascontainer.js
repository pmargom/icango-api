var express = require('express');
//var azure = require('azure');
var qs = require('querystring');
var azure = require('azure-storage');
var nconf = require('nconf');
nconf.env();

module.exports = function() {
    var router = express.Router();
    
    router.get('/', function (req, res, next) {
        // en el parametro nos llega el nombre del blob
        var blobName = req.query.blobName;
        var container = req.query.containerName;
        
        console.log('Container: ' + container + ' - BlobName: ' + blobName);
        
        var accountName = nconf.get("STORAGE_ACCOUNT_NAME");
        var accountKey = nconf.get("STORAGE_ACCOUNT_ACCESS_KEY");
        var host = accountName + '.blob.core.windows.net';
        
        //console.log("accountName: ", accountName);
        //console.log("accountKey : ", accountKey);
        console.log("La URL antes de la SAS es -> " + host );
        
        var blobService = azure.createBlobService(accountName, accountKey, host);

        var sharedAccessPolicy = { 
                AccessPolicy : {
                        Permissions: 'rw',
                        Expiry: minutesFromNow(15)
                }
        };
                
        // Generate the upload URL with SAS for the new blob.
        var sasURL = blobService.generateSharedAccessSignature(container, blobName, sharedAccessPolicy);
        //console.log("blobService.host: ", blobService);
        
        var item = {
                // Set the query string.
                sasQueryString: qs.stringify(sasURL.queryString),
                // Host + containerName full path
                hostWithContainerName: "https://" + host + "/" + container
        };
        res.status(200).json(item);
        
    });

        function minutesFromNow(minutes) {
           var date = new Date()
           date.setMinutes(date.getMinutes() + minutes);
           return date;
        }
    
    return router;
};



