var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended: false});

var path = require("path");

var express = require("express");
var app = express();

var mysql = require("mysql");

module.exports =
{
    addCompany : function(req, res, connection)
    {
        var body = req.body;

        var insertVals =
        {
            CompanyName: body.companyname,
            Details: body.companydetails
        }

        connection.query("INSERT INTO COMPANY SET ?", insertVals, function(err, result) {
            if(err) throw err;
            else
            {
                console.log("SUCCESS" + result);
                res.redirect('/dashboard');
            }
        });
    }
}