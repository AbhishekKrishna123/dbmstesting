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

        //console.log ("\nBody:\n" + JSON.stringify(body));

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

            //console.log("OTSIDE + " + result1);
            if(err1)
            {
                throw err1;
                console.log("ERRIRRIRRRR " + err1);
            }
            else
            {
                //console.log("TEST RES\n" + result1);

                connection.query("SELECT * FROM TEST WHERE COMPANYID = '" + companyID + "' AND NAME = '" + body.testname +"';", function(err, res){
                    if (err)
                    {
                        throw err;
                    }
                    else
                    {
                        console.log("SELECT TES: \n" + res);
                        connection.query("SELECT CODE FROM DEPARTMENT", function(err2, result2) {
                            if (err2) throw err2;
                            else {

                                //console.log("RESULT2 ++++" + result2 + "/n/n");

                                // INSERT ELIGIBLE DEPTS
                                insertVals2 = [];

                                // for (i=0; i<result2.length; i++) {
                                //     var str = result2[i].Code;

                                //     console.log("str = "+str);

                                //     console.log(body.str);

                                //     if (body.str) {
                                //         console.log ("The i value is: " + i);
                                //     }
                                // }

                                if(body.ASE) insertVals2.push({DepartmentID: 1, TestID: res[0].TestID});
                                if(body.BT) insertVals2.push({DepartmentID: 2, TestID: res[0].TestID});
                                if(body.CHE) insertVals2.push({DepartmentID: 3, TestID: res[0].TestID});
                                if(body.CV) insertVals2.push({DepartmentID: 4, TestID: res[0].TestID});
                                if(body.CSE) insertVals2.push({DepartmentID: 5, TestID: res[0].TestID});
                                if(body.EEE) insertVals2.push({DepartmentID: 6, TestID: res[0].TestID});
                                if(body.ECE) insertVals2.push({DepartmentID: 7, TestID: res[0].TestID});
                                if(body.EIE) insertVals2.push({DepartmentID: 8, TestID: res[0].TestID});
                                if(body.IEM) insertVals2.push({DepartmentID: 9, TestID: res[0].TestID});
                                if(body.ISE) insertVals2.push({DepartmentID: 10, TestID: res[0].TestID});
                                if(body.MCA) insertVals2.push({DepartmentID: 11, TestID: res[0].TestID});
                                if(body.ME) insertVals2.push({DepartmentID: 12, TestID: res[0].TestID});
                                if(body.TE) insertVals2.push({DepartmentID: 13, TestID: res[0].TestID});

                                // for(var i = 0; i < insertVals2.length; i++)
                                // {
                                //     connection.query("INSERT INTO ELIGIBLEDEPARTMENTS SET ?", insertVals2[i], function(err, result) {
                                //         if(err)
                                //         {
                                //             console.log("ERROR");
                                //         }
                                //         else{
                                //             console.log("SUCCESS INSERTED ELIG DEPARTEMT" + result);
                                //         }
                                //     });
                                // }
                                var ins_q = "INSERT INTO ELIGIBLEDEPARTMENTS VALUES ";
                                var i = 0;
                                for(i ; i < insertVals2.length-1; i++)
                                {
                                    ins_q += "('" + insertVals2[i].DepartmentID + "', '" + insertVals2[i].TestID + "'),";
                                }
                                ins_q += "('" + insertVals2[i].DepartmentID + "', '" + insertVals2[i].TestID + "')";
                                //ins_q[ins_q.length-2] = ';';

                                console.log("INS Q: " + ins_q);

                                connection.query(ins_q, function(err3, result3) {
                                        if(err3)
                                        {
                                            console.log("ERROR");
                                            console.log(err3);
                                        }
                                        else{
                                            console.log("SUCCESS INSERTED ELIG DEPARTEMT" + result3);
                                        }
                                    });
                            }
                        });
                    }
                });
            }
        });

        res.redirect('/');

    }
}