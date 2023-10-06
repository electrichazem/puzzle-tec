

import { JSFunctions, Login  } from "./functions.js";

let items = document.querySelectorAll("aside img");
let overlay = document.querySelector(".overlay");
let loader = document.querySelector(".loader");
let functions = new JSFunctions();
let data = [];

let addExpenseWidgetBtn = document.getElementById("add-expense-btn");
let addExpenseWidget = document.querySelector(".add-expense");
let addExpenseBtn = addExpenseWidget.querySelector(".btn");

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
    let res = await functions.expenseSearch("");
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
        let res = await functions.expenseSearch(`${day.value}-${month.value}-${year.value}`);
        overlay.style.display = "none";
        if (res.state == false) {
            alert("لم يتم العثور علي مصروفات بهذا التاريخ");
        }else {
            data = res;
            addToTable();
        }
    }
}


// Add Return
addExpenseWidgetBtn.addEventListener("click",addReturn);
function addReturn(){
    overlay.style.display = "block";
    addExpenseWidget.style.display = "flex";
}
addExpenseBtn.addEventListener("click", async()=>{
    let description = addExpenseWidget.querySelector("input[name='description']").value.trim();
    let value = addExpenseWidget.querySelector("input[name='value']").value.trim();
    let date = addExpenseWidget.querySelector("input[name='date']").value.trim();
    date = date.split("-").reverse().join("-");

    if (description.length == 0 || value.length == 0 || date == 0) {
        alert("يحب إدخال البيانات كاملة.");
    }else {
        addExpenseWidget.style.display = "none";
        let res = await functions.addExpense({"date": date,"description": description, "value": value});
        if (res.state == "added") {
            alert("تم الإضافة بنجاح");
            overlay.style.display = "block";
            let res = await functions.expenseSearch("");
            data = res;
            addToTable();
            overlay.style.display = "none";

        }else if (res.state == false) {
            alert("خطأ");
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
        // Descrption.
        let name = document.createElement("td")
        name.innerHTML = rowData["description"];
        tr.appendChild(name);
        // Value.
        let serial = document.createElement("td");
        serial.innerHTML = rowData["value"];
        tr.appendChild(serial);
        table.appendChild(tr)
    }
}
overlay.addEventListener("click",()=>{
    overlay.style.display = "none";
    addExpenseWidget.style.display = "none";
})
