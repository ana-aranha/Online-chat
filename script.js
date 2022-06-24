//ENTRAR NA SALA

let userNAme
let newUser
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
    let promess = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", newUser)
    promess.then(userValidated)
    promess.catch(userInvalidated)
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
    let promess = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", newUser)
}

function conected(){
    setInterval(keepConection, 5000)
}

keepConection()

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
        } else if(messagesPosteds[i].type === 'private_message'){
            let newMessage = `
                <div class="private">
                <p><span>(${messagesPosteds[i].time})</span>   <span>${messagesPosteds[i].from}</span> para <span>${messagesPosteds[i].to}</span> ${messagesPosteds[i].text}</p></div>
                `
                container.innerHTML += newMessage
        }
    }
    let lastMessage = container.querySelector("div:nth-child(40)") // Carregando menos mensagens, mudar pra 100 depois que incluir a lista toda
    lastMessage.scrollIntoView()
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


//Chamando funções
getUserNAme()
getMessages()
updateMessages()
sendWithEnter()