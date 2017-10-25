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
                    
                    response.render('dashboard_stu', {
                        USN: req.session.username,
                        FirstName: res[0].FirstName,
                        LastName: res[0].LastName,
                        EmailID: res[0].EmailID,
                        MobileNumber: res[0].MobileNumber,
                        Section: res[0].Section,
                        Address: res[0].Address,
                        Gender: res[0].Gender,
                        DiplomaStudent: res[0].DiplomaStudent,
                        StudentType: res[0].StudentType,
                        Semester: res[0].Semester,
                        CGPA: res[0].CGPA,
                        Marks10th: res[0].Marks10th,
                        Marks12th: res[0].Marks12th
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

                        response.render('dashboard_notstu', {
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