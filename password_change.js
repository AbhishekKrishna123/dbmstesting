var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended: false});

var path = require("path");

var express = require("express");
var app = express();

var mysql = require("mysql");

module.exports =
{
    PasswordChange : function (req, res, connection)
    {
        var body = req.body;
        var name = req.session.username;
        console.log("username" + name);
        var old_password = body.old_password;
        var new_password = body.new_password;

        connection.query("SELECT `PASSWORD` FROM USER WHERE USERNAME = " + "'" + name + "'" + ";", function(err, result){
            if(err) throw err;
            else
            {
                console.log("FIRST" + result);
                if(res[0].password == body.old_password)
                {
                    connection.query("UPDATE USER SET PASSWORD = " + "'" + new_password + "'" + " WHERE USERNAME = " + "'" + name + "'" + ";", function(error, result){
                        if(error) throw error;
                        else console.log("UPDATED!" + result);
                    });
                }
            }



        });

        res.redirect('/dashboard');



    }
}