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
  let formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${formattedTime} ${message.text}`);

  jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
//   from: 'Frank',
//   text: 'Hi'
// }, function (data) {
//   console.log('Got it', data);
// });
socket.on('newLocationMessage', function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let li = jQuery('<li></li>');
  let a = jQuery('<a target="_blank">My Current Location</a>');

  li.text(`${message.from}: ${formattedTime}`); //not adding these directly to template strings b
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});
jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  const messageTextBox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {
    messageTextBox.val('');
  });
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function(event) { //event listner
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your client')
  }
  locationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    // locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    alert('unable to fetch current position')
  })
  locationButton.removeAttr('disabled').text('Send location');
});
