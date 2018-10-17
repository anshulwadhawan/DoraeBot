var express=require('express');
var app=express();

var PORT=5000||process.env.port;
var apikey="7f92b9d732be4b94a353328f90b6df75";
const apiai = require('apiai')(apikey);
var socket=require('socket.io');
var serv=app.listen(PORT,function(response,err){
    if(err)throw err;
    console.log("Server is running on port number "+PORT);
});
var io=socket.listen(serv);

app.use(express.static(__dirname+'/views'));
app.use(express.static(__dirname+'/public'));
app.get('/',function(req,res){
    res.sendFile('index.html');
});


//socket code
io.on('connection', function(socket) {
    console.log("connection established");

    socket.on('chat_message', function(text){

        // Get a reply from API.AI

        var apiaiReq = apiai.textRequest(text, {
            sessionId: apikey
        });

        apiaiReq.on('response', function(response){
        var aiText = response.result.fulfillment.speech;
        console.log(aiText);
        socket.emit('bot_reply', aiText); // Send the result back to the browser!
         });

        apiaiReq.on('error', function(error){
        console.log(error);
        });

        apiaiReq.end();

    });
});
