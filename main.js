let token = null
let content = document.querySelector('.content')
let messageId = null
let userName = ""

registerForm()
function run(){
    if (token==null){
        return loginForm()
    }
    else{
        fetchMessages().then(data=>{generateConv(data)
            createFormMessage()
            deleteButton()
            editButtons()
            replyButtons()
            reactionToMessageButtons()

        })

    }
}



function render(pageContent){
    content.innerHTML=""
    content.innerHTML = pageContent
}

function registerForm(){

    let templateRegister = `              
          <div class="mt-5">
            <div class="mb-3"><h3>S'inscrire</h3></div>
            <label for="exampleInputEmail1" class="form-label">Pseudo</label>
            <input type="text" class="form-control" id="usernameRegister">
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="text" class="form-control" id="passwordRegister">
          </div>
          <button type="submit" class="btn btn-primary mb-3" id="btnRegister">S'inscrire </button>  
          <br>
          <a type="submit" class="btn btn-link" id="linkLogin">Vous avez déjà un compte ? Se connecter</a>
    `


    render(templateRegister)
    const linkLogin = document.querySelector('#linkLogin')
    linkLogin.addEventListener('click', ()=>{
        loginForm()
    })

    const registerBtn = document.querySelector('#btnRegister')
    registerBtn.addEventListener('click', ()=>{
        register()
        console.log('coucou')
    })

}

function register(){
    const username= document.querySelector('#usernameRegister')
    const password= document.querySelector('#passwordRegister')

    let corpsRegister = {
        username : username.value,
        password : password.value
    }

    let params = {
        method : 'POST',
        headers : {"Content-type":"application/json"},
        body : JSON.stringify(corpsRegister)
    }

    fetch('https://b1messenger.imatrythis.com/register', params)
        .then(response=>response.json())
        .then(data=>{
            if(data == "username already taken"){
                console.log('déja pris')
                alert('username déjà pris, veuillez réessayer')
                return registerForm()
            }else{
                return loginForm()
            }
        })

}

function loginForm(){
    let templateLogin = `              
          <div class="mt-5">
          <div class="mb-3"><h3>Se connecter</h3></div>
            <label for="exampleInputEmail1" class="form-label">Pseudo</label>
            <input type="text" class="form-control" id="username">
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="password" class="form-control" id="password">
          </div>
          <button type="submit" class="btn btn-primary" id="btnLogin">Se connecter</button> 
          <br>
          <a type="submit" class="btn btn-link" id="linkRegister">Vous n'avez pas de compte ? S'inscrire</a>                
    `
    render(templateLogin)

    const linkRegister = document.querySelector('#linkRegister')
    linkRegister.addEventListener('click', ()=>{
        registerForm()
    })


    const loginBtn = document.querySelector('#btnLogin')
    loginBtn.addEventListener('click', ()=>{
        login()
        console.log('coucou')
    })
}

function login(){
    const username= document.querySelector('#username')
    const password= document.querySelector('#password')

    let corpsLogin = {
        username : username.value,
        password : password.value
    }

    let params = {
        method : 'POST',
        headers : {"Content-type":"application/json"},
        body : JSON.stringify(corpsLogin)
    }

    fetch('https://b1messenger.imatrythis.com/login', params)
        .then(response=>response.json())
        .then(data=>{
           if(data.message == "Invalid credentials."){
               return loginForm()
           }else{
               token=data.token
               userName = username.value
               console.log(userName)
               run()
           }
        })
}

function generateMessage(message){
    let deleteButton = ""
    let editButton=""
    let replyButton = ""
    let reactionButton=""


    if (message.author.username==userName){
        deleteButton = `<i class="bi bi-trash3 delete fs-4" style="cursor: pointer;" id="${message.id}" ></i>`
        editButton = `<i class="bi bi-pencil edit fs-4" style="cursor: pointer;" id="${message.id}"></i>`
    }else{
        replyButton = `<i class="bi bi-arrow-up-right reply fs-5" style="cursor: pointer;" data-message-id="${message.id}" data-message-content="${content}"></i>`
        reactionButton = `<i class="bi bi-emoji-smile reaction fs-5" style="cursor: pointer;" data-message-id="${message.id}"></i>`
    }

    let responsesContent = "";

    if (message.responses && message.responses.length > 0) {
        message.responses.forEach(response => {
            if (response.author && response.content) {
                responsesContent += `
                    <div class="d-flex ">
                        <div class="me-1 fs-6 col-5">${response.author.username}  : </div>
                        <div class="fs-6 col-7">${response.content}</div>
                    </div>`
            }
        })
    }


    let messageTemplate =`
        
        <div class="d-flex justify-content-between align-items-center mb-2 message" id="${message.id}">

                <div class="fs-5 d-flex col-10">
            
                        <div class="col-4">${message.author.username} : </div>
                        <div class="col-8 d-flex flex-column">
                            <div class="mb-2">${message.content}</div>
                            ${responsesContent}
                        </div>
            
                </div>
                <div class="d-flex">
                    <div class="mr-1">${deleteButton}</div>
                    <div>${editButton}</div>
                    <div class="me-1">${replyButton}</div>
                    <div>${reactionButton}</div>
                </div>


        </div>
    `


    return messageTemplate
}

function generateConv(messages){
    let contentConv = ""
    messages.forEach(message=>{
        contentConv += generateMessage(message)
    })
    render(contentConv)
    deleteButton()

}

async function fetchMessages(){

    const params = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "GET"
    }


    return await fetch('https://b1messenger.imatrythis.com/api/messages', params)
        .then(response=>response.json())
        .then(data=>{
            return data
        })

}

function createFormMessage(){
    let btnPost =""

    let formMessage = `
                            <div class="row">
                                <input type="text mb-2" class="form-control border border-success fs-5" id="messageContent">
                                <button type="button" class="btn btn-success fs-5" id="messageButton">Envoyer</button>
                            
                            </div>`
    content.innerHTML+=formMessage

    btnPost= document.querySelector('#messageButton')
    btnPost.addEventListener('click', ()=>{
        postMessage()

        messageId = null
    })
}



async function postMessage(){
    const message = document.querySelector('#messageContent')

    let corpsMessage = {
        content : message.value
    }

    const messageParams = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "POST",
        body :  JSON.stringify(corpsMessage)
    }

    return await fetch(`https://b1messenger.imatrythis.com/api/messages/new`, messageParams)
        .then(response => response.json())
        .then(data=>{
            console.log(data)
            run()
        })

}

async function deleteMessage(idMessage){

    const messageParams = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "DELETE"
    }

    return await fetch(`https://b1messenger.imatrythis.com/api/messages/delete/${idMessage}`, messageParams)
        .then(response => response.json())
        .then(data=>{
            console.log(data)
            run()
        })
}

function deleteButton() {
    const deleteButtons = document.querySelectorAll('.delete')
    deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
            console.log("coucou")
            const messageId = button.id
            deleteMessage(messageId)
        })
    })
}

async function editMessage(content, idMessage){
    const modifiedMessage = {
        content: content + " (edited)"
    }
    const messageParams = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "PUT",
        body : JSON.stringify(modifiedMessage)
    }

    return await fetch(`https://b1messenger.imatrythis.com/api/messages/${idMessage}/edit`, messageParams)
        .then(response => response.json())
        .then(data=>{
            console.log(data)
            run()
        })
}

function editButtons() {
    let editContent=""
    const editButtons = document.querySelectorAll('.edit')
    editButtons.forEach((button) => {
        button.addEventListener('click', () => {
            console.log("coucou")
            messageId = button.id
            editContent = window.prompt("Entrez Votre modification :")
            editMessage(editContent.toLowerCase(), messageId)
        })
    })
}


async function replyMessage(contentReply, idMessage){
    const replyMessage = {
        content: " "  + contentReply
    }
    const messageParams = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "POST",
        body : JSON.stringify(replyMessage)
    }

    return await fetch(`https://b1messenger.imatrythis.com/api/responses/${idMessage}/new`, messageParams)
        .then(response => response.json())
        .then(data=>{
            run();
        })

}


function replyButtons() {
    let replyContent = ""

    const replyButtons = document.querySelectorAll('.reply')

    replyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const messageId = button.dataset.messageId
            replyContent = window.prompt("Entrez Votre réponse au message :")
            replyMessage(replyContent.toLowerCase(), messageId)
        })
    })

}

async function reactionToMessage(reactionType, idMessage){

    const messageParams = {
        headers : {"Content-type":"application/json",
            "Authorization":`Bearer ${token}`},
        method : "GET",
    }

    return await fetch(`https://b1messenger.imatrythis.com/api/reaction/message/${idMessage}/${reactionType}`, messageParams)
        .then(response => response.json())
        .then(data=>{
            console.log(data)
            run();
        })

}

function reactionToMessageButtons() {

    const replyButtons = document.querySelectorAll('.reaction')

    replyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const messageId = button.dataset.messageId
            const { value: reaction } = Swal.fire({
                title: "Réagir",
                input: "select",
                inputOptions: {
                    lol : "lol",
                    sad : "sad",
                    blush : "blush"
                },
                inputPlaceholder: "Selectionner une réaction",
                showCancelButton: true,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        resolve()
                        console.log(value)
                        reactionToMessage(value, messageId)
                    });
                }
            });
        })
    })

}

