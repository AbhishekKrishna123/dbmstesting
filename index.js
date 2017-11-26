
///////////////////////////////////////////////////
////////////////// Packages //////////////////////
/////////////////////////////////////////////////


var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended: false});

var path = require("path");

var xl = require("exceljs");

var mysql = require("mysql");

// connect strings for mysql
var connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
    password: "root",
    dateStrings:true,
    database: "dbms",
    multipleStatements: true
});

// For persisting sessions in the database
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'dbms'
};

var sessionStore = new MySQLStore(options);
 
// For sessions
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// Connect to database
connection.connect();

app.use(bodyParser.text());
app.use(express.static('templates'));

// Set up handlebars
var exphbs  = require('express-handlebars');
var hbs = exphbs.create({ /* config */ });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

/*---------------------------------------------------------------------------------------------------------------- */


///////////////////////////////////////////////////////
/////////////////// COMMON URLS ///////////////////////
//////////////////////////////////////////////////////

app.get('/', function(req, res) {

    if (req.session.username)
    {
        res.redirect('/dashboard');
    }

    else
    {
        res.render('home');
    }

});

//--------------------------------------------------------------------------------------------

app.post('/login', urlEncodedParser, function(request, response){

    var login = require('./login.js');
    login.Login(connection, request, response);

});

//--------------------------------------------------------------------------------------------

app.get('/dashboard', function(req, res) {

    if (req.session.username)
    {
        if(req.session.username[0] == '1')
        {
            var dept_query = "SELECT * FROM DEPARTMENT WHERE DEPARTMENTID IN (SELECT DEPARTMENT FROM STUDENT WHERE USN = '" + req.session.username + "');";

            connection.query(dept_query, function(error, result){
                if(error)
                {
                    console.log("\n---------------------------\nDashboard Error: Unable to retrieve Department ID\n---------------------------\n")
                    res.redirect('/error');
                }
                else
                {
                    var dashboard = require("./dashboard.js");
                    dashboard.Dashboard(connection, req, res, result[0].DepartmentID);
                }
            });
        }

        else
        {
            var dashboard = require("./dashboard.js");
            dashboard.Dashboard(connection, req, res, '');
        }
    }

    else
    {
        res.redirect('/');
    }
});

//--------------------------------------------------------------------------------------------

app.get('/error', function(req, res){

    res.render('error');

});


//--------------------------------------------------------------------------------------------

app.get('/password_change', function (req, res){

    if (req.session.username)
    {
        res.render('passwordChange', {username: req.session.username});
    }
    else
    {
        res.redirect('/');
    }
});

//--------------------------------------------------------------------------------------------

app.post('/password_change', urlEncodedParser, function (req, res){

    var passwordChange = require ("./passwordChange.js");
    passwordChange.PasswordChange(req, res, connection);

});


//--------------------------------------------------------------------------------------------

app.get('/password_change_success', function (req, res){

    res.render('passwordChangeSuccess');
});

//--------------------------------------------------------------------------------------------

app.get('/password_change_fail', function (req, res){

    res.render('passwordChangeFail');
});

//--------------------------------------------------------------------------------------------

app.get('/logout', function(req, res)
{
    if (req.session.username)
    {
        req.session.destroy();
        res.redirect('/');
    }

    else
    {
        res.redirect('/');
    }

});

/* --------------------------------------------------------------------------------------------------------------------- */

///////////////////////////////////////////////////////
/////////////////// STUDENT URLS ///////////////////////
//////////////////////////////////////////////////////


app.get('/register', function(req, res){

    connection.query("SELECT * FROM DEPARTMENT;", function(error, result){
        if (error)
        {
            throw error;
        }

        else
        {
            res.render('register', {Departments: result});
        }
    });
});

//--------------------------------------------------------------------------------------------

app.post('/register', urlEncodedParser, function(req, res){

    var body = req.body;
    var reg = require('./register.js');
    reg.Reg(connection, body, res);

});

//--------------------------------------------------------------------------------------------

app.post('/test_register', urlEncodedParser, function(req, res){

    var body = req.body;

    var insertVals =
    {
        USN: req.session.username,
        TestID: body.ID
    }

    connection.query("INSERT INTO REGISTER SET ?", insertVals, function(error, result){
        if(error)
        {
            console.log("\n---------------------------\nBackend Error: Unable to insert into table Register\n---------------------------\n");
            res.redirect('/error');
        }

        else
        {
            res.send({status: 200});
        }
    });
});

//--------------------------------------------------------------------------------------------

app.post('/test_unregister', urlEncodedParser, function(req, res)
{
    var delete_query = "DELETE FROM REGISTER WHERE USN = '" + req.session.username + "' AND TESTID = '" + req.body.ID + "';";

    connection.query(delete_query, function(error, result)
    {
        if(error)
        {
            console.log("\n---------------------------\nBackend Error: Unable to delete from table Register\n---------------------------\n");
            res.redirect('/error');
        }
        else
        {
            res.send({status: 200});
        }
    });
});

/* --------------------------------------------------------------------------------------------------------------------- */

///////////////////////////////////////////////////////
///////////////// SPC AND FAC URLS ///////////////////
/////////////// AND PLACEMENT DEPARTMENT /////////////
//////////////////////////////////////////////////////


app.get('/add_company_test', function(req, res){

    if (req.session.username && req.session.role != 1)
    {
        var retrieveCompanies;

        connection.query("SELECT * FROM COMPANY", function(err1, result1){

            //console.log("\n\nCOM LIST: " + result1[0].CompanyName + "\n\n");

            var companyNames = [];
            for(var i=0, l=result1.length; i<l; i++) {

                companyNames.push(result1[i].CompanyName);
            }

            //console.log(companyNames);

            connection.query("SELECT * FROM DEPARTMENT", function(error2, result2){

                //console.log(result2[0]);

                res.render('header', {username: req.session.username}, function(err1, html1) {
                    res.render('addCompanyTest', {Companies: companyNames, Departments: result2}, function(err2, html2) {
                        res.render('template', { header: html1 , body:html2 })
                    });
                })
            });
        });
    }

    else
    {
        res.redirect('/');
    }
});

//--------------------------------------------------------------------------------------------

app.post('/add_company_test', urlEncodedParser, function(req, res){

    var addCompanyTest = require('./addCompanyTest.js');

    var body = req.body;
    var companyName = body.companyname;

    //console.log("FORM CNAME = " + companyName);
    var company_details_query = "SELECT * FROM COMPANY WHERE COMPANYNAME LIKE '" + companyName + "%';" ;
    connection.query(company_details_query, function(error, result){

        if (error)
        {
            console.log("\n---------------------------\nBackend Error: Unable to retrieve company details from table Company\n---------------------------\n");
            res.redirect('/error');
        }
        else
        {
            var companyID = result[0].CompanyID;
            addCompanyTest.addTest(req, res, connection, companyID);
        }
    });
});

//--------------------------------------------------------------------------------------------

app.get('/add_company', function(req, res){

    if(req.session.username && req.session.role != 1)
    {
        res.render('addCompany');
    }
    else
    {
        res.redirect('/');
    }
});

//--------------------------------------------------------------------------------------------

app.post('/add_company', urlEncodedParser, function(req, res){

    var addCompany = require('./addCompany.js');
    addCompany.addCompany(req, res, connection);
});

//--------------------------------------------------------------------------------------------

app.get('/add_test_result', function(req, res){

    if(req.session.username && req.session.role != 1)
    {
        var date= new Date();
        var currentDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();

        var query_test = "SELECT * FROM TEST WHERE TESTDATE < '" + currentDate + "';";

        //console.log(currentDate);

        connection.query(query_test, function(error, result){
            if (error)
            {
                console.log("\n---------------------------\nBackend Error: Unable to retrieve test details from Test\n---------------------------\n");
                res.redirect('/error');
            }
            else
            {
                res.render('addTestResult', {Tests: result, username: req.session.username});
            }
        });
    }

    else
    {
        res.redirect('/');
    }
});

//--------------------------------------------------------------------------------------------

app.post('/add_test_result', urlEncodedParser, function(req, res){

    res.redirect('/add_selected_students?test=' + req.body.test);

});

//--------------------------------------------------------------------------------------------

app.get('/add_selected_students', urlEncodedParser, function(req, res){

    var test = req.query.test;
    // console.log(rwq);
    var query_student = "SELECT * FROM STUDENT,REGISTER WHERE TESTID = '" + test + "' AND STUDENT.USN = REGISTER.USN AND STUDENT.DEPARTMENT IN (SELECT DEPARTMENTID FROM SPC WHERE USERNAME = '" + req.session.username + "' AND STUDENT.PLACED = );";

    console.log(query_student);
    connection.query(query_student, function(error, result){
        if (error)
        {
            console.log("\n---------------------------\nBackend Error: Unable to retrieve list of registered students\n---------------------------\n");
            res.redirect('/error');
        }
        else
        {
            //console.log("STUDENTS\n\n" + result.length);

            // res.render('header', {username: req.session.username}, function(err, html) {
            //     res.render('addSelectedStudents', {Students: result}, function(err2, html2) {
            //         res.render('template', {header: html, body: html2});
            //     });
            // });
            res.render('addSelectedStudents', {Students: result, username: req.session.username});
        }
    });
});

//--------------------------------------------------------------------------------------------


app.post('/add_selected_students', urlEncodedParser, function(req, res){

    console.log(req.body);

    var usnList = req.body.list.split(" ");
    //console.log(usnList[0]);
    var register_query = "";

    for (i = 0; i <usnList.length-1; i++) {
        register_query += "UPDATE REGISTER SET SELECTED = 'YES' WHERE USN = '" + usnList[i] + "' AND TESTID = '" + req.body.testid + "';";
    }

    console.log(register_query);

    connection.query(register_query, function(error, result){
        if (error)
        {
            console.log("\n---------------------------\nBackend Error: Unable to update table Register to add selected students\n---------------------------\n");
            //res.redirect('/error');
        }
        else
        {
            console.log("Success");
            res.send({status: 200});
        }
    });
});

//--------------------------------------------------------------------------------------------

app.post('/add_offer_students', urlEncodedParser, function(req, res){

    var body = req.body;
    // console.log(body);
    var list = body.list.split(" ");
    var company = body.company;

    var update_query = "";
    for (i = 0; i <list.length-1; i++) {
        update_query += "UPDATE STUDENT SET PLACED = 'Yes' WHERE USN = '" + list[i] + "';";
    }

    var insert_query = "";



    for (i = 0; i <list.length-1; i++) {
        insert_query += "INSERT INTO OFFER (USN, COMPANYID) VALUES ('" + list[i] + "', '" + company + "');";
    }

    // console.log(insert_query);
    // console.log(update_query);
    console.log(insert_query);


    connection.query(update_query, function(error1, result1){

        if(error1)
        {
            console.log("\nBackend Error. Couldn't update Student to reflect offer\n");
        }
        else
        {
            connection.query(insert_query, function(error2, result2){

                if(error2)
                {
                    console.log("\nBackend Error: Couldn't Insert into table Offer\n");
                }
                else
                {
                    res.send({status: 200});
                }
            });

        }
    });


});

//--------------------------------------------------------------------------------------------

app.get('/add_offer', function(req, res){

    var date= new Date();
    var currentDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();

    connection.query("SELECT * FROM COMPANY, TEST WHERE COMPANY.COMPANYID = TEST.COMPANYID AND TEST.TESTDATE < '" + currentDate + "';", function(err, result){

        if(err)
        {
            console.log("\nBackend Error: Couldnt retrieve tests for adding offer\n");
        }
        else
        {
            res.render('addOfferTest', {CompaniesTests: result, username: req.session.username});
        }
    });
});

//--------------------------------------------------------------------------------------------

app.post('/add_offer', urlEncodedParser, function(req, res){

    var body = req.body;
    //console.log(body.company);
    var query = "SELECT * FROM DEPARTMENT, REGISTER, COMPANY, TEST, STUDENT WHERE COMPANY.COMPANYID = '" + body.company +
    "' AND TEST.COMPANYID = '" + body.company + "' AND REGISTER.TESTID = TEST.TESTID AND REGISTER.USN = STUDENT.USN" +
    " AND REGISTER.SELECTED = 'YES' AND DEPARTMENT.DEPARTMENTID = STUDENT.DEPARTMENT AND STUDENT.PLACED = 'NO';";

    connection.query(query, function(err, result){

        if (err)
        {
            console.log("\nBackend Error: Couldn't retrieve selected students details for adding offer\n");
        }
        else
        {
            //console.log(result);
            res.render('addOfferStudents', {Students: result, username: req.session.username});
        }
    });
});

//--------------------------------------------------------------------------------------------

app.get("/report", function(req, res) {

    if(req.session.username && req.session.role != 1)
    {
        var query = "SELECT * FROM REGISTER";

        connection.query(query, function(err, result) {

            if (err)
            {
                console.log("\n---------------------------\nBackend Error: Unable to retrieve list of registered students\n---------------------------\n");
                res.redirect('/error');
            }

            else
            {
                var workbook = new xl.Workbook();
                var worksheet = workbook.addWorksheet('Register Report');
                worksheet.columns = [
                    { header: 'USN', key: 'USN', width: 20 },
                    { header: 'TESTID', key: 'TESTID', width: 20 },
                    { header: 'SELECTED', key: 'SELECTED', width: 20 }
                ];

                for (var i=0; i<result.length; i++) {
                    worksheet.addRow([result[i].USN, result[i].TestID, result[i].Selected]);
                }

                workbook.xlsx.writeFile("Report.xlsx")
                .then(function() {
                    "File saved!";
                });
            }
        });

        res.redirect("/dashboard");
    }

    else
    {
        res.redirect('/');
    }

});

/* --------------------------------------------------------------------------------------------------------------------- */

///////////////////////////////////////////////////////
//////////////////// ADMIN URLS //////////////////////
//////////////////////////////////////////////////////


app.get('/add_remove_users', function(req, res)
{
    if(req.session.username && req.session.role == 0)
    {
        connection.query("SELECT * FROM USER WHERE USERNAME NOT LIKE \"1RV%\" ORDER BY ROLE ASC", function(error, result)
        {
            if (error)
            {
                console.log("\n---------------------------\nBackend Error: Unable to retrieve list of users for admin\n---------------------------\n")
                res.redirect('/error');
            }
            else
            {
                res.render('header', {username: req.session.username}, function(err, html) {
                    res.render('addRemoveUsers', {Users: result}, function(err2, html2) {
                        res.render('template', {header: html, body: html2});
                    });
                });
            }
        });
    }

    else
    {
        res.redirect('/');
    }
});

//--------------------------------------------------------------------------------------------

app.post('/remove_user', urlEncodedParser, function(req, res){

    var body = req.body;
    var del_query = "DELETE FROM USER WHERE USERNAME = '" + body.username + "';";

    connection.query(del_query, function(error, result)
    {
        if(error)
        {
            console.log("\n---------------------------\nBackend Error: Unable to delete user\n---------------------------\n")
            res.redirect('/error');
        }
        else
        {
            res.send({status: 200});
        }
    });
});

//--------------------------------------------------------------------------------------------


app.get('/add_new_user', function(req, res)
{
    if(req.session.username && req.session.role == 0)
    {
        connection.query("SELECT * FROM DEPARTMENT", function(error, result)
        {
            if(error)
            {
                console.log("\n---------------------------\nBackend Error: Unable to get list of departments to add new user\n---------------------------\n")
                res.redirect('/error');
            }
            else
            {
                res.render('addNewUser', {Departments: result});
            }
        });

    }
    else
    {
        res.redirect('/');
    }
});

//--------------------------------------------------------------------------------------------

app.post('/add_new_user', urlEncodedParser, function(req, res)
{
    var role;
    var body = req.body;
    if(body.role == "faculty") role = 2;
    else if(body.role == "spc") role = 3;

    var insertVals = {
        username: body.username,
        password: body.password,
        role: role
    };

    connection.query("INSERT INTO USER SET ?", insertVals, function(error, result){

        if(error)
        {
            console.log("\n---------------------------\nBackend Error: Unable to insert new user\n---------------------------\n");
            res.redirect('/error');
        }

        else
        {
            if(role == 2)
            {
                var newInsert =
                {
                    FacultyID: body.id,
                    DepartmentID: body.department,
                    Name: body.name,
                    Username: body.username,
                    EmailID: body.email,
                    MobileNumber: body.mobile
                }

                connection.query("INSERT INTO FACULTY SET ?", newInsert, function(err2, result2){

                    if(err2)
                    {
                        console.log("\n---------------------------\nBackend Error: Unable to insert new faculty user\n---------------------------\n")
                        res.redirect('/error');
                    }
                    else
                    {
                        res.redirect('/dashboard');
                    }
                });
            }

            else if (role == 3)
            {
                var newInsert =
                {
                    USN: body.id,
                    DepartmentID: body.department,
                    Username: body.username
                }
                connection.query("INSERT INTO SPC SET ?", newInsert, function(err2, result2){

                    if(err2)
                    {
                        console.log("\n---------------------------\nBackend Error: Unable to insert new SPC user\n---------------------------\n");
                        res.redirect('/error');
                    }
                    else
                    {
                        res.redirect('/dashboard');
                    }
                });

            }

            else res.redirect('/dashboard');
        }
    });


});

//--------------------------------------------------------------------------------------------


app.get('/test', function(req, res) {

    if(req.session.username && req.session.role != 1)
    {

        if(req.session.role == 3) //spc
        {
            var query = "SELECT * FROM REGISTER, STUDENT WHERE TESTID = " + req.query.id + " AND REGISTER.USN = STUDENT.USN AND STUDENT.DEPARTMENT IN (SELECT DEPARTMENTID FROM SPC WHERE USERNAME = '" + req.session.username + "');";
            var query3 = "SELECT * FROM REGISTER, STUDENT WHERE TESTID = " + req.query.id + " AND REGISTER.USN = STUDENT.USN AND REGISTER.SELECTED = 'YES' AND STUDENT.DEPARTMENT IN (SELECT DEPARTMENTID FROM SPC WHERE USERNAME = '" + req.session.username + "');";
        }
        else if (req.session.role == 2) //faculty
        {
            var query = "SELECT * FROM REGISTER, STUDENT WHERE TESTID = " + req.query.id + " AND REGISTER.USN = STUDENT.USN AND STUDENT.DEPARTMENT IN (SELECT DEPARTMENTID FROM FACULTY WHERE USERNAME = '" + req.session.username + "');";
            var query3 = "SELECT * FROM REGISTER, STUDENT WHERE TESTID = " + req.query.id + " AND REGISTER.USN = STUDENT.USN AND REGISTER.SELECTED = 'YES' AND STUDENT.DEPARTMENT IN (SELECT DEPARTMENTID FROM FACULTY WHERE USERNAME = '" + req.session.username + "');";
        }
        else
        {
            var query = "SELECT * FROM REGISTER, STUDENT WHERE TESTID = " + req.query.id + " AND REGISTER.USN = STUDENT.USN;";
            var query3 = "SELECT * FROM REGISTER, STUDENT WHERE TESTID = " + req.query.id + " AND REGISTER.USN = STUDENT.USN AND REGISTER.SELECTED = 'YES';";
        }


        var query2 = "SELECT * FROM TEST, COMPANY WHERE TEST.TESTID = " + req.query.id + " AND TEST.COMPANYID = COMPANY.COMPANYID;";



        connection.query(query, function(err, result1) {

            connection.query(query2, function(err2, result2) {

                connection.query(query3, function(err3, result3){

                    res.render('header', {username: req.session.username}, function(err, html) {
                        res.render('test', {Test: result2, Reg: result1, Selected: result3}, function(err2, html2) {
                            res.render('template', {header: html, body: html2});
                        });
                    });
                });
            });
        });
    }
    else
    {
        res.redirect('/');
    }
});

app.get('/offer', function(req, res) {
    var query = "SELECT * FROM REGISTER, STUDENT WHERE TESTID = " + req.query.id + " AND REGISTER.USN = STUDENT.USN";
    var query2 = "SELECT * FROM TEST WHERE TEST.TESTID = " + req.query.id;

    connection.query(query, function(err, result1) {

        connection.query(query2, function(err2, result2) {

            res.render('header', {username: req.session.username}, function(err, html) {
                res.render('offer', {Test: result2, Reg: result1}, function(err2, html2) {
                    res.render('template', {header: html, body: html2});
                });
            });
        });
    });
});

app.get('/stats', function(req, res) {

    var query1 = "SELECT CompanyName, COUNT(CompanyName) AS Num FROM TEST INNER JOIN COMPANY ON TEST.CompanyID = COMPANY.CompanyID GROUP BY COMPANY.CompanyID";
    var query2 = "SELECT COUNT(CompanyName) AS TotalTests FROM TEST INNER JOIN COMPANY ON TEST.CompanyID = COMPANY.CompanyID";
    var query3 = "SELECT FirstName, LastName, STUDENT.USN, CompanyName FROM OFFER INNER JOIN COMPANY ON OFFER.CompanyID = COMPANY.CompanyID INNER JOIN STUDENT ON OFFER.USN = STUDENT.USN;";
    var query4 = "SELECT COUNT(*) AS TotalPlaced FROM OFFER;";
    var query5 = "SELECT * FROM TEST, STUDENT, REGISTER, COMPANY WHERE TEST.TestID = REGISTER.TestID AND Test.CompanyID = Company.CompanyID AND REGISTER.USN = STUDENT.USN GROUP BY COMPANY.CompanyID";

    connection.query(query1, function(err, result1) {
        connection.query(query2, function(err, result2) {
            connection.query(query3, function(err, result3) {
                connection.query(query4, function(err, result4) {

                    console.log(result4);
                    res.render('stats', { Tests: result1, TotalTests: result2[0].TotalTests, Students: result3, TotalPlaced: result4[0].TotalPlaced });

                });
            });
        });
    });



});

app.listen(3000);