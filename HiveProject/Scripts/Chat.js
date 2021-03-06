﻿const chat = $.connection.chatHub;

chat.client.receiveMessage = (model) => {
    console.log(model);
    displayMessageInBox(model);
};

chat.client.setUserOnline = userName => setUserStatus(userName, true);
chat.client.setUserOffline = userName => setUserStatus(userName, false);

function setUserStatus(userName, status) {
    let statusState = status ? "online" : "offline";

    let iconId = "statusOf-" + userName;
    let openIconId = "openStatusOf-" + userName;
    let verbalStatusId = "verbalStatusOf-" + userName;

    let userStatusIcon = document.getElementById(iconId);
    let openUserStatusIcon = document.getElementById(openIconId);
    let verbalStatus = document.getElementById(verbalStatusId);

    if (userStatusIcon)
        userStatusIcon.className = "status_icon " + statusState;
    if (openUserStatusIcon)
        openUserStatusIcon.className = "status_icon " + statusState;
    if (verbalStatus)
        verbalStatus.innerHTML = userName + " is " + statusState;
}

function displayMessageInBox(message, isSent = false) {
    let theMessage = message.Body ? message.Body : message;
    let msgText = theMessage.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let divaki = document.createElement("div");

    divaki.className = "d-flex mb-4 justify-content-" + (!isSent ? "start" : "end");

    let divoMinima = document.createElement("div");
    divoMinima.className = "msg_cotainer" + (!isSent ? "" : "_send");
    divoMinima.textContent = msgText;

    let dt = message.DateSent ? new Date(message.DateSent) : new Date();
    let time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

    let spanoTime = document.createElement("span");
    spanoTime.className = "msg_time" + (!isSent ? "" : "_send");
    spanoTime.innerHTML = time;
    divoMinima.appendChild(spanoTime);
    divoMinima.appendChild(spanoTime);
    divaki.appendChild(divoMinima);
    messageBox.appendChild(divaki);
}

$.connection.hub.start().done(() =>
    console.log("client is here ConnectionId =", $.connection.chatHub));

document.addEventListener('keydown', (e) => {
    if (e.which === 13) {
        SendMessage();
        e.preventDefault();
        return false;
    }
});

async function SendMessage() {
    var audio = new Audio('/Content/sounds/notification.mp3');
    audio.play();

    displayMessageInBox(document.getElementById("messageInput").value, true);

    console.log(
        document.getElementById("senderName").innerHTML, document.getElementById("receiverName").innerHTML);
    chat.invoke("SendMessage", {
        senderId: document.getElementById("senderId").innerHTML,
        senderName: document.getElementById("senderName").innerHTML,
        receiverId: document.getElementById("receiverId").innerHTML,
        receiverName: document.getElementById("receiverName").innerHTML,
        // Get HTML tag with id = messageInput and read it's value - User's Message
        body: document.getElementById("messageInput").value,
        hasBeenRead: false
    });

    document.getElementById("messageInput").value = "";
}


chat.client.getProfileInfo = function (displayName, avatar) {
    model.myName(displayName);
    model.myAvatar(avatar);
};