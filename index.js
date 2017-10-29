var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended: false});
var path = require("path");

var mysql = require("mysql");
// connect strings for mysql
var connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
    password: "root",
    dateStrings:true,
	database: "dbms"
});

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
 
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

// connecting ......
connection.connect();

app.use(session({secret: "secret"}));

app.use(bodyParser.text());
app.use(express.static('templates'));


var exphbs  = require('express-handlebars');
var hbs = exphbs.create({ /* config */ });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');



app.get('/', function(req, res) {
    if (req.session.username) {
        res.redirect('/dashboard');
    }

    res.sendFile('home.html', { root: path.join(__dirname, 'templates')});
});


app.post('/login', urlEncodedParser, function(request, response){
    //res.sendFile('success.html', { root: path.join(__dirname, 'templates') });
    console.log(request.body.username + " : USN\n\n" + request.body.password + " : password\n\n");

    var login = require('./login.js');

    login.Login(connection, request, response);

});


app.get('/register', function(req, res){
    //res.sendFile('register.html', { root: path.join(__dirname, 'templates') });
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
    //res.render('/register')
});

app.get('/dashboard', function(req, res) {
    if (req.session.username) {
        //res.render('dashboard', { name: req.session.FirstName, USN: req.session.USN });

        if(req.session.username[0] == '1')
        {
            var q = "SELECT * FROM DEPARTMENT WHERE DEPARTMENTID IN (SELECT DEPARTMENT FROM STUDENT WHERE USN = '" + req.session.username + "');";
            connection.query(q, function(error, result){
                if(error)
                {
                    throw error;
                }
                else
                {
                    console.log(result[0].DepartmentID);
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
    else {

        res.redirect('/');
    }

});

app.post('/register', urlEncodedParser, function(req, res){

    var body = req.body;
    var reg = require('./register.js');
    reg.Reg(connection, body, res);

});


app.get('/password_change', urlEncodedParser, function (req, res){
    if (req.session.username) {
        res.render('password_change');
    }
    else {
        res.redirect('/');
    }
});

app.post('/password_change', urlEncodedParser, function (req, res){

    //var body = req.body;
    //console.log("OITSIDE" + req.session.username);
    var password_change = require ("./password_change.js");
    password_change.PasswordChange(req, res, connection);

});

app.get('/add_company_test', function(req, res){

    if (req.session.username && req.session.role != 1)
    {
        var retrieveCompanies;

        connection.query("SELECT * FROM COMPANY", function(err1, result1){

            console.log("\n\nCOM LIST: " + result1[0].Name + "\n\n");

            var companyNames = [];
            for(var i=0, l=result1.length; i<l; i++) {

                companyNames.push(result1[i].Name);
            }

            console.log(companyNames);
            //var comList = {companies: companyNames};

            //res.render('addCompanyTest', {Companies: companyNames});
            connection.query("SELECT DEPARTMENTID, NAME, CODE FROM DEPARTMENT", function(error2, result2){
                console.log(result2[0]);
                res.render('addCompanyTest', {Companies: companyNames, Departments: result2});
            });

        });
    }

    else
    {
        res.redirect('/');
    }
});

app.post('/add_company_test', urlEncodedParser, function(req, res){

    var addCompanyTest = require('./addCompanyTest.js');

    var body = req.body;
    var companyName = body.companyname;

    console.log("FORM CNAME = " + companyName);

    connection.query("SELECT * FROM COMPANY WHERE NAME LIKE '" + companyName + "%';", function(error, result){
        if (error) throw error;
        else
        {
            console.log(result);
            var companyID = result[0].CompanyID;
            addCompanyTest.addTest(req, res, connection, companyID);
        }
    });
});

app.get('/add_company', function(req, res){
    
    if(req.session.username && req.session.role != 1)
    {
        res.render('addCompany');
    }
    else res.redirect('/');
});

app.post('/add_company', urlEncodedParser, function(req, res){
    var addCompany = require('./addCompany.js');
    addCompany.addCompany(req, res, connection);
});


app.post('/testregister', urlEncodedParser, function(req, res){

    console.log("ID" + req.body.ID);
    var body = req.body;

    var insertVals =
    {
        USN: req.session.username,
        TestID: body.ID
    }

    connection.query("INSERT INTO REGISTER SET ?", insertVals, function(error, result){
        if(error)
        {
            console.log("ERROR");
            throw error;
        }

        else
        {
            console.log("TESTREG SUCCESS");
            res.send({status: 200});
            //res.redirect('/dashboard');
        }
    });
});

app.post('/testunregister', urlEncodedParser, function(req, res)
{
    var delete_query = "DELETE FROM REGISTER WHERE USN = '" + req.session.username + "' AND TESTID = '" + req.body.ID + "';"; 
    connection.query(delete_query, function(error, result)
    {
        if(error)
        {
            throw error;
        }
        else
        {
            console.log("UNREG SUCCESS!");
            res.send({status: 200});
        }
    });
});

app.get('/add_remove_users', function(req, res)
{
    if(req.session.username && req.session.role == 0)
    {
        connection.query("SELECT * FROM USER WHERE USERNAME NOT LIKE \"1RV%\" ORDER BY ROLE ASC", function(error, result)
        {
            if (error)
            {
                throw error;
            }
            else
            {
                res.render('addRemoveUsers', {Users: result});
            }
        });
    }

    else res.redirect('/');
    
});

app.post('/remove_user', urlEncodedParser, function(req, res){

    if(req.session.role == 0)
    var body = req.body;
    var del_query = "DELETE FROM USER WHERE USERNAME = '" + body.username + "';";
    connection.query(del_query, function(error, result)
    {
        if(error)
        {
            throw error;
        }
        else
        {
            console.log("DELETED USER SUCCESSFULLY!");
            res.send({status: 200});
        }
    });
});


app.get('/add_user', function(req, res)
{
    res.render('addNewUser');
});

app.post('/add_new_user', urlEncodedParser, function(req, res)
{
    var role;
    var body = req.body;
    if (body.role == "admin") role = 0;
    else if(body.role == "faculty" || body.role == "spc") role = 2;

    var insertVals = {
        username: body.username,
        password: body.password,
        role: role
    };

    connection.query("INSERT INTO USER SET ?", insertVals, function(error, result){
        if(error)
        {
            console.log("ERROR");
            throw error;
        }

        else
        {
            console.log("NEW USER ADDED SUCCESS");
            res.redirect('/dashboard');
        }
    });
});


app.get('/logout', function(req, res){

    if (req.session.username)
    {
        req.session.destroy();
        res.redirect('/');
    }
    else res.redirect('/');
});

app.listen(3000);



