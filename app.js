require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();


app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) =>{
    const query = req.body.cityName;
    const apiKey = process.env.SECRET_KEY;
    const unit = "imperial";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${unit}&appid=${apiKey}`;    
    https.get(url, (response) =>{
        console.log(response.statusCode);
        
        response.on("data", (data) =>{
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = " http://openweathermap.org/img/wn/"+ icon +"@2x.png";
            res.write(`<p>The weather is currently ${weatherDescription}</p>`);
            res.write(`<h1>The temperture in ${query} is ${temp} degrees fahrenheit.</h1>`);
            res.write(`<img src=${imageURL}>`);
            res.send()
        })
    }) 
});


app.listen(3000, () =>{
    console.log("Server is running on port 3000");
});