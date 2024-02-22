const id = document.querySelector('#idDelete')
const deleteBtn = document.querySelector('#btnDelete')

const handleDelete = () => {
    console.log('delete')
    // const currentId = parseInt(id.value)
    const currentId = id.value

    console.log(currentId)
    socket.emit('delete-product', currentId)
    id.value = ''
    window.location.reload()
}

deleteBtn.addEventListener('click', handleDelete)