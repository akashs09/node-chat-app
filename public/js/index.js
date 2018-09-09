let socket = io(); //requests connection to server
socket.on('connect', function(){
  console.log('connected to server');
  // socket.emit('createEmail', {
  //   to: 'jen@example.com',
  //   text: 'Hey. This is Andrew'
  // });
  // socket.emit('createMessage', {
  //   from: 'Mike',
  //   text: 'Heroku.'
  // });
});
socket.on('disconnect', function(){
  console.log('disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
//   from: 'Frank',
//   text: 'Hi'
// }, function (data) {
//   console.log('Got it', data);
// });
socket.on('newLocationMessage', function(message) {
  let li = jQuery('<li></li>');
  let a = jQuery('<a target="_blank">My Current Location</a>');

  li.text(`${message.from}: `); //not adding these directly to template strings b
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});
jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function(event) { //event listner
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your client')
  }
  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    alert('unable to fetch current position')
  })
});
