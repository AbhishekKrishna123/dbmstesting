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

        else if (role == 2)//faculty and spc login
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

        else if (role == 3) // placement cell
        {
            response.render('dashboard_placementcell');
        }

    }
}