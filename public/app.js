const socket = io('http://127.0.0.1:3000');

function updateScroll(){
	var element = document.getElementById("console");
	element.scrollTop = element.scrollHeight;
}

function loginfo(info){
	$('#console').append(`<p>${info}</p><br/>`)
	updateScroll()
}

socket.on('connect', () => {
  loginfo(socket.id + ' connected');
})

socket.on('disconnect', () => {
  loginfo(socket.id + ' disconnected');
})

$('.joinRoom').click(function(){
	socket.emit('joinRoom', { roomId: $(this).attr('data-id') })
})
socket.on('updateTime', (data) => {
	console.log(data)
	$('.time').text(data)
})
$('.sendMsg').click(function(){
	socket.emit('sendMsg', { id: socket.id, msg: $('.textMsg').val() })
})
socket.on('received-msg', (data) => {
	console.log(data)
	loginfo(data.id + ' says '+ data.msg);
})