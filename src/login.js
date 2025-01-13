document.addEventListener('DOMContentLoaded', () => {
    let but = document.getElementById("login")
    let inp = document.getElementById("name")
    let name;
    inp.addEventListener('input', () => {
        name = inp.value
    })
    but.addEventListener('click', () => {
        const encodedInput = encodeURIComponent(name);
        name = inp.value
        if (!sessionStorage.getItem("visitedPage2")) {
            sessionStorage.setItem("visitedPage2", "false");
        }
        window.location.href = `/src/index.html?from=page1&name=${encodedInput}`
    })
})