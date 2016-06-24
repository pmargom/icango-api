// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// This is a base-level Azure Mobile App SDK.
var express = require('express'),
<<<<<<< HEAD
    azureMobileApps = require('azure-mobile-apps');
=======
    azureMobileApps = require('azure-mobile-apps'),
    bodyParser = require('body-parser'),
    usersApi = require('./api/users'),
    loginApi = require('./api/login');
>>>>>>> ccff6c77172cfc8c268d9adc0e960786464c8daa

// Set up a standard Express app
var app = express();

<<<<<<< HEAD
// If you are producing a combined Web + Mobile app, then you should handle
// anything like logging, registering middleware, etc. here

// Configuration of the Azure Mobile Apps can be done via an object, the
// environment or an auxiliary file.  For more information, see
// http://azure.github.io/azure-mobile-apps-node/global.html#configuration
var mobile = azureMobileApps({
    // Explicitly enable the Azure Mobile Apps home page
    homePage: true
});

// Import the files from the tables directory to configure the /tables endpoint
mobile.tables.import('./tables');

// Import the files from the api directory to configure the /api endpoint
mobile.api.import('./api');

// Initialize the database before listening for incoming requests
// The tables.initialize() method does the initialization asynchronously
// and returns a Promise.
mobile.tables.initialize()
    .then(function () {
        app.use(mobile);    // Register the Azure Mobile Apps middleware
        app.listen(process.env.PORT || 3000);   // Listen for requests
    });
=======
var mobile = azureMobileApps(); 
app.use(mobile);    // Register the Azure Mobile Apps middleware

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api/v1/users', usersApi());
app.use('/api/v1/login', loginApi());


app.listen(process.env.PORT || 3000);   // Listen for requests
>>>>>>> ccff6c77172cfc8c268d9adc0e960786464c8daa
