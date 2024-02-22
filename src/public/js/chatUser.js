Swal.fire({
    title: 'Welcome to the chat!',
    text: 'enter your username: ',
    input: 'text',
    allowOutsideClick: false,
    inputValidator: (value) => {
        return !value && 'You need an username!';
    },

}).then((result) => {
    user = result.value;
    socket.emit('newUser', user);
});