var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var master = -1
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  if(master==-1)
  {
    master=1;
    socket.emit("master");
  }
  else{
    io.emit("getQueue")
  }
  
  socket.on("giveQueue", function(q, ql, id){
    console.log("initialise");
    console.log(q);
    console.log(ql);
    io.emit("initialise", {q, ql, id});
  });


  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('songChange', function(id){
      io.emit("songChanged", id);
  });

  socket.on('vote', function(id, vote){
      io.emit("vote", id, vote);
  });

  socket.on('stop', function(){
      io.emit("stop");
  });

  socket.on('play', function(){
      io.emit("play");
  });

  socket.on('next', function(){
      io.emit("next");
  });

  socket.on('deQueue', function(id){
      console.log(id);
      socket.broadcast.emit("deQueue", id);
  });

  socket.on('suggestById', function(){
      socket.broadcast.emit("getId");
  });

  socket.on("getId",function(id){
      socket.broadcast.emit("suggestById",id);
  });

  socket.on("updateQueue",function(q){});

});



http.listen(3000, '0.0.0.0',function(){
  console.log('listening on *:3000');
});
