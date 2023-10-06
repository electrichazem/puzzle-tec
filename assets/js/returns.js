

import { JSFunctions, Login  } from "./functions.js";

let items = document.querySelectorAll("aside img");
let overlay = document.querySelector(".overlay");
let loader = document.querySelector(".loader");
let functions = new JSFunctions();
let data = [];

let addReturnWidgetBtn = document.getElementById("add-return-btn");


let addReturnWidget = document.querySelector(".add-return");
let addReturnBtn = addReturnWidget.querySelector(".btn");

let searchInputs = document.querySelector(".search-inputs");
let searchBtn = document.getElementById("search-btn");
let day = searchInputs.querySelector("input[name='day']");
let month = searchInputs.querySelector("input[name='month']");
let year = searchInputs.querySelector("input[name='year']");



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
    let res = await functions.returnsSearch("");
    data = res;
    addToTable();
    loader.style.display = "none";
    overlay.style.display = "none";
}

// Search By Date
searchBtn.addEventListener("click",search);
day.addEventListener("keypress",(e)=>{
    if (e.key == "Enter") {
        day.blur();
        month.focus();
    }
});
month.addEventListener("keypress",(e)=>{
    if (e.key == "Enter") {
        month.blur();
        year.focus();
    }
});
year.addEventListener("keypress",(e)=>{
    if (e.key == "Enter") {
        search();
    }
});
async function search(){
    
    if (day.value.trim().length == 0 || month.value.trim().length == 0 || year.value.trim().length == 0) {
        alert("يجب إدخال التاريخ كاملا.");
    }else {
        overlay.style.display = "block";
        let res = await functions.returnsSearch(`${day.value}-${month.value}-${year.value}`);
        overlay.style.display = "none";
        if (res.state == false) {
            alert("لم يتم العثور علي مرتجعات بهذا التاريخ");
        }else {
            data = res;
            addToTable();
        }
    }
}


// Add Return
addReturnWidgetBtn.addEventListener("click",addReturn);
function addReturn(){
    overlay.style.display = "block";
    addReturnWidget.style.display = "flex";
}
addReturnBtn.addEventListener("click", async()=>{
    let receiptCode = addReturnWidget.querySelector("input[name='invoice-code']").value.trim();
    let productSerial = addReturnWidget.querySelector("input[name='product-serial']").value.trim();
    let returnPrice = addReturnWidget.querySelector("input[name='return-price']").value.trim();
    let date = addReturnWidget.querySelector("input[name='date']").value.trim();
    date = date.split("-").reverse().join("-");

    if (receiptCode.length == 0 || productSerial.length == 0 || returnPrice == 0 || date == 0) {
        alert("يحب إدخال البيانات كاملة.");
    }else {
        addReturnWidget.style.display = "none";
        let res = await functions.addReturn({"invoice-code": receiptCode,"product-code": productSerial, "return-price": returnPrice, "date": date});
        if (res.state == "added") {
            alert("تم الإضافة بنجاح");
            overlay.style.display = "block";
            let res = await functions.returnsSearch("");
            data = res;
            addToTable();
            overlay.style.display = "none";

        }else if (res.state == "no_product_found") {
            alert("منتج غير موجود.");
        }else if (res.state == "no_receipt_found") {
            alert("فاتورة غير موجودة");
        }
        else if (res.state == "found") {
            alert("هذا المنتج موجود فالمرتجعات بالفعل");
        }
        overlay.style.display = "none";
    }


})


function addToTable() {
    let table = document.querySelector("table tbody");
    table.innerHTML = "";

    for (var i=0;i<data.length;i++) {
        let rowData = JSON.parse(data[i]);
        let tr = document.createElement("tr");
        // No.
        let n = document.createElement("td")
        n.innerHTML = i+1;
        tr.appendChild(n);
        // Date.
        let date = document.createElement("td")
        date.innerHTML = rowData["date"];
        tr.appendChild(date);
        // Name.
        let name = document.createElement("td")
        name.innerHTML = rowData["name"];
        tr.appendChild(name);
        // Serial.
        let serial = document.createElement("td");
        serial.innerHTML = rowData["serial"];
        tr.appendChild(serial);
        // Price.
        let price = document.createElement("td");
        price.innerHTML = rowData["price"];
        tr.appendChild(price);
      
        // ReturnPrice
        let returnPrice = document.createElement("td");
        returnPrice.innerHTML = rowData["returnprice"];
        tr.appendChild(returnPrice);

        // Loss
        let loss = document.createElement("td");
        loss.innerHTML = rowData["price"] - rowData["returnprice"];
        tr.appendChild(loss);
        table.appendChild(tr)
    }
}
overlay.addEventListener("click",()=>{
    overlay.style.display = "none";
    addReturnWidget.style.display = "none";
})
