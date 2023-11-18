'use strict';

const express = require("express");
const graphqlHttp = require("express-graphql").graphqlHTTP;
const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require("./graphql/resolvers");


const appExpress = express();

var path = require('path');
var http = require('http');

var oas3Tools = require('oas3-tools');
var serverPort = 8080;

// const db = require("./db");

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};
const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017/').then(() => {
    console.log('Database connected')
}).catch((e) => {
    console.log(e.message)
})

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function() {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

appExpress.use(
    "/graphql",
    graphqlHttp({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true,
    })
);

appExpress.listen(3001, () => console.log("Server is running on http://localhost:3001/graphql"))