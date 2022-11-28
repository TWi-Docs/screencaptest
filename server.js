const puppeteer = require('puppeteer');
var express = require('express');
var app = express();
const fs = require('fs');
// import { Blob } from 'buffer';
// var Blob = require('blob');
const { Blob, Buffer } = require('node:buffer');
const http = require('http');
const cors = require('cors');
let scrShot;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Enable express to use static web pages, html, client-side javascript
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));
app.use(cors());

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/stack', function (req, res) {
//   res.render( __dirname + "/" + "index.html" );
   var tmp = req.body.stack0;
   var tmp1 = req.body.stack1;
   console.log(tmp)  // stackoverflow0
   console.log(tmp1)  // stackoverflow1
});

app.post('/process_get', (req, res) => {
   // Prepare output in JSON format; we're not sending anything back!
/*   var response = {
      // coords:req.query.coords,
      coords:req.query.coords,
   }; */
   // var testing = req.body.coords;

   console.log('I got a request!')
   console.log(req.body.coords);
   var data = req.body.coords;

   // We should always send a response back to the client
   // res.json({
   //    status: 'success'
   // });
   // res.send(JSON.stringify(response));

   data = data.replace(/\n$/, "")      // remove trailing "\n" if it exists
//   res.send(JSON.stringify(response));
   console.log("Data is:" + data);
   if(data != ""){
      let capParams = [];
      let lines = data.split("\n");
      lines.forEach(function(line) {
         // console.log(line);
         capParams = line.split(",");
         let capName = capParams[0];
         let capURL = capParams[1];
         let startX = capParams[2];
         let startY = capParams[3];
         let recWidth = capParams[4];
         let recHeight = capParams[5];
         console.log("capName: " + capName);
         console.log("capURL: " + capURL);
         console.log("capRect: " + startX + " " + startY + " " + recWidth + " " + recHeight);
         capName = capName + '.png';

         // console.log("Screen HEIGHT: " + window.screen.availHeight);
         // console.log("Screen WIDTH: " + window.screen.availWidth);
   
         (async () => {
            const browser = await puppeteer.launch({headless: false, ignoreDefaultArgs: ["--enable-automation","--disable-extensions"], args: ['--no-sandbox'] /*, args: ['--start-maximized']*/ });
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080});
            await page.goto(capURL);
            await new Promise(function(resolve) {setTimeout(resolve, 2000)});   // Wait for a couple of seconds

            scrShot = await page.screenshot({'path': capName, 'clip': {'x': parseInt(startX), 'y': parseInt(startY), 'width': parseInt(recWidth), 'height': parseInt(recHeight), 'type': 'png'/*, 'encoding':'base64'*/}});

            let img = __dirname + "/" + capName;
            // check that we can access the file
            fs.access(img, fs.constants.F_OK, err => {
               console.log(`${img} - ${err ? "does not exist" : "exists"}`);
            })

            fs.readFile(img, function(err, content) {
               if(err){
                  res.writeHead(404, {"Content-type": "text/html"});
                  res.end("<h1>No such image</h1>");
               }else{
                  res.writeHead(200, {"Content-type": "image/jpg"});
                  res.end(content);
               }
            }) 
            await browser.close();
         })(); 
     }); 
   }
  // console.log(lines[0]); 
})

// const host = process.env.host; 
const port = process.env.PORT || 8081 ;

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   // process.env.PORT || 8081
   // const port = process.env.PORT || 8081 ;
   console.log("ScreenCapApp listening at: %s:%s", host, port);
//   invoke_puptr(); 
})

/* function invoke_puptr(){
   const viewPort = { width: 1280, height: 800 }
   const options = {
   path: 'clipped_stocktickers.png',
   fullPage: false,
   clip: {
      x: 0,
      y: 240,
      width: 1000,
      height: 100
      }
   };

   const puppeteer = require('puppeteer');
   (async () => {
      const browser = await puppeteer.launch({headless: false})
      const page = await browser.newPage()
      await page.setViewport(viewPort)
      await page.goto('https://finance.yahoo.com/')
      await page.screenshot(options)
      await browser.close()
   })(); 

} */