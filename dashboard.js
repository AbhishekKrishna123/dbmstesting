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

        if (role == 0) //admin
        {
            connection.query("SELECT ROLE AS ROLE, COUNT(*) AS COUNT FROM USER GROUP BY ROLE;", function(error, result){

                if(error)
                {
                    console.log("\nBackend error: Couldn't retrieve role groups for admin dashboard\n");
                }
                else
                {
                    var i = 0;
                    for(i=0; i < result.length; i++)
                    {
                        if (result[i].ROLE == 0) result[i].ROLE = "Admin";
                        else if (result[i].ROLE == 1) result[i].ROLE = "Student";
                        else if (result[i].ROLE == 2) result[i].ROLE = "Faculty Coordinator";
                        else if (result[i].ROLE == 3) result[i].ROLE = "Student Placement Coordinator";
                        else if (result[i].ROLE == 4) result[i].ROLE = "Placement Cell, RVCE";
                    }
                    //response.render('dashboardAdmin', {Users: result});

                    response.render('dashboardAdmin', {
                        Users: result
                    }, function(err1, html1){
                        response.render('header', {
                            username: req.session.username,
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

        else if (role == 1)
        {
            var student_details_query = "SELECT * FROM STUDENT WHERE USN = '" + req.session.username + "'" ;

            connection.query(student_details_query, function(err, res, fields){

                var date= new Date();
                var currentDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();

                if(err)
                {
                    console.log("\n---------------------------\nDashboard / Backend Error: Unable to retrieve student details\n---------------------------\n");
                }

                if(res.length == 0)
                {
                    console.log("\n---------------------------\nDashboard Error: USN doesn't match Username\n---------------------------\n");
                    response.redirect('/error');
                }

                else
                {
                    if(res[0].Placed != "Yes")
                    {
                        var testq_reg = "SELECT * FROM TEST, COMPANY WHERE CUTOFFGPA <=  " + res[0].CGPA +
                        " AND TEST.TESTID IN (SELECT TESTID FROM ELIGIBLEDEPARTMENTS WHERE DEPARTMENTID = '" + dept +
                        "') AND TEST.TESTID IN (SELECT TESTID FROM REGISTER WHERE REGISTER.USN = '" +
                        req.session.username + "') AND TEST.COMPANYID = COMPANY.COMPANYID AND TESTDATE >= '" + currentDate + "'";

                        connection.query(testq_reg, function(error_reg, result_reg){

                            if (error_reg)
                            {
                                throw error_reg;
                            }

                            else
                            {
                                var testq_notreg = "SELECT * FROM TEST, COMPANY WHERE CUTOFFGPA <=  " + res[0].CGPA +
                                " AND TEST.TESTID IN (SELECT TESTID FROM ELIGIBLEDEPARTMENTS WHERE DEPARTMENTID = '" + dept +
                                "') AND TEST.TESTID NOT IN (SELECT TESTID FROM REGISTER WHERE REGISTER.USN = '" +
                                req.session.username + "') AND TEST.COMPANYID = COMPANY.COMPANYID AND TESTDATE >= '" + currentDate + "'";

                                connection.query(testq_notreg, function(error_notreg, result_notreg){
                                    if (error_notreg)
                                    {
                                        throw error_notreg;
                                    }

                                    else
                                    {
                                        var testq_notelig = "SELECT * FROM TEST, COMPANY WHERE CUTOFFGPA >  " + res[0].CGPA +
                                        " AND TEST.TESTID IN (SELECT TESTID FROM ELIGIBLEDEPARTMENTS WHERE DEPARTMENTID = '" + dept +
                                        "') AND TEST.CompanyID = COMPANY.CompanyID AND TESTDATE >= '" + currentDate + "'";

                                        connection.query(testq_notelig, function(error_notelig, result_notelig){
                                            if(error_notelig)
                                            {
                                                throw error_notelig;
                                            }

                                            else
                                            {

                                                var testq_old = "SELECT * FROM COMPANY, TEST LEFT JOIN REGISTER ON TEST.TESTID = REGISTER.TESTID AND REGISTER.USN = '" +
                                                req.session.username + "'" +  " WHERE TESTDATE < '" + currentDate + "'" +
                                                " AND COMPANY.COMPANYID = TEST.COMPANYID;";

                                                connection.query(testq_old, function(err_old, result_old) {

                                                    response.render('dashboardStu', {
                                                        Details: res[0],
                                                        Department: dept,
                                                        RegTests: result_reg,
                                                        UnregTests: result_notreg,
                                                        IneligibleTests: result_notelig,
                                                        OldTests: result_old
                                                        // Placed: NULL
                                                    }, function(err1, html1){
                                                        response.render('header', {
                                                            username: req.session.username,
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

                    else
                    {
                        connection.query("SELECT * FROM COMPANY, TEST WHERE COMPANY.COMPANYID = TEST.COMPANYID AND TEST.TESTDATE >= '" + currentDate + "';", function(err1, res1){

                            if(err1)
                            {
                                console.log("\nBackend Error: Couldn't retrieve tests\n");
                            }

                            else
                            {

                                connection.query("SELECT * FROM COMPANY, TEST WHERE COMPANY.COMPANYID = TEST.COMPANYID AND TEST.TESTDATE < '" + currentDate + "';", function(err2, res2){

                                    if (err2)
                                    {
                                        console.log("\nBackend Error: Couldn't retrieve old tests\n");
                                    }

                                    else
                                    {

                                        response.render('dashboardStu', {
                                            Details: res[0],
                                            Department: dept,
                                            RegTests: [],
                                            UnregTests: [],
                                            IneligibleTests: res1,
                                            OldTests: res2,
                                            Placed: "Yes"
                                        }, function(err1, html1){
                                            response.render('header', {
                                                username: req.session.username,
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
                }
            });
        }

        else if (role == 2)//faculty login
        {
            var faculty_details_query = "SELECT * FROM FACULTY WHERE USERNAME = '" + req.session.username + "'" ;

            connection.query(faculty_details_query, function(err, res, fields){

                if(res.length == 0)
                {
                    console.log("\n---------------------------\nDashboard Error: Couldn't retrieve faculty details\n---------------------------\n");
                    response.redirect('/logout');
                }

                else
                {
                    var dept;

                    var dept_details_query = "SELECT * FROM DEPARTMENT WHERE DEPARTMENTID = '" + res[0].DepartmentID + "';" ;

                    connection.query(dept_details_query, function(errid, resid){

                        if(errid)
                        {
                            throw errid;
                        }

                        else
                        {
                            dept = resid[0].Name;
                            var test_query = "SELECT * FROM TEST, COMPANY WHERE TEST.TESTID IN (SELECT TESTID FROM ELIGIBLEDEPARTMENTS WHERE DEPARTMENTID = " + res[0].DepartmentID + ") AND TEST.CompanyID = COMPANY.CompanyID ;";

                            connection.query(test_query, function(err3, res3){

                                if(err3)
                                {
                                    console.log(err3);
                                }
                                else
                                {
                                    response.render('dashboardFac', {
                                        ID: res[0].FacultyID,
                                        Name: res[0].Name,
                                        EmailID: res[0].EmailID,
                                        MobileNumber: res[0].MobileNumber,
                                        Department: dept,
                                        Tests: res3
                                    }, function(err1, html1){
                                        response.render('header', {
                                            username: req.session.username,
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

        else if (role == 3) // spc login
        {
            var spc_details_query = "SELECT * FROM SPC WHERE USERNAME = '" + req.session.username + "';" ;

            connection.query(spc_details_query, function(error, result){

                if(error)
                {
                    console.log("\n---------------------------\nBackend Error: Unable to retrieve spc details for dashboard\n---------------------------\n")
                }

                else
                {
                    var dept;

                    var dept_details_query = "SELECT * FROM DEPARTMENT WHERE DEPARTMENTID = '" + result[0].DepartmentID + "';" ;
                    connection.query(dept_details_query, function(errid, resid){

                        if(errid)
                        {
                            console.log("\n---------------------------\nBackend Error: Unable to retrieve department details for dashboard\n---------------------------\n")
                            response.redirect('/error');
                        }

                        else
                        {
                            dept = resid[0].Name;

                            var test_query = "SELECT * FROM TEST, COMPANY WHERE TEST.TESTID IN (SELECT TESTID FROM ELIGIBLEDEPARTMENTS WHERE DEPARTMENTID = " + result[0].DepartmentID + ") AND TEST.CompanyID = COMPANY.CompanyID ;";

                            connection.query(test_query, function(errid, result2) {

                                response.render('dashboardSpc', {
                                    username: result[0].username,
                                    USN: result[0].USN,
                                    Department: dept,
                                    Username: req.session.username,
                                    Tests: result2

                                }, function(err1, html1){
                                    response.render('header', {
                                        username: req.session.username,
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
            var test_query = "SELECT * FROM TEST, COMPANY WHERE TEST.COMPANYID = COMPANY.COMPANYID;";

            connection.query(test_query, function(error, result){

                if(error)
                {
                    console.log("\n---------------------------\nBackend Error: Unable to retrieve test details for dashboard\n---------------------------\n");
                }

                else
                {
                    response.render('dashboardPlacementCell', {Tests: result});
                }
            });
        }
    }
}