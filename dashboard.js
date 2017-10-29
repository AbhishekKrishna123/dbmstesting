var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended: false});

var path = require("path");

var express = require("express");
var app = express();

var mysql = require("mysql");

module.exports =
{
    Dashboard : function(connection, req, response, dept)
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

                    //var datetime = new Date();
                    console.log("GPA" + res[0].CGPA);
                    var testq_reg = "SELECT * FROM TEST WHERE CUTOFFGPA <=  '" + res[0].CGPA + "' AND TEST.TESTID IN (SELECT TESTID FROM ELIGIBLEDEPARTMENTS WHERE DEPARTMENTID = '" + dept + "') AND TEST.TESTID IN (SELECT TESTID FROM REGISTER WHERE REGISTER.USN = '" + req.session.username + "');";
                    console.log("REG" + testq_reg + "\n\n");
                    connection.query(testq_reg, function(error_reg, result_reg){
                        if (error_reg)
                        {
                            throw error_reg;
                        }
                        else
                        {
                            //console.log("DATE" + datetime);
                            //var testq_notreg = "SELECT * FROM TEST WHERE CUTOFFGPA <=  '" + res[0].CGPA + "' AND TEST.TESTID NOT IN (SELECT TESTID FROM REGISTER WHERE REGISTER.USN = '" + req.session.username + "');";
                            var testq_notreg = "SELECT * FROM TEST WHERE CUTOFFGPA <=  '" + res[0].CGPA + "' AND TEST.TESTID IN (SELECT TESTID FROM ELIGIBLEDEPARTMENTS WHERE DEPARTMENTID = '" + dept + "') AND TEST.TESTID NOT IN (SELECT TESTID FROM REGISTER WHERE REGISTER.USN = '" + req.session.username + "');";
                            connection.query(testq_notreg, function(error_notreg, result_notreg){
                                if (error_notreg)
                                {
                                    throw error_notreg;
                                }

                                else
                                {
                                    var testq_notelig = "SELECT * FROM TEST WHERE CUTOFFGPA >  '" + res[0].CGPA + "' AND TEST.TESTID IN (SELECT TESTID FROM ELIGIBLEDEPARTMENTS WHERE DEPARTMENTID = '" + dept + "');";
                                    connection.query(testq_notelig, function(error_notelig, result_notelig){
                                        if(error_notelig)
                                        {
                                            throw error_notelig;
                                        }

                                        else
                                        {
                                            response.render('dashboard_stu', {
                                                Details: res[0],
                                                Department: dept,
                                                RegTests: result_reg,
                                                UnregTests: result_notreg,
                                                IneligibleTests: result_notelig
                                            }, function(err1, html1){
                                                response.render('header', {
                                                    Details: res[0],
                                                }, function(err2, html2) {
                                                    response.render('template', {
                                                        header: html2,
                                                        body: html1
                                                    });
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }

        else if (role == 2)//faculty login
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
                        }, function(err1, html1){
                            response.render('header', {
                                Details: res[0],
                            }, function(err2, html2) {
                                response.render('template', {
                                    header: html2,
                                    body: html1
                                });
                            });
                        });
                    });
                }
            });
        }

        else if (role == 3) // spc login
        {
            //response.render('dashboard_placementcell');
            connection.query("SELECT * FROM SPC WHERE USERNAME = '" + req.session.username + "';", function(error, result)
            {
                if(error)
                {
                    throw error;
                }

                else {
                    console.log("FOUND SPC, WITH " + result[0]);
                    var dept;
                    connection.query("SELECT * FROM DEPARTMENT WHERE DEPARTMENTID = '" + result[0].DepartmentID + "';", function(errid, resid){

                        if(errid) 
                        {
                            throw errid;
                        }
                        else 
                        {
                            dept = resid[0].Name;

                            response.render('dashboard_spc', {
                                USN: result[0].USN,
                                Department: dept,
                                Username: req.session.username 

                            });
                        }
                    });
                }

            });
        }

        else if(role == 4)
        {
            response.render('dashboard_placementcell');
        }

        else if (role == 0) //admin
        {
            response.render('dashboard_admin');
        }

    }
}