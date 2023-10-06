

import { JSFunctions, Login  } from "./functions.js";

let items = document.querySelectorAll("aside img");
let overlay = document.querySelector(".overlay");
let loader = document.querySelector(".loader");
let functions = new JSFunctions();
let data = [];


let editPersonalDataWidget = document.querySelector(".edit-personal-data");
let editPersonalDataBtn = editPersonalDataWidget.querySelector(".btn");

let employeeHistoryWidget = document.querySelector(".employee-history");

let employeeIndex = 0;


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
    let res = await functions.getEmployees();
    data = res;
    addToPage();
    loader.style.display = "none";
    overlay.style.display = "none";
}


// async function search(){
    
//     if (day.value.trim().length == 0 || month.value.trim().length == 0 || year.value.trim().length == 0) {
//         alert("يجب إدخال التاريخ كاملا.");
//     }else {
//         overlay.style.display = "block";
//         let res = await functions.expenseSearch(`${day.value}-${month.value}-${year.value}`);
//         console.log(`${day.value}-${month.value}-${year.value}`)
//         overlay.style.display = "none";
//         if (res.state == false) {
//             alert("لم يتم العثور علي مصروفات بهذا التاريخ");
//         }else {
//             data = res;
//             addToTable();
//         }
//     }
// }


// // Add Return
// addExpenseWidgetBtn.addEventListener("click",addReturn);
// function addReturn(){
//     overlay.style.display = "block";
//     addExpenseWidget.style.display = "flex";
// }
// addExpenseBtn.addEventListener("click", async()=>{
//     let description = addExpenseWidget.querySelector("input[name='description']").value.trim();
//     let value = addExpenseWidget.querySelector("input[name='value']").value.trim();
//     let date = addExpenseWidget.querySelector("input[name='date']").value.trim();
//     date = date.split("-").reverse().join("-");

//     if (description.length == 0 || value.length == 0 || date == 0) {
//         alert("يحب إدخال البيانات كاملة.");
//     }else {
//         addExpenseWidget.style.display = "none";
//         let res = await functions.addExpense({"date": date,"description": description, "value": value});
//         if (res.state == "added") {
//             alert("تم الإضافة بنجاح");
//             overlay.style.display = "block";
//             let res = await functions.expenseSearch("");
//             data = res;
//             addToTable();
//             overlay.style.display = "none";

//         }else if (res.state == false) {
//             alert("خطأ");
//         }
//         overlay.style.display = "none";
//     }


// })


function addToPage() {
    let employees = document.querySelector(".employees");
    employees.innerHTML = "";

    for (var i=0;i<data.length;i++) {
        let rowData = JSON.parse(data[i]);
        let employee = document.createElement("div");
        const date = new Date();
        let day = date.getDate();

        employee.classList.add("employee");
        // Bg
        let bg = document.createElement("img");
        bg.src = "../assets/images/employee-bg.jpg";
        bg.classList.add("bg");
        employee.appendChild(bg);
        // Profile
        let profile = document.createElement("img");
        profile.src = "../assets/images/profile-img.png";
        profile.classList.add("profile-img");
        employee.appendChild(profile);
        // Data
        let ul = document.createElement("ul");
        let name = document.createElement("li");
        name.textContent = `الإسم:  ${rowData["name"]}`;
        ul.appendChild(name);
        
        let salary = document.createElement("li");
        salary.textContent = `الراتب:  ${rowData["salary"]}`;
        ul.appendChild(salary);
    
        let raisedDate = document.createElement("li");
        raisedDate.textContent = `موعد تسليم الراتب:  ${rowData["raised_date"]}`;
        ul.appendChild(raisedDate);
        // Actions
        let actions = document.createElement("div");
        actions.classList.add("actions");
    
        let editPersonalData = document.createElement("div");
        editPersonalData.textContent = "تعديل المعلومات";
        editPersonalData.classList.add("edit-personal-data");
        actions.appendChild(editPersonalData);
    
        let history = document.createElement("div");
        history.textContent = "التاريخ";
        history.classList.add("history");
        actions.appendChild(history);
    
        let giveSalaryBtn = document.createElement("div");
        giveSalaryBtn.textContent = "تسليم الراتب";
        if (day -  +rowData["raised_date"] < 0 ) {
            giveSalaryBtn.classList.add("gray-btn");
        }
        giveSalaryBtn.classList.add("give-salary-btn");
        actions.appendChild(giveSalaryBtn);
    
        employee.appendChild(ul)
        employee.appendChild(actions)
        employees.appendChild(employee)
    }
    let edits = document.querySelectorAll(".edit-personal-data");
    edits.forEach((ele,index)=>{
        ele.addEventListener("click",()=>{
            overlay.style.display = "block";
            editPersonalDataWidget.style.display = "flex";
            employeeIndex = index;
        });
    });
    let historys = document.querySelectorAll(".history");
    historys.forEach((ele,index)=>{
        ele.addEventListener("click",()=>{
            overlay.style.display = "block";
            employeeHistoryWidget.style.display = "flex";
            employeeIndex = index;

            let employeeData = JSON.parse(data[employeeIndex]);
            let historyData = JSON.parse(employeeData["history"]);

            let table = document.querySelector(".employee-history table tbody");
            table.innerHTML = "";
            console.log(historyData)
            for(let i=0;i<historyData.length;i++) {
                let tr = document.createElement("tr");

                let no = document.createElement("td");
                no.textContent = i+1;
                tr.appendChild(no);

                let date = document.createElement("td");
                date.textContent = historyData[i]["date"].split("-").slice(3).join(":") + "       |        " +  historyData[i]["date"].split("-").slice(0,3).join("-")
                tr.appendChild(date);
                table.appendChild(tr);
            }
        });
    });
    let giveSalaryBtns = document.querySelectorAll(".give-salary-btn");
    giveSalaryBtns.forEach((ele,index)=>{
        ele.addEventListener("click",async()=>{
            overlay.style.display = "block";
            employeeIndex = index;
            const date = new Date();
            // Get the last salary date
            let employeeData = JSON.parse(data[employeeIndex]);
            let historyData = JSON.parse(employeeData["history"]);
            if (1) {
                let raisedDate = +employeeData["raised_date"];
                let currentDay = date.getDate();
                // Give salary 
                if (currentDay - raisedDate >= 0) {
                    giveSalary();
                }else {
                    if (confirm("أنت علي وشك تسليم الراتب قبل ميعاده, هل أنت متأكد من تسليم الراتب ؟")) {
                       giveSalary();
                    }
                    overlay.style.display = "none";
                }
            }
            async function giveSalary(){
                const now = new Date();
            
                const day = now.getDate().toString().padStart(2, '0');
                const month = (now.getMonth() + 1).toString().padStart(2, '0'); 
                const year = now.getFullYear().toString();
                const hour = now.getHours().toString().padStart(2, '0');
                const minute = now.getMinutes().toString().padStart(2, '0');

                const formattedDate = `${day}-${month}-${year}-${hour}-${minute}`;
                let res = await functions.giveSalary({"name": employeeData["name"],"item": {"date": formattedDate,"salary": employeeData["salary"]}});
                console.log(res)
                if (res) {
                    alert("تم بنجاح");
                    location.reload();
                }
            }
        });
    });
}


editPersonalDataBtn.addEventListener("click",editEmployeeData);
async function editEmployeeData(){
    let name = JSON.parse(data[employeeIndex])["name"];
    console.log(name);
    let salary = editPersonalDataWidget.querySelector("input[name='salary']").value.trim();
    let raisedDate = editPersonalDataWidget.querySelector("input[name='raised-date']").value.trim();
    if (salary.length == 0 || raisedDate.length == 0) {
        alert("يجب إدخال البيانات  كاملة");
    }else  {
        console.log({"name": name,"salary": +salary, "raised_date": raisedDate})
        let res = await functions.editEmployeeData({"name": name,"salary": salary, "raised_date": raisedDate});
        if (res) {
            alert("تم التعديل بنجاح");
            location.reload();
        }
    }
}

overlay.addEventListener("click",()=>{
    overlay.style.display = "none";
    editPersonalDataWidget.style.display = "none";
    employeeHistoryWidget.style.display = "none"
})
