//REQUIRING THE MODULES

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");

// API Configure

require("dotenv").config();
const api = process.env.API_KEY;
const audienceID = process.env.LIST_ID;
const server = process.env.API_SERVER;

//CONFIGURING MAILCHIMP AFTER LATEST UPDATES
client.setConfig({
  apiKey: api,
  server: server,
});

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//GETTING THE HOME PAGE

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

//GETTING THE INPUT FROM THE USER AND SENDING THE APPROPRIATE RESPONSE

app.post("/", function(req, res) {


  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;
  let data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://"+server+".api.mailchimp.com/3.0/lists/"+audienceID;
  const options = {
    method: "POST",
    auth: "pranjit:"+api
  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    // response.on("data", function(data) {
    //   console.log(JSON.parse(data));
    // })
  })

  request.write(jsonData);
  request.end();

});


// POST REQUEST FOR FAILURE ROUTE

app.post("/failure",function(req,res){
  res.redirect("/");
})

//SERVER RUNNING LOG

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
})
