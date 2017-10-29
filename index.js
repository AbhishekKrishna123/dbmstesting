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
    res.sendFile('register.html', { root: path.join(__dirname, 'templates') });
});

app.get('/dashboard', function(req, res) {
    if (req.session.username) {
        //res.render('dashboard', { name: req.session.FirstName, USN: req.session.USN });

        var dashboard = require("./dashboard.js");
        dashboard.Dashboard(connection, req, res);

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

    if (req.session.username)
    {
        var retrieveCompanies;

        connection.query("SELECT * FROM COMPANY", function(err, result){

            console.log("\n\nCOM LIST: " + result[0].Name + "\n\n");

            var companyNames = [];
            for(var i=0, l=result.length; i<l; i++) {

                companyNames.push(result[i].Name);
            }

            console.log(companyNames);
            //var comList = {companies: companyNames};
            res.render('addCompanyTest', {Companies: companyNames});

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
    
    if(req.session.username)
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


app.get('/logout', function(req, res){

    if (req.session.username)
    {
        req.session.destroy();
        res.redirect('/');
    }
    else res.redirect('/');
});

app.listen(3000);



