var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended: false});

var path = require("path");

var express = require("express");
var app = express();

var mysql = require("mysql");

module.exports =
{
    addTest : function(req, res, connection, companyID)
    {
        var body = req.body;
        var date = new Date(body.testdate);
        var currentDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();

        var insertVals =
        {
            CompanyID : companyID,
            Name : body.testname,
            TestDate: currentDate,
            TestTime: body.testtime,
            Location: body.testlocation,
            Details: body.otherdetails,
            CutOffGPA: body.cutoffgpa
        };

        connection.query("INSERT INTO TEST SET ?", insertVals, function(err1, result1) {

            if(err1)
            {
                console.log("\n---------------------------\nbackend Error: Unable to insert into table Test\n---------------------------\n");
                res.redirect('/error');                
            }
            else
            {
                var company_test_details_query = "SELECT * FROM TEST WHERE COMPANYID = '" + companyID + "' AND NAME = '" + body.testname +"';" ;
                
                connection.query(company_test_details_query, function(err, res){

                    if (err)
                    {
                        console.log("\n---------------------------\nBackend Error: Unable to retrieve company test details\n---------------------------\n")
                        res.redirect('/error');
                    }

                    else
                    {
                        var dept_codes_query = "SELECT CODE FROM DEPARTMENT" ; 

                        connection.query(dept_codes_query, function(err2, result2) {

                            if (err2)
                            {
                                console.log("\n---------------------------\nBackend Error: Unable to get department codes\n---------------------------\n")
                                res.redirect('/error');
                            } 
                            
                            else 
                            {
                                insertVals2 = [];

                                if(body.ASE) insertVals2.push({DepartmentID: 1, TestID: res[0].TestID});
                                if(body.BT)  insertVals2.push({DepartmentID: 2, TestID: res[0].TestID});
                                if(body.CHE) insertVals2.push({DepartmentID: 3, TestID: res[0].TestID});
                                if(body.CV)  insertVals2.push({DepartmentID: 4, TestID: res[0].TestID});
                                if(body.CSE) insertVals2.push({DepartmentID: 5, TestID: res[0].TestID});
                                if(body.EEE) insertVals2.push({DepartmentID: 6, TestID: res[0].TestID});
                                if(body.ECE) insertVals2.push({DepartmentID: 7, TestID: res[0].TestID});
                                if(body.EIE) insertVals2.push({DepartmentID: 8, TestID: res[0].TestID});
                                if(body.IEM) insertVals2.push({DepartmentID: 9, TestID: res[0].TestID});
                                if(body.ISE) insertVals2.push({DepartmentID: 10, TestID: res[0].TestID});
                                if(body.MCA) insertVals2.push({DepartmentID: 11, TestID: res[0].TestID});
                                if(body.ME)  insertVals2.push({DepartmentID: 12, TestID: res[0].TestID});
                                if(body.TE)  insertVals2.push({DepartmentID: 13, TestID: res[0].TestID});

                                var ins_q = "INSERT INTO ELIGIBLEDEPARTMENTS VALUES ";
                                
                                var i = 0;

                                for(i ; i < insertVals2.length-1; i++)
                                {
                                    ins_q += "('" + insertVals2[i].DepartmentID + "', '" + insertVals2[i].TestID + "'),";
                                }
                                ins_q += "('" + insertVals2[i].DepartmentID + "', '" + insertVals2[i].TestID + "')";


                                connection.query(ins_q, function(err3, result3) {

                                    if(err3)
                                    {
                                        console.log("\n---------------------------\nBackend Error: Unable to insert into table EligibleDepartments\n---------------------------\n")
                                        res.redirect('/error');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

        res.redirect('/dashboard');
    }
}