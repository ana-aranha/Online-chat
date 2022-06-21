let today = new Date();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let container = document.querySelector(".messages")

function newMessage(){
    let message = document.querySelector("input").value
    let newMessage = `<div class="public">
    <div>(${time})</div>
    <div><p><span>Maria</span>${message}</p></div>
    </div>`
    container.innerHTML += newMessage
}


