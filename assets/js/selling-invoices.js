import { JSFunctions, Login , api } from "./functions.js";


let functions = new JSFunctions();

let items = document.querySelectorAll("aside img");
let overlay = document.querySelector(".overlay");
let loader = document.querySelector(".loader");

let nameSearching = document.querySelector(".name-searching");
let searchByNameBtn = document.getElementById("search-by-name");
let searchByNameInput = nameSearching.querySelector("input[name='name']");

let codeSearching = document.querySelector(".code-searching");
let searchByCodeBtn = document.getElementById("search-by-code");
let searchByCodeInput = codeSearching.querySelector("input[name='code']");

let dateSearching = document.querySelector(".date-searching");
let searchByDateBtn = document.getElementById("search-by-date");
let day = dateSearching.querySelector("input[name='day']");
let month = dateSearching.querySelector("input[name='month']");
let year = dateSearching.querySelector("input[name='year']");





// Varaible
let data = [];
let filterType = 0;

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

    let res = await functions.invoiceSearchByDate("");
    if (res.state == false) {}else {
        data = res;
        addToTable();
    }

    loader.style.display = "none";
    overlay.style.display = "none";
   
}


// Filter 
let filter = document.querySelector(".filter");
let filterElements = filter.querySelectorAll("div");
filterElements.forEach((ele,index)=>{
    ele.addEventListener("click",()=>{
        filterElements.forEach((ele)=>{
            ele.classList.remove("active");
        });
        ele.classList.add("active");
        filterType = index;
        addToTable();
    })
})

// Search By Name
searchByNameBtn.addEventListener("click",()=>{
    seachByName();
});
searchByNameInput.addEventListener("keypress",(e)=>{
    if (e.key == "Enter") {
        seachByName();
    }
});
async function seachByName(){
    let name = searchByNameInput.value;
    if (name.trim().length == 0) {
        alert("يجب إدخال الإسم أولا");
    }else {
        overlay.style.display = "block";
        let res = await functions.invoiceSearchByName(name);
        overlay.style.display = "none";
        if (res.state == false) {
            alert("لم يتم العثور علي فواتير بهاذا الإسم");
        }else {
            data = res;
            addToTable();
        }
    }
}

// Search By Code
searchByCodeBtn.addEventListener("click",()=>{
    seachByCode();
});
searchByCodeInput.addEventListener("keypress",(e)=>{
    if (e.key == "Enter") {
        seachByCode();
    }
});
async function seachByCode(){
    let code = searchByCodeInput.value;
    if (code.trim().length == 0) {
        alert("يجب إدخال الكود أولا");
    }else {
        overlay.style.display = "block";
        let res = await functions.invoiceSearchByCode(code);
        overlay.style.display = "none";
        if (res.state == false) {
            alert("لم يتم العثور علي فواتير بهاذا الكود");
        }else {
            data = res;
            addToTable();
        }
    }
}

// Search By Date
searchByDateBtn.addEventListener("click",()=>{
    seachByDate();
});
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
        seachByDate();
    }
});
async function seachByDate(){
    
    if (day.value.trim().length == 0 || month.value.trim().length == 0 || year.value.trim().length == 0) {
        alert("يجب إدخال التاريخ كاملا.");
    }else {
        overlay.style.display = "block";
        let res = await functions.invoiceSearchByDate(`${day.value}-${month.value}-${year.value}`);
        overlay.style.display = "none";
        if (res.state == false) {
            alert("لم يتم العثور علي فواتير بهاذا التاريخ");
        }else {
            data = res;
            addToTable();
        }
    }
}

function addToTable() {
    let table = document.querySelector("table tbody");
    table.innerHTML = "";
    let no =1;
    // 2 => تاجر
    // 1 => مستهلك

    for (var i=0;i<data.length;i++) {
        let rowData = JSON.parse(data[i]);
        // Filter
        if (filterType==0 || rowData["iscustomer"]+1 != filterType) {
            
            let tr = document.createElement("tr");
            // No.
            let n = document.createElement("td")
            n.innerHTML = no;
            tr.appendChild(n);
            // Name.
            let name = document.createElement("td")
            name.innerHTML = rowData["name"];
            tr.appendChild(name);
            // Type.
            let type = document.createElement("td");
            if (rowData["iscustomer"]) {
                type.innerHTML = "مستهلك";
            }else {
                type.innerHTML = "تاجر";
            }
            tr.appendChild(type);
            // Code.
            let code = document.createElement("td");
            code.innerHTML = rowData["code"];
            tr.appendChild(code);
            // Print.
            let print = document.createElement("td");
            print.innerHTML = "عرض";
            print.classList.add("print");
            tr.appendChild(print);
            // Return
            // let returnEle = document.createElement("td");
            // returnEle.innerHTML = "مسترجع";
            // returnEle.classList.add("return");
            // tr.appendChild(returnEle);
            table.appendChild(tr)
            no++;
        }
        
    }
    let prints = document.querySelectorAll(".print");
    prints.forEach((ele,index)=>{
        ele.addEventListener("click",()=>{
            let tr = table.querySelector(`tr:nth-child(${index+1})`);
            let code = tr.querySelector("td:nth-child(4)").innerHTML;
            
            for(let invoice of data) {
                if (JSON.parse(invoice)["code"]  == code) {
                    localStorage.setItem("invoice-data",invoice);
                    location.href = "/sell/invoice";
                }
            }
        })
       
    })
}