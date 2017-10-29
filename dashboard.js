var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended: false});

var path = require("path");

var express = require("express");
var app = express();

var mysql = require("mysql");

module.exports =
{
    Dashboard : function(connection, req, response)
    {
        var role = req.session.role;
        //console.log("USER ROLE: ", role);

        if (role == 1)
        {
            connection.query("SELECT * FROM STUDENT WHERE USN = '" + req.session.username + "'", function(err, res, fields){

                //console.log(res);

                if(res.length == 0) {
                    console.log("Error 1");
                    console.log(res);
                    response.sendFile("unauthorised.html", { root: path.join(__dirname, 'templates') });
                    //return 0;
                } else {

                    var testq_reg = "SELECT * FROM TEST WHERE TESTDATE > 2000-01-01 AND TEST.TESTID IN (SELECT TESTID FROM REGISTER WHERE REGISTER.USN = '" + req.session.username + "');";
                    console.assert("REG" + testq_reg + "\n\n");
                    connection.query(testq_reg, function(error_reg, result_reg){
                        if (error_reg)
                        {
                            throw error_reg;
                        }
                        else
                        {
                            // response.render('dashboard_stu', {
                            // Details: res[0],
                            // Tests: result_reg
                            // });
                            var testq_notreg = "SELECT * FROM TEST WHERE TESTDATE > 2000-01-01 AND TEST.TESTID NOT IN (SELECT TESTID FROM REGISTER WHERE REGISTER.USN = '" + req.session.username + "');";
                            connection.query(testq_notreg, function(error_notreg, result_notreg){
                                if (error_notreg)
                                {
                                    throw error_notreg;
                                }

                                else
                                {
                                    response.render('dashboard_stu', {
                                        Details: res[0],
                                        RegTests: result_reg,
                                        UnregTests: result_notreg
                                    });
                                }

                            });
                        }
                    });
                }
            });
        }

        else if (role == 2)//faculty
        {
            connection.query("SELECT * FROM FACULTY WHERE FACULTYID = '" + req.session.username + "'", function(err, res, fields){

                console.log(res);

                if(res.length == 0) {
                    console.log("Error 1");
                    console.log(res);
                    response.sendFile("unauthorised.html", { root: path.join(__dirname, 'templates') });
                    //return 0;
                } else {

                    var dept;
                    connection.query("SELECT * FROM DEPARTMENT WHERE DEPARTMENTID = '" + res[0].DepartmentID + "';", function(errid, resid){

                        if(errid) throw errid;
                        else dept = resid[0].Name;

                        response.render('dashboard_fac', {
                            ID: res[0].FacultyID,
                            //FirstName: res[0].FirstName,
                            //LastName: res[0].LastName,
                            Name: res[0].Name,
                            EmailID: res[0].EmailID,
                            MobileNumber: res[0].MobileNumber,
                            Department: dept
                        });
                    });
                }
            });
        }

    }
}