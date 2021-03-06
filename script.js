//ENTRAR NA SALA

let userNAme
let newUser
let activeUSers
let messagesPosteds
let userStatus
let newMessageDefined
let visibilityType = "Público"
let toUser = "Todos"
let container = document.querySelector(".messages")
let enterChat = document.querySelector(".enterPage")
let bottomPage = document.querySelector(".bottom")

function getUserName(){
    userNAme = enterChat.querySelector("input").value
    newUser = {name: userNAme}
    userNameValidation()
}

function userNameValidation(){
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", newUser)
    promise.then(userValidated)
    promise.catch(userInvalidated)
    enterChat.innerHTML ="<img src='img/logo.png'><img src='img/Spinner-1s-200px.gif'><div><p>Entrando...</p></div>"}

function userValidated(){
    setTimeout(conected,5000)
    enterChat.classList.add("hidden")
    getMessages()
}

function userInvalidated(error){
    if(error.response.status === 400){
        console.log(`Usuário Inválido, com erro ${error.response.status}`)
        alert("Esse usuário já existe \n Tente um nome de usuário diferente!")
        window.location.reload()
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
    for(i=0;i<messagesPosteds.length;i++){
        if(messagesPosteds[i].type === 'status'){
            let newMessage = `
                <div class="newUser">
                <p><span>(${messagesPosteds[i].time})</span>   <span>${messagesPosteds[i].from}</span> ${messagesPosteds[i].text}</p></div>
                `
            container.innerHTML += newMessage
        } else if(messagesPosteds[i].type === 'message'){
            let newMessage = `
                <div class="public">
                <p><span>(${messagesPosteds[i].time})</span>   <span>${messagesPosteds[i].from}</span> para <span>${messagesPosteds[i].to}</span>: ${messagesPosteds[i].text}</p></div>
                `
            container.innerHTML += newMessage
        } else if(messagesPosteds[i].type === 'private_message' && (messagesPosteds[i].to === userNAme || messagesPosteds[i].from === userNAme)){
            let newMessage = `
                <div class="private">
                <p><span>(${messagesPosteds[i].time})</span>   <span>${messagesPosteds[i].from}</span> para <span>${messagesPosteds[i].to}</span>: ${messagesPosteds[i].text}</p></div>
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
    let newMessageSend = bottomPage.querySelector("input")
    let userInput = enterChat.querySelector("input")
    newMessageSend.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.querySelector(".bottom div:nth-child(2)").click();
            }
      })
      userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.querySelector(".enterPage button").click();
            }
      })
      ;
}

function showOptionsSelected(){
    let destiny = document.querySelector(".bottom > div:last-child")
    destiny.innerHTML = `Enviando para ${toUser} (${visibilityType})`
}

function newMessage(){
    let newMessageSend = bottomPage.querySelector("input").value
    if(newMessageSend == ''){
        return
    }else{
    if(visibilityType == 'Público'){
        newType = 'message'
    }
    else if(visibilityType = 'Reservadamente'){
        newType = 'private_message'
    }
    newMessageDefined = {
        from: userNAme,
        to: toUser,
        text: newMessageSend,
        type: newType
    }
    sendNewMessage()}
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
    let pageBody = document.querySelector("body")
    options.classList.toggle("hidden")
    pageBody.classList.toggle("noScroll") 
}

function getActiveUsers(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promise.then(usersLoaded)
}

function usersLoaded(resposta){
    activeUSers = resposta.data
    showUsers()
}

function showUsers(){
    let userDiv = document.querySelector(".users")
    userDiv.innerHTML = "<div class='marked' onclick='selectOptionUser(this)'><ion-icon name='people'></ion-icon> <span>Todos</span><ion-icon class='check hidden' name='checkmark'></ion-icon></div>"
    for(i=0;i<activeUSers.length;i++){
        userDiv.innerHTML += `
        <div onclick='selectOptionUser(this)'><ion-icon name="person-circle"></ion-icon>  <span>${activeUSers[i].name}</span><ion-icon class='check hidden' name='checkmark'></ion-icon></div>`
    }
}

// Selecionando usuário

function selectOption(element){
    let visibilityDiv = document.querySelector(".visibility")
    let optionSelected = visibilityDiv.querySelector(".marked")
    if(optionSelected != element){
        optionSelected.classList.remove("marked")
        element.classList.add("marked")
    }
    visibilityType = element.querySelector("p").innerHTML
    showOptionsSelected()
}

function selectOptionUser(element){
    let usersDiv = document.querySelector(".users")
    let optionSelected = usersDiv.querySelector(".marked")
    if(optionSelected != element){
        optionSelected.classList.remove("marked")
        element.classList.add("marked")
    }
    toUser = element.querySelector("span").innerHTML
    showOptionsSelected()
}

//Chamando funções
updateMessages()
setInterval(getActiveUsers, 10000)
sendWithEnter()
showOptionsSelected()
