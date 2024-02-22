const socket = io()

const form = document.querySelector('form')

let chatBox = document.getElementById('chatBox');
let user;

chatBox.addEventListener('keyup', (e) => {
    console.log(e.key);
    if (e.key === 'Enter' && chatBox.value.trim() !== '') {
        socket.emit('chat message', {user: user, message: chatBox.value});
        chatBox.value = '';
    }
});

socket.on('history', (data) => {
    let history = document.getElementById('messages');
    let messages = ""
    data.forEach(message => {
        messages += `<p> <span class="user"> ${message.userId} </span> - <span class="date"> ${message.date} </span> - <span class="message"> ${message.message} </span>  </p>`
    })
    history.innerHTML = messages;
    document.getElementById('final').scrollIntoView(true)
});

socket.on('alert', data => {
    Swal.fire ({
        title: "New user connected",
        text: data,
        icon: "success",
        timer: 3000,
        toast: true,
        position: "top-end",
    });
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(form)
    const body = {}
    for (const [key, value] of data) {
        body[key] = value
    }

    socket.emit('new-product', body)
    form.reset()
})

socket.on('products', (currentProducts) => {
    window.location.reload()
})

deleteBtn.addEventListener('click', handleDelete)