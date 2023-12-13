let token = null
let content = document.querySelector('.content')
let messageId = null

function run(){
    if (token==null){
        return loginForm()
    }
    else{
        fetchMessages().then(data=>{generateConv(data)
            createFormMessage()
            deleteButton()

        })

    }
}

run()

function render(pageContent){
    content.innerHTML=""
    content.innerHTML = pageContent
}

function loginForm(){
    let templateLogin = `              
          <div class="mt-5">
            <label for="exampleInputEmail1" class="form-label">Pseudo</label>
            <input type="text" class="form-control" id="username">
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="password" class="form-control" id="password">
          </div>
          <button type="submit" class="btn btn-primary" id="btnLogin">Se connecter</button>                 
    `
    render(templateLogin)
    const loginBtn = document.querySelector('#btnLogin')
    loginBtn.addEventListener('click', ()=>{
        login()
        console.log('coucou')
    })
}
let userName = ""
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

    if (message.author.username==userName){
        deleteButton = `<button type="button" class="btn btn-primary delete" id="${message.id}">Supprimer</button>`
    }

    let messageTemplate =`
        
        <div class="d-flex justify-content-between align-items-center mb-2 message" id="message-${message.id}">
           
            <div class="fs-5 d-flex col-10">
                <div class="col-4">${message.author.username} : </div> 
                <div class="col-6">${message.content}</div>
                
            </div>
            <div class="d-flex">
               <div>${deleteButton}</div>
                
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

