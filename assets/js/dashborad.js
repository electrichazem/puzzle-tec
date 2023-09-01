import { Login } from "./functions.js";

let items = document.querySelectorAll(".item");
window.onload = async()=>{
    let permissions = await Login();
    document.querySelector("header span").addEventListener("click",()=>{
        location.href = "/";
    });
    items.forEach((element) => {
        var attr = element.getAttribute("val");
        if(permissions[attr] == true) {
            element.style.display = "flex";
            element.addEventListener("click",()=>{
                location.href = `/${attr}`;
            });
        }
    });
}
