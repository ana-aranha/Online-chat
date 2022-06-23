//ENTRAR NA SALA

let userNAme
let newUser
let messagesPosteds
let container = document.querySelector(".messages")

function getUserNAme(){
    userNAme = prompt("Escolha um nome de usuário")
    newUser = {name: userNAme}
    userNameValidation()
}

function userNameValidation(){
    console.log(newUser) 
    let promess = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", newUser)
    promess.then(userValidated)
    promess.catch(userInvalidated)
}

function userValidated(resposta){
    console.log(resposta)
    console.log(resposta.status)
    console.log("Usuário válido!")
}

function userInvalidated(error){
    console.log(error.data)
    console.log(error.response.status)
    console.log(`Usuário Inválido, com erro ${error.response.status}`)
    alert("Esse usuário já existe \n Tente um nome de usuário diferente!")
    getUserNAme()
}


//MANTER CONEXÃO

/*function keepConection(){
    let promess = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", newUser)
    promess.then(conected)
}

function conected(){
    console.log("Tô aquii")
    setTimeout(keepConection, 5000)
}

keepConection()*/

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
    for(i=0;i<messagesPosteds.length;i++){
        if(messagesPosteds[i].type === 'status'){
            let newMessage = `
                <div class="newUser">
                <div>(${messagesPosteds[i].time})</div>
                <div><p> <span>${messagesPosteds[i].from}</span> ${messagesPosteds[i].text}</p></div>
                </div>`
            container.innerHTML += newMessage
        } else if(messagesPosteds[i].type === 'message'){
            let newMessage = `
                <div class="messages">
                <div>(${messagesPosteds[i].time})</div>
                <div><p> <span>${messagesPosteds[i].from}</span> para <span>${messagesPosteds[i].to}</span> ${messagesPosteds[i].text}</p></div>
                </div>`
            container.innerHTML += newMessage
        } else if(messagesPosteds[i].type === 'private_message'){
            let newMessage = `
                <div class="private">
                <div>(${messagesPosteds[i].time})</div>
                <div><p> <span>${messagesPosteds[i].from}</span> para <span>${messagesPosteds[i].to}</span> ${messagesPosteds[i].text}</p></div>
                </div>`
                container.innerHTML += newMessage
        }
    }
}

function updateMessages(){
    setInterval(getMessages, 3000)
}

//ENVIAR MENSAGENS

function newMessage(){
    let message = document.querySelector("input").value
    let newMessage = `<div class="public">
    <div>(${time})</div>
    <div><p><span>Maria</span>${message}</p></div>
    </div>`
    container.innerHTML += newMessage
}

function getTime(){
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}


//Chamando funções
getUserNAme()
updateMessages()
