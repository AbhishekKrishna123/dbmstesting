var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended: false});

var path = require("path");

var express = require("express");
var app = express();

var mysql = require("mysql");

module.exports =
{
    Login : function(connection, request, response)
    {
        var username = request.body.username;

        var user_query = "SELECT * FROM USER WHERE USERNAME = '" + request.body.username + "'";
        
        connection.query(user_query, function(err, res, fields){

            if (err)
            {
                console.log("\n---------------------------\nBackend Error: Unable to get user password for login\n---------------------------\n")
            }

            if(res.length == 0) 
            {
                console.log("\n---------------------------\nLogin Error: User not found\n---------------------------\n");
                response.redirect('/#');
            } 
            
            else 
            {
                if(request.body.password == res[0].password)
                {
                    request.session.username = request.body.username;
                    request.session.role = res[0].role;
                    response.redirect('/dashboard');
                } 
                
                else 
                {
                    console.log("\n---------------------------\nLogin Error: Wrong Password\n---------------------------\n")
                    response.redirect("/#");
                }
            }
        });
    }
}