// import  io  from "../node_modules/socket.io-client/dist/socket.io.js"
const socket = io("http://localhost:3000")
const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get("name");
socket.on('connect', () => {
    console.log('hello i am client')
    socket.emit('login', name);
    socket.emit("setname", name)
})
socket.on("connect_error", (err) => {
    console.error("Connection error:", err);

});

document.addEventListener('DOMContentLoaded', () => {

    let send = document.getElementById("send")
    let msg = document.getElementById("msg")
    if (send && msg) {

        send.addEventListener('click', () => {
            socket.emit("message", msg.value, name)
            msg.value = ""
        })

        if (urlParams.get("from") !== "page1") {
            console.log('hi')
            socket.emit("page2-reload", name);
        }
        else {
            history.replaceState(null, "", window.location.pathname);
        }
    }
    socket.on("redirect-to-page1", () => {
        console.log("Redirecting back to Page 1...");
        sessionStorage.removeItem("visitedPage2"); // Reset the flag
        window.location.href = "/src/login.html";
    });
    socket.on("response", (data, name, dir) => {

        console.log(data, name)
        let newmsg = document.createElement("div")
        newmsg.classList.add("w-1/2")
        if (dir === "left") {
            newmsg.classList.add("ml-2")
            let nameP = document.createElement("p")
            nameP.innerHTML = `--${name}`
            newmsg.appendChild(nameP)
            let msgP = document.createElement("p")
            msgP.innerHTML = data
            newmsg.appendChild(msgP)
        }
        else if (dir === "right") {
            newmsg.classList.add("mr-2")
            let nameP = document.createElement("p")
            nameP.innerHTML = `--${name}`
            newmsg.appendChild(nameP)
            let msgP = document.createElement("p")
            msgP.innerHTML = data
            newmsg.appendChild(msgP)
        }
        else {
            newmsg.classList.add("m-c")
            let msgP = document.createElement("p")
            msgP.innerHTML = `${name} ${data}`
            newmsg.appendChild(msgP)

        }
        newmsg.classList.add("py-5")
        newmsg.classList.add("px-2")
        newmsg.classList.add("bg-black")
        newmsg.classList.add("text-white")
        newmsg.classList.add("rounded-lg")
        newmsg.classList.add("text-xl")


        document.getElementById("messages").appendChild(newmsg)

    })
    let members = document.getElementById("members")
    let back = document.getElementById("back")
    members.addEventListener("click", () => {
        socket.emit("ask-members")
        document.getElementById("input-box").classList.add("hide");
        document.getElementById("messages").classList.add("hide")
        document.getElementById("member-display").classList.remove("hide")
        back.classList.remove("hide")
        members.disabled = true;
    })
    back.addEventListener("click", () => {
        document.getElementById("input-box").classList.remove("hide");
        document.getElementById("messages").classList.remove("hide");
        document.getElementById("member-display").classList.add("hide")
        let list = document.getElementById("member-display")
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
        back.classList.add("hide");
        members.disabled = false;
    })
    socket.on("recieve-members", (arr) => {
        console.log(arr)
        let list = document.getElementById("member-display")
        for (let i = 0; i < arr.length; i++) {
            let newmember = document.createElement("div")
            newmember.innerHTML = arr[i].name;
            // newmember.classList.add("w-full")
            newmember.classList.add("py-5")
            newmember.classList.add("bg-blue-300")
            newmember.classList.add("text-2xl")
            newmember.classList.add("font-bold")
            list.appendChild(newmember)
        }
        console.log(list.childNodes)
    })
})