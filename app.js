// ----------------------------------------------------------------------------
// Copyright (c) 2015 Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

// This is a base-level Azure Mobile App SDK.
var express = require('express'),
    azureMobileApps = require('azure-mobile-apps'),
    bodyParser = require('body-parser'),
    usersApi = require('./api/users'),
    loginApi = require('./api/login'),
    servicesApi = require('./api/services'),
    urlsascontainerApi = require('./api/urlsascontainer'),
    testApi = require('./api/test');

// Set up a standard Express app
var app = express();

var mobile = azureMobileApps(); 
app.use(mobile);    // Register the Azure Mobile Apps middleware

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api/v1/users', usersApi());
app.use('/api/v1/login', loginApi());
app.use('/api/v1/services', servicesApi());
app.use('/api/v1/urlsascontainer', urlsascontainerApi());
app.use('/api/v1/test', testApi());


app.listen(process.env.PORT || 3000);   // Listen for requests