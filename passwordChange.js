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
        var username = req.session.username;
        var old_password = body.old_password;
        var new_password = body.new_password;
        var cnew_password = body.cnew_password;

        if(new_password != cnew_password)
        {
            res.redirect('/password_change_fail');
        }

        var user_details_query = "SELECT * FROM USER WHERE USERNAME = '" + username + "';"

        connection.query(user_details_query, function(err, result){
            
            if(err) 
            {
                console.log("\n---------------------------\n Backend Error: Unable to retrieve details for current user\n---------------------------\n");
                res.redirect('/error');
            }

            else
            {
                if(result[0].password == body.old_password)
                {
                    var update_password_query = "UPDATE USER SET PASSWORD = '" + new_password + "' WHERE USERNAME = '" + username + "';"

                    connection.query(update_password_query, function(error, result)
                    {
                        if(error)
                        {
                            console.log("\n---------------------------\n Backend Error: Unable to update password\n---------------------------\n");
                            res.redirect('/error');
                        }
                        else 
                        {
                            res.redirect('/password_change_success');
                        }
                    });
                }

                else
                {
                    res.redirect('password_change_fail');
                }
            }
        });
    }
}