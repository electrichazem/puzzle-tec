

import { JSFunctions, Login  } from "./functions.js";

let items = document.querySelectorAll("aside img");
let overlay = document.querySelector(".overlay");
let loader = document.querySelector(".loader");
let functions = new JSFunctions();
let data = [];

let monthlyReportBtn = document.getElementById("monthly-report-btn");
let yearlyReportBtn = document.getElementById("yearly-report-btn");
let customReportBtn = document.getElementById("custom-report-btn");





monthlyReportBtn.addEventListener("click",async()=>{
    let month = prompt("الشهر: (1-12)");
    while(month.trim().length == 0) {
        month = prompt("برجاء إدخال الشهر بطريقة صحيحة");
    }
    let year = prompt("السنة: ");
    while(year.trim().length == 0) {
        year = prompt("برجاء إدخال السنة بطريقة صحيحة");
    }
    overlay.style.display = "block";
    let res = await functions.createMonthlyReport({"month": month, "year": year});
    if (res.state == "not_found") {
        alert("لم يتم العثور علي بيانات بهذا التاريخ");
        overlay.style.display = "none";
    }else {
        data = res;
        addData();
        overlay.style.display = "none";
    }
})

yearlyReportBtn.addEventListener("click",async()=>{
    let year = prompt("السنة: ");
    while(year.trim().length == 0) {
        year = prompt("برجاء إدخال السنة بطريقة صحيحة");
    }
    overlay.style.display = "block";
    let res = await functions.createYearlyReport({"year": year});
    if (res.state == "not_found") {
        alert("لم يتم العثور علي بيانات بهذا التاريخ");
        overlay.style.display = "none";
    }else {
        data = res;
        addData();
        overlay.style.display = "none";
    }

});


customReportBtn.addEventListener("click",async()=>{
    let from = document.querySelector("input[name='from']").value.split("-").reverse().join("-");
    let to = document.querySelector("input[name='to']").value.split("-").reverse().join("-");

    if (from.length == 0 || to.length == 0) {
        alert("أدخل التاريخ كاملا.")
    }else {
        overlay.style.display = "block";
        let res = await functions.createCustomReport({"from_date": from,"to_date": to});
        if (res.state == "not_found") {
            alert("لم يتم العثور علي بيانات بهذا التاريخ");
            overlay.style.display = "none";
        }else {
            data = res;
            addData()
        overlay.style.display = "none";
            
        }
    }


})


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
    // let res = await functions.getEmployees();
    // data = res;
    loader.style.display = "none";
    overlay.style.display = "none";
}




// if (1) {
//     var data1 = [["A", "B"], ["C", "D"]];
//     var data2 = [["E", "F"], ["G", "H"]]
//     var wb = XLSX.utils.book_new();
//     wb.SheetNames.push("Data1");
//     wb.Sheets["Data1"] = XLSX.utils.aoa_to_sheet(data1);
//     wb.SheetNames.push("Data2");
//     wb.Sheets["Data2"] = XLSX.utils.aoa_to_sheet(data2);
//     XLSX.writeFile(wb, "demo.xlsx");    
// }



overlay.addEventListener("click",()=>{
    overlay.style.display = "none";
    editPersonalDataWidget.style.display = "none";
    employeeHistoryWidget.style.display = "none"
})

async function addData(){
    console.log(data)
    document.querySelector(".report").style.display = "block"
    // Best Selling
    let bestSellingText = "";
    for(const product of data["best-selling"]) {
        bestSellingText += product["name"] + ", "
    }
    bestSellingText = bestSellingText.slice(0,-2)
    document.querySelector(".best-selling").innerHTML = bestSellingText;
    // Total
    document.querySelector(".total").innerHTML = data["total"];
    // Profit
    document.querySelector(".profit").innerHTML = data["profit"];
    // Returns
    document.querySelector(".returns").innerHTML = data["returns"];
    // Expenses
    document.querySelector(".expenses").innerHTML = data["expenses"];
    // Salaries
    document.querySelector(".salaries").innerHTML = data["salaries"];
    // Total Loss
    document.querySelector(".total-loss").innerHTML = data["salaries"] + data["expenses"] +  Math.abs(data["returns"]);
    // Net
    document.querySelector(".net").innerHTML =  data["profit"] - ( data["salaries"] + data["expenses"] + Math.abs(data["returns"]) ) ;

    // Running Out
    var table = document.querySelector("table.running-out tbody");
    table.innerHTML = "";
    if(data["running_out"].length == 0){
        document.querySelector(".t1").innerHTML = "منتجات علي وشك النفاذ (لا يوجد)";
        document.querySelector("table.running-out").style.display = "none";
    }else {
        document.querySelector(".t1").innerHTML = "منتجات علي وشك النفاذ";
        document.querySelector("table.running-out").style.display = "table";
    }
    for (var i=0;i<data["running_out"].length;i++) {
        let tr = document.createElement("tr");
        let name = document.createElement("td");
        let count = document.createElement("td");

        name.textContent = data["running_out"][i]["name"];
        count.textContent = data["running_out"][i]["num"];
        tr.appendChild(name);
        tr.appendChild(count);
        table.appendChild(tr);
    }
    // Sold Out
    var table = document.querySelector("table.sold-out tbody");
    table.innerHTML = "";
    if(data["sold_out"].length == 0){
        document.querySelector(".t2").innerHTML = "منتجات نفذت  (لا يوجد)";
        document.querySelector("table.sold-out").style.display = "none";
    }else {
        document.querySelector(".t2").innerHTML = "منتجات نفذت";
        document.querySelector("table.sold-out").style.display = "table";
    }
    for (var i=0;i<data["sold_out"].length;i++) {
        let tr = document.createElement("tr");
        let name = document.createElement("td");

        name.textContent = data["sold_out"][i];
        tr.appendChild(name);
        table.appendChild(tr);
    }
}