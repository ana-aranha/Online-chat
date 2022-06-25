//ENTRAR NA SALA

let userNAme
let newUser
let activeUSers
let messagesPosteds
let userStatus
let newMessageDefined
let container = document.querySelector(".messages")

function getUserNAme(){
    userNAme = prompt("Escolha um nome de usuário")
    newUser = {name: userNAme}
    userNameValidation()
}

function userNameValidation(){
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", newUser)
    promise.then(userValidated)
    promise.catch(userInvalidated)
}

function userValidated(){
    setTimeout(conected,5000)
}

function userInvalidated(error){
    if(error.response.status === 400){
        console.log(`Usuário Inválido, com erro ${error.response.status}`)
        alert("Esse usuário já existe \n Tente um nome de usuário diferente!")
        getUserNAme()
    }
}


//MANTER CONEXÃO

function keepConection(){
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", newUser)
}

function conected(){
    setInterval(keepConection, 5000)
}

//BUSCAR MENSAGENS 

function getMessages(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then(messagesLoaded)
}

function messagesLoaded(resposta){
    messagesPosteds = resposta.data
    messagesbyType()
}

function messagesbyType(){
    container.innerHTML = ""
    for(i=60;i<messagesPosteds.length;i++){
        if(messagesPosteds[i].type === 'status'){
            let newMessage = `
                <div class="newUser">
                <p><span>(${messagesPosteds[i].time})</span>   <span>${messagesPosteds[i].from}</span> ${messagesPosteds[i].text}</p></div>
                `
            container.innerHTML += newMessage
        } else if(messagesPosteds[i].type === 'message'){
            let newMessage = `
                <div class="public">
                <p><span>(${messagesPosteds[i].time})</span>   <span>${messagesPosteds[i].from}</span> para <span>${messagesPosteds[i].to}</span> ${messagesPosteds[i].text}</p></div>
                `
            container.innerHTML += newMessage
        } else if(messagesPosteds[i].type === 'private_message' && (messagesPosteds[i].to === userNAme || messagesPosteds[i].from === user)){
            let newMessage = `
                <div class="private">
                <p><span>(${messagesPosteds[i].time})</span>   <span>${messagesPosteds[i].from}</span> para <span>${messagesPosteds[i].to}</span> ${messagesPosteds[i].text}</p></div>
                `
                container.innerHTML += newMessage
        }
    }
    let lastMessage = container.querySelectorAll("div") // Carregando menos mensagens, mudar pra 100 depois que incluir a lista toda
    lastMessage[lastMessage.length-1].scrollIntoView()
}

function updateMessages(){
    setInterval(getMessages, 3000)
}

//ENVIAR MENSAGENS

function sendWithEnter(){
    let newMessageSend = document.querySelector("input")
    newMessageSend.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.querySelector(".bottom div:nth-child(2)").click();
            }
      });
}


function newMessage(){
    let newMessageSend = document.querySelector("input").value
    newMessageDefined = {
        from: userNAme,
        to: "Todos",
        text: newMessageSend,
        type: "message"
    }
    sendNewMessage()
}

function sendNewMessage(){
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", newMessageDefined) 
    promise.then(getMessages)
    promise.catch(reloadPage)
    document.querySelector("input").value=""
}

function reloadPage(error){
    alert("Parece que você estava desconectado, vamos tentar novamente?")
    window.location.reload()
}
//Participantes Ativos

function showOptions(){
    let options = document.querySelector(".blur")
    options.classList.toggle("hidden")
    getActiveUsers()    
}

function getActiveUsers(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promise.then(usersLoaded)
}

function usersLoaded(resposta){
    activeUSers = resposta.data
    console.log(activeUSers)
    showUsers()
}

function showUsers(){
    let userDiv = document.querySelector(".users")
    userDiv.innerHTML = "<div><ion-icon name='people'></ion-icon> <p>Todos</p></div>"
    for(i=0;i<activeUSers.length;i++){
        userDiv.innerHTML += `
        <div><ion-icon name="person-circle"></ion-icon>  <span>${activeUSers[i].name}</span></div>`
    }
}

//Chamando funções
getUserNAme()
getMessages()
updateMessages()
sendWithEnter()
