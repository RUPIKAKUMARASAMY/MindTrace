console.log("MindTrace chatbot ready");

function toggleChat(){
let chat=document.getElementById("chatbox");

if(chat.style.display==="none" || chat.style.display===""){
chat.style.display="flex";
showGreeting();
}else{
chat.style.display="none";
}
}

function showGreeting(){

let messages=document.getElementById("messages");

if(messages.children.length===0){
addMessage("Hello! I'm MindTrace AI. How are you feeling today?","bot");
}

}

function addMessage(text,type){

let msg=document.createElement("div");

msg.style.padding="10px 14px";
msg.style.borderRadius="14px";
msg.style.maxWidth="75%";
msg.style.margin="6px 0";

if(type==="user"){
msg.style.background="#e3f2fd";
msg.style.alignSelf="flex-end";
}else{
msg.style.background="linear-gradient(135deg,#38bdf8,#6366f1,#22c55e)";
msg.style.color="white";
msg.style.alignSelf="flex-start";
}

msg.innerText=text;

document.getElementById("messages").appendChild(msg);

document.getElementById("messages").scrollTop=9999;

}

async function sendMessage(){

let input=document.getElementById("userInput");
let text=input.value.trim();

if(!text) return;

addMessage(text,"user");

input.value="";

let loading=document.createElement("div");

loading.style.background="linear-gradient(135deg,#38bdf8,#6366f1,#22c55e)";
loading.style.color="white";
loading.style.padding="10px 14px";
loading.style.borderRadius="14px";
loading.style.maxWidth="75%";
loading.style.margin="6px 0";

loading.innerText="Thinking...";

document.getElementById("messages").appendChild(loading);

let res=await fetch("/chatbot",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({message:text})
});

let data=await res.json();

loading.innerText=data.reply;

if(data.actions){

data.actions.forEach(action=>{

let btn=document.createElement("button");

btn.innerText=action.label;

btn.style.marginTop="6px";
btn.style.marginRight="6px";
btn.style.padding="6px 10px";
btn.style.border="none";
btn.style.borderRadius="8px";
btn.style.cursor="pointer";
btn.style.background="white";
btn.style.color="#2563eb";
btn.style.fontSize="12px";

btn.onclick=()=>window.location.href=action.url;

document.getElementById("messages").appendChild(btn);

});

}

document.getElementById("messages").scrollTop=9999;

}