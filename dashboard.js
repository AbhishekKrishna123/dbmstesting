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


                var date= new Date();
                var currentDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
                console.log(currentDate);

                //console.log(res);

                if(res.length == 0) {
                    console.log("Error 1");
                    console.log(res);
                    response.sendFile("unauthorised.html", { root: path.join(__dirname, 'templates') });
                    //return 0;
                } else {


                    console.log("GPA" + res[0].CGPA);
                    var testq_reg = "SELECT * FROM TEST, COMPANY WHERE CUTOFFGPA <=  " + res[0].CGPA + " AND TEST.TESTID IN (SELECT TESTID FROM ELIGIBLEDEPARTMENTS WHERE DEPARTMENTID = '" + dept + "') AND TEST.TESTID IN (SELECT TESTID FROM REGISTER WHERE REGISTER.USN = '" + req.session.username + "') AND TEST.CompanyID = COMPANY.CompanyID AND TESTDATE >= '" + currentDate + "'";
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
                            var testq_notreg = "SELECT * FROM TEST, COMPANY WHERE CUTOFFGPA <=  " + res[0].CGPA + " AND TEST.TESTID IN (SELECT TESTID FROM ELIGIBLEDEPARTMENTS WHERE DEPARTMENTID = '" + dept + "') AND TEST.TESTID NOT IN (SELECT TESTID FROM REGISTER WHERE REGISTER.USN = '" + req.session.username + "') AND TEST.CompanyID = COMPANY.CompanyID AND TESTDATE >= '" + currentDate + "'";
                            console.log("Q: " + testq_notreg);
                            connection.query(testq_notreg, function(error_notreg, result_notreg){
                                if (error_notreg)
                                {
                                    throw error_notreg;
                                }

                                else
                                {
                                    var testq_notelig = "SELECT * FROM TEST, COMPANY WHERE CUTOFFGPA >  " + res[0].CGPA + " AND TEST.TESTID IN (SELECT TESTID FROM ELIGIBLEDEPARTMENTS WHERE DEPARTMENTID = '" + dept + "') AND TEST.CompanyID = COMPANY.CompanyID AND TESTDATE >= '" + currentDate + "'";
                                    console.log("NE: " + testq_notelig);
                                    connection.query(testq_notelig, function(error_notelig, result_notelig){
                                        if(error_notelig)
                                        {
                                            throw error_notelig;
                                        }

                                        else
                                        {

                                            var testq_old = "SELECT * FROM TEST LEFT JOIN REGISTER ON TEST.TESTID = REGISTER.TESTID AND REGISTER.USN = '" + req.session.username + "'" +  " WHERE TESTDATE < '" + currentDate + "';";
                                            console.log(testq_old);

                                            connection.query(testq_old, function(err_old, result_old) {

                                                response.render('dashboard_stu', {
                                                    Details: res[0],
                                                    Department: dept,
                                                    RegTests: result_reg,
                                                    UnregTests: result_notreg,
                                                    IneligibleTests: result_notelig,
                                                    OldTests: result_old
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

                                            })


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

                            var testQuery = "SELECT * FROM TEST, COMPANY WHERE TEST.TESTID IN (SELECT TESTID FROM ELIGIBLEDEPARTMENTS WHERE DEPARTMENTID = " + result[0].DepartmentID + ") AND TEST.CompanyID = COMPANY.CompanyID ;";
                            console.log("TQ: " + testQuery);
                            connection.query(testQuery, function(errid, result2) {

                                console.log(result2[0]);

                                response.render('dashboard_spc', {
                                    USN: result[0].USN,
                                    Department: dept,
                                    Username: req.session.username,
                                    Tests: result2

                                }, function(err1, html1){
                                    response.render('header', {
                                        Details: result[0],
                                    }, function(err2, html2) {
                                        response.render('template', {
                                            header: html2,
                                            body: html1
                                        });
                                    });
                                });

                            })


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