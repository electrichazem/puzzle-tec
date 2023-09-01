import { Login , api } from "./functions.js";

let loader = document.querySelector(".loader");

async function getSellers() {
    let name = localStorage.getItem("name");
    let password = localStorage.getItem("password");
    let sellers = document.querySelector(".sellers");
    sellers.innerHTML = "";
    for (let i = 0; i < 100; i++) {
        let response = await fetch(`${api}get_sellers.php?name=${name}&password=${password}&with_invoices=false`);
        let responseData = JSON.parse(await response.text());
        if (responseData.state === "Empty") {
            alert(`لا يوجد أي تجار/موكلين`);
            break;
        } else if (responseData.state === false) {
            alert("خطأ في الإضافة");
            break;
        } else {
            sellers.innerHTML = "";
            for(i=0;i<responseData.length;i++) {
                let seller = document.createElement("div");
                let name = document.createElement("span");
                let nameText = document.createTextNode("الإسم:  "+responseData[i].name);
                name.appendChild(nameText);
                let type = document.createElement("span");
                let typeText = document.createTextNode( "النوع:  "+responseData[i].type);
                type.appendChild(typeText);
                let date = document.createElement("span");
                let dateText = document.createTextNode("تاريخ الإضافة:  " +responseData[i].created_date);
                date.appendChild(dateText);
                seller.appendChild(name);
                seller.appendChild(type);
                seller.appendChild(date);
                seller.classList.add("seller");
                seller.setAttribute("seller",responseData[i].name);
                sellers.appendChild(seller);
                seller.addEventListener("click",()=>{
                    localStorage.setItem("seller",seller.getAttribute("seller"));
                    location.href = "/buy/invoices/";
                });
            }
            break;
        }
    }
}


let overlay = document.querySelector(".overlay");
overlay.addEventListener("click",()=>{
    overlay.style.display = "none";
    document.querySelector(".add-seller").style.display = "none";
    document.querySelector(".del-seller").style.display = "none";
})


let items = document.querySelectorAll("aside img");
window.onload = async()=>{
    overlay.style.display = "block";
    loader.style.display = "block";
    let permissions = await Login();
    document.querySelector("header span").addEventListener("click",()=>{
        location.href = "/";
    });
    items.forEach((element) => {
        var attr = element.getAttribute("val");
        if(permissions[attr] == true) {
            element.style.display = "block";
            element.addEventListener("click",()=>{
                location.href = `/${attr}`;
            });
        }
    });
    await getSellers();
    loader.style.display = "none";
    overlay.style.display = "none";
}

let showAdd = document.querySelector(".actions .add");
showAdd.addEventListener("click",async()=>{
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".add-seller").style.display = "flex";
});


function hide(){
    overlay.style.display = "none";
    document.querySelector(".add-seller").style.display = "none";
    document.querySelector(".del-seller").style.display = "none";
}


let add = document.querySelector(".add-seller .btn");
add.addEventListener("click",async()=>{
    let name = localStorage.getItem("name");
    let password = localStorage.getItem("password");
    let seller = document.querySelector(`.add-seller input[name='name']`).value.trim();
    let type = document.querySelector(`.add-seller select[name='type']`).value;
    let date = document.querySelector(`.add-seller input[name='date']`).value;
    console.log(`${api}add_seller.php?name=${name}&password=${password}&seller=${seller}&type${type}&create_date=${date}`)

    if (seller.length < 1 || date.length < 1) {
        alert(`يجب إدخال البيانات كاملة`);
    }else {
        for (let i = 0; i < 100; i++) {
            let response = await fetch(`${api}add_seller.php?name=${name}&password=${password}&seller=${seller}&type=${type}&create_date=${date}`);
            let responseData = JSON.parse(await response.text());
            if (responseData.state === "exist") {
                alert(`${type} موجود بالفعل`);
                break;
            } else if (responseData.state === true) {
                alert("تم الإضافة بنجاح");
                getSellers();
                break;
            }
        }
    }

});


let showDel = document.querySelector(".actions .del");
showDel.addEventListener("click",async()=>{
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".del-seller").style.display = "flex";
});


let del = document.querySelector(".del-seller .btn");
del.addEventListener("click",async()=>{
    let name = localStorage.getItem("name");
    let password = localStorage.getItem("password");
    let seller = document.querySelector(`.del-seller input[name='name']`).value.trim();
    console.log(`${api}del_seller.php?name=${name}&password=${password}&seller=${seller}`)

    if (seller.length < 1) {
        alert(`يجب إدخال البيانات كاملة`);
    }else {
        for (let i = 0; i < 100; i++) {
            let response = await fetch(`${api}del_seller.php?name=${name}&password=${password}&seller=${seller}`);
            let responseData = JSON.parse(await response.text());
            if (responseData.state === "not_found") {
                alert(`غير موجود`);
                break;
            } else if (responseData.state === "deleted") {
                alert("تم الحذف بنجاح");
                await getSellers();
                break;
            }
            else if (responseData.state === "false") {
                alert("خطأ");
                break;
            }
        }
    }

});



