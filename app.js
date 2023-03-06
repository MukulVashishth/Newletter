const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

// Setup of Mailchimp
mailchimp.setConfig({
    apiKey: "39c2329383fa58dfe9f550868130052-us13",
    server: "us13",
  });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html")
});

app.post('/', (req, res) => {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var emailAdd = req.body.email;

    const data = {
        members : [
            {
                email_address: emailAdd,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const run = async () => {
        const response = await mailchimp.lists.batchListMembers("61e46d99e7", data)
        .then(() => res.sendFile(`${__dirname}/success.html`))
        .catch(() => res.sendFile(`${__dirname}/failure.html`));
    };

    run();
    
    // console.log(firstName, lastName, email);/
})

app.post('/failure', function(req, res) {
    res.redirect('/');
})

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});

//API Key
// 839c2329383fa58dfe9f550868130052-us13

//List Id
//61e46d99e7 