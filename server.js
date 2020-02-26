var express = require("express")
var app = express()
const PORT = 3000;
var path = require("path")
var bodyParser = require("body-parser")
var logged = false;
var users = [{ name: "superadmin", password: "abc", age: 18, uczen: "on", gender: "m", id: 1 }]

app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname + "/static/main.html"))
 })

 app.get("/register", function(req, res){
    res.sendFile(path.join(__dirname + "/static/register.html"))
 })


 app.get("/login", function(req, res){
    res.sendFile(path.join(__dirname + "/static/login.html"))
 })

 app.get("/admin", function(req, res){
     if(logged){
        res.sendFile(path.join(__dirname + "/static/admin.html"))
     } else {
        res.sendFile(path.join(__dirname + "/static/not_admin.html"))
     }

 })

 app.get("/logout", function(req, res){
    logged = false;
    res.redirect("/");
})

app.get("/sort", function(req, res){
    if(logged){
        var body = "<body>"
        var buttons = "<a href='/sort' style='color:orange;margin:20px;'>Sort</a><a href='/gender' style='color:orange;margin:20px;'>Gender</a><a href='/show' style='color:orange;margin:20px;'>Show</a>"
        var form = '<form action="/sort" method="POST" onchange="this.submit()"><input type="radio" name="sort" value="up"><label>rosnąco</label><input type="radio" name="sort" value="down"><label>malejąco</label></form>'
        var table = "<table>"
        for(var i=0; i<users.length;i++){
            var tr = "<tr>"
            var td_id = "<td style='border: 1px solid orange;padding:10px;'>id: " + users[i].id + "</td>"
            var td_content = "<td style='border: 1px solid orange;padding:10px;'>user: " + users[i].name + " - " + users[i].password + "</td>"
            var td_age = "<td style='border: 1px solid orange;padding:10px;'>age: " + users[i].age + "</td>"
            tr += td_id + td_content + td_age
            tr += "</tr>"
            table += tr
        }
        table += "</table>"
        body += buttons
        body += form
        body += table
        body += "</body>"
        res.send(body);
    } else {
      res.sendFile(path.join(__dirname + "/static/not_admin.html"))
    }
})

app.get("/gender", function(req, res){
    if(logged){
      var body = "<body>"
      var buttons = "<a href='/sort' style='color:orange;margin:20px;'>Sort</a><a href='/gender' style='color:orange;margin:20px;'>Gender</a><a href='/show' style='color:orange;margin:20px;'>Show</a>"
      var w_table = "<table style='margin: 40px;'>"
      var m_table = "<table style='margin: 40px;'>"
      for(var i=0; i<users.length;i++){
          var tr = "<tr>"
          var td_id = "<td style='border: 1px solid orange;padding:10px;'>id: " + users[i].id + "</td>"
          var td_gender = "<td style='border: 1px solid orange;padding:10px;'>pleć: " + users[i].gender + "</td>"
          tr += td_id + td_gender
          tr += "</tr>"
          if(users[i].gender == "k"){
            w_table += tr
          } else {
            m_table += tr
          }
      }
      w_table += "</table>"
      m_table += "</table>"
      body += buttons
      body += w_table
      body += m_table
      body += "</body>"
      res.send(body);
    } else {
      res.sendFile(path.join(__dirname + "/static/not_admin.html"))
    }
})

app.get("/show", function(req, res){
    if(logged){
        var body = `<body><a href='/sort' style='color:orange;margin:20px;'>Sort</a><a href='/gender' style='color:orange;margin:20px;'>Gender</a><a href='/show' style='color:orange;margin:20px;'>Show</a>`
        var table = "<table style='margin: 40px;'>"
        for(var i=0; i<users.length;i++){
            var tr = "<tr>"
            var td_id = "<td style='border: 1px solid orange;padding:10px;'>id: " + users[i].id + "</td>"
            var td_content = "<td style='border: 1px solid orange;padding:10px;'>user: " + users[i].name + " - " + users[i].password + "</td>"
            if(users[i].uczen == "on"){
              var td_uczen = "<td style='border: 1px solid orange;padding:10px;'>uczen: " + '<form action="/set_uczen" method="POST" onchange="this.submit()"><input type="hidden" name="user" value=' + users[i].id + '><input type="checkbox" name="uczen" checked></form>'
            } else {
              var td_uczen = "<td style='border: 1px solid orange;padding:10px;'>uczen: " + '<form action="/set_uczen" method="POST" onchange="this.submit()"><input type="hidden" name="user" value=' + users[i].id + '><input type="checkbox" name="uczen"></form>'
            }
            var td_age = "<td style='border: 1px solid orange;padding:10px;'>age: " + users[i].age + "</td>"
            var td_gender = "<td style='border: 1px solid orange;padding:10px;'>pleć: " + users[i].gender + "</td>"
            tr += td_id + td_content + td_uczen + td_age + td_gender
            tr += "</tr>"
            table += tr
        }
        table += "</table>"
        body += table
        body += "</body>"
        res.send(body);
      } else {
       res.sendFile(path.join(__dirname + "/static/not_admin.html"))
      }
})

 app.post("/register", function(req, res) {
    var names = users.map(a => a.name);
    if(names.includes(req.body.name)){
        res.send("Już jest taki user");
    } else {
        user = req.body;
        user.id = users.length+1;
        users.push(user);
        res.redirect("/")
    }
 })

 app.post("/login", function(req, res) {
    var user_logs = req.body;
    var correct = false;
    for(var i=0; i<users.length;i++){
        if(user_logs.name == users[i].name && user_logs.password == users[i].password){
            correct = true;
        }
    }
    if(correct){
        logged = true;
        res.send("Zalogowano");
    } else {
        res.send("Podano złe dane");
    }
 })

 app.post("/sort", function(req, res) {
    if(req.body.sort == "up"){
        users = users.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age);
        });
    } else if(req.body.sort == "down"){
        users = users.sort(function (a, b) {
            return parseFloat(b.age) - parseFloat(a.age);
        });
    }
    res.redirect("/sort")
 })

 app.post("/set_uczen", function(req,res) {
   for(var i=0;i<users.length;i++){
     if(users[i].id == parseInt(req.body.user)){
       if(users[i].uczen == "on"){
         users[i].uczen = "off"
       } else{
         users[i].uczen = "on"
       }
     }
   }

   res.redirect("/show")
 })


//nasłuch na określonym porcie
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT )
})
