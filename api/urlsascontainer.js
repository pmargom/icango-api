/* global blobService */
var express = require('express');
var azure = require('azure-storage');
var nconf = require('nconf');
nconf.env();

module.exports = function() {
    var router = express.Router();
    
    router.get('/', function (req, res, next) {
        
        var blobName = req.query.blobName;
        var container = req.query.containerName;
        
        var accountName = nconf.get("STORAGE_ACCOUNT_NAME");
        var accountKey = nconf.get("STORAGE_ACCOUNT_ACCESS_KEY");
        var host = accountName + '.blob.core.windows.net';
                
        var blobService = azure.createBlobService(accountName, accountKey);
        
        var sharedAccessPolicy = { 
                AccessPolicy: { 
                        Permissions: 'rw',
                        Expiry: minutesFromNow(20)
                }
        };               
        // Generate the upload URL with SAS for the new blob.
        var sasToken = blobService.generateSharedAccessSignature(container, '', sharedAccessPolicy);
        //var sasURL = blobService.generateSharedAccessSignature(container, blobName, sharedAccessPolicy);
        //console.log('blobService -> ', blobService.getUrl(container, blobName, sasURL));
        
        var item = {
                sasToken: sasToken,
                urlWithContainerAndBlobName: "https://" + host + "/" + container + "/" + blobName,
                urlWithContainerAndWithOutBlobName: "https://" + host + "/" + container + "/",
                fullUrl: blobService.getUrl(container, blobName, sasToken)
        };
               
        res.status(200).json(item);
       
    });
        
    return router;
};

function minutesFromNow(minutes) {
   var date = new Date();
   date.setMinutes(date.getMinutes() + minutes);
   return date;
}
