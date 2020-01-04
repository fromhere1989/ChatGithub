const token = ((document.cookie).split('='))[1];
const socket = io.connect('http://localhost:8080', {
  query: {token: token}
});

//отсылает обратно пользователю username
socket.on('userName', userName => {
  console.log('Your username is ' + userName);
  let userConnect = document.createElement('p');
  userConnect.className = 'newUser';
  userConnect.innerHTML = userName + ' connected \n';

  document.querySelector('.chat__window').append(userConnect);
});

//отсылает всем в чате - user connected
socket.on('newUser', userName => {
  let newConnection = document.createElement('p');
  newConnection.className = 'newUser';
  newConnection.innerHTML = userName + ' connected \n';

  document.querySelector('.chat__window').append(newConnection);
});

  document.querySelector('.button').onclick = () => {
  let message = document.querySelector('.input').value;
  socket.emit('message', message);
  document.querySelector('.input').value = null;
};

  let input = document.querySelector('.input');
  input.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
      document.querySelector('.button').click()
    }
  });

  document.querySelector('.logout__button').onclick = () => {
  socket.emit('logout');
};

socket.on('messageToClients', (msg, name) => {
  let newMessage = document.createElement('p');
  newMessage.className = 'newMes';
  newMessage.innerHTML = name + ' : ' + msg + '\n';

  document.querySelector('.chat__window').append(newMessage);
});
