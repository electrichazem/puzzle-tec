import { Login , api } from "./functions.js";

let data;
let is_uploaded = false;
let items = document.querySelectorAll("aside img");
let overlay = document.querySelector(".overlay");
let loader = document.querySelector(".loader");
let hide = document.querySelector(".actions #hide");
let addReceipt = document.querySelector(".add-receipt");
let editReceipt = document.querySelector(".edit-receipt");
let showReceipt = document.querySelector(".receipt-details");
let products = [];

overlay.addEventListener("click",()=>{
    overlay.style.display = "none";
    addReceipt.style.display = "none";
    editReceipt.style.display ="none";
    showReceipt.style.display = "none"
});


async function getInvoices() {
    let name = localStorage.getItem("name");
    let password = localStorage.getItem("password");
    let seller = localStorage.getItem("seller");
    let title = document.querySelector(".title");
    for (let i = 0; i < 100; i++) {
        let response = await fetch(`${api}get_sellers.php?name=${name}&password=${password}&with_invoices=true`);
        let responseData = JSON.parse(await response.text());
        if (responseData.state === "Empty") {
            alert("خطأ");
            location.href = "/";
            break;
        } else if (responseData.state === false) {
            alert("خطأ");
            location.href = "/";
            break;
        } else {
            for(i=0;i<responseData.length;i++) {
                if(responseData[i]["name"] == seller) {
                    title.textContent = seller;
                    await analysis(JSON.parse(responseData[i]["invoices"]));
                    addItemsToTable(JSON.parse(responseData[i]["invoices"]));
                    break;
                }
            }
            break;
        }
        
    }
}

function addItemsToTable(invoices) {
    const table = document.querySelector("table.invoices tbody");
    table.textContent = "";
    for(const invoice of invoices) {
        const row = document.createElement("tr");
        const createdDate = document.createElement("td");
        createdDate.textContent = invoice["date"];
        const lastEditedDate = document.createElement("td");
        lastEditedDate.textContent = invoice["last_edited_date"];
        const total = document.createElement("td");
        total.textContent = invoice["total_price"];
        const paid = document.createElement("td");
        paid.textContent = invoice["paid"];
        const state = document.createElement("td");
        state.textContent = invoice["state"];
        const net = document.createElement("td");
        net.textContent = invoice["total_price"] - invoice["paid"];

        const edit = document.createElement("td");
        edit.classList.add('edit');
        if( invoice["total_price"] - invoice["paid"] != 0) {
            edit.textContent = "تعديل";
        }else {
            edit.textContent = "-"
        }


        const show = document.createElement("td");
        const showSpan = document.createElement("span");
        showSpan.classList.add('show');
        showSpan.textContent = "عرض";
        show.appendChild(showSpan);

        row.appendChild(createdDate);
        row.appendChild(lastEditedDate);
        row.appendChild(total);
        row.appendChild(paid);
        row.appendChild(net);
        row.appendChild(state);
        row.appendChild(edit);
        row.appendChild(show);
        table.appendChild(row);
    }
    let edits = document.querySelectorAll(".edit");
    edits.forEach((ele,index)=>{
        ele.addEventListener("click",()=>{
            let data = invoices[index];
            if (data["total_price"] - data["paid"] == 0 )  {}
            else {
                overlay.style.display = "block";
                editReceipt.style.display = "flex";
                let total = document.querySelector(".edit-receipt input[name='total']");
                let paid = document.querySelector(".edit-receipt input[name='paid']");
                let net = document.querySelector(".edit-receipt input[name='net']");
                let addedValue = document.querySelector(".edit-receipt input[name='added-value']");
                let equ =0
        
                total.value  =  "الإجمالي: "+ data["total_price"];
                paid.value  = "المدفوع: " + data["paid"]
                net.value =  "الباقي: " + (data["total_price"] - data["paid"]);
                addedValue.addEventListener("input",()=>{
                   equ = ((data["total_price"] - data["paid"]) - addedValue.value);
                    if (equ < 0) {
                        equ = 0;
                    }
                    net.value = "الباقي: " + (data["total_price"] - data["paid"]) + " - " + addedValue.value + " = " + equ
                });
                let uploadEdit = document.querySelector(".edit-receipt .btn");
                uploadEdit.addEventListener("click",async()=>{
                   
                    if (!is_uploaded) {
                        is_uploaded = true;
                        let updatedData = data;
                        const currentDate = new Date();
                        const year = currentDate.getFullYear();
                        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so we add 1
                        const day = String(currentDate.getDate()).padStart(2, '0');
                        
                        const formattedDate = `${day}-${month}-${year}`;
                        updatedData["paid"] =  +updatedData["total_price"] -  +equ ;
                        if (equ == 0) {
                            updatedData["state"] = "closed";
                            addedValue.value = +(data["total_price"] - data["paid"]);
                        }
                        updatedData["last_edited_date"] = formattedDate;
    
                        updatedData["history"].push({"date": formattedDate,"added": addedValue.value,"paid": updatedData["paid"],"net": +equ});
    
                        updatedData = JSON.stringify(updatedData);

                        editReceipt.style.display = "none";
                        // Upload!!!
                        for (let i = 0; i < 100; i++) {
                            try {
                                let name = localStorage.getItem("name");
                                let password = localStorage.getItem("password");
                                let seller = localStorage.getItem("seller");
                                let response = await fetch(`${api}edit_seller.php?name=${name}&password=${password}&seller=${seller}&new_data=${updatedData}&index=${index}`);
                                let responseData = JSON.parse(await response.text());
    
                                if (responseData.state === false) {
                                    alert(`خطأ`);
                                    location.href = "/";
                                    break;
                                } else if (responseData.state === true) {
                                    addedValue.value = ""
                                    alert("تم التعديل بنجاح ");
                                    location.reload()
                                    break;
                                }
                            }catch {
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                           
                        }
                    }
                   
                });

            }
        });
    });
    let shows = document.querySelectorAll(".show");
    shows.forEach((ele,index)=>{
        ele.addEventListener("click",()=>{
            let fitstTable = document.querySelector(".receipt-details table.t1 tbody");
            let secondTable = document.querySelector(".receipt-details table.t2 tbody");
            fitstTable.textContent = "";
            secondTable.textContent = "";
            let data = invoices[index];
            overlay.style.display = "block";
            showReceipt.style.display = "flex";
            let date = document.querySelector(".receipt-details input[name='date']");
            let total = document.querySelector(".receipt-details input[name='total']");
            let paid = document.querySelector(".receipt-details input[name='paid']");
            let productsNumebr = document.querySelector(".receipt-details input[name='product-num']");
        
            total.value  =  "الإجمالي: "+ data["total_price"];
            paid.value  = "المدفوع: " + data["paid"]
            date.value =  "التاريخ: " + data["date"];
            productsNumebr.value = "عدد العناصر: " +  data["products"].length
            for(let product of data["products"]) {
                let row  = document.createElement("tr");
                let name = document.createElement("td");
                name.textContent = product.name;
                let serial = document.createElement("td");
                serial.textContent = product.serial;
                let guarantee = document.createElement("td");
                guarantee.textContent = product["guarantee"];
                let client = document.createElement("td");
                client.textContent = product.client;
    
                row.appendChild(name);
                row.appendChild(serial);
                row.appendChild(client);
                row.appendChild(guarantee);
                fitstTable.appendChild(row);
            }
            let lastItem ={};
            for(let item of data["history"]){
                // For the spam
                if (JSON.stringify(item)  != JSON.stringify(lastItem) ) {
                    let row  = document.createElement("tr");
                    let date = document.createElement("td");
                    date.textContent = item.date;
                    let added = document.createElement("td");
                    added.textContent = item.added;
                    let totalPaid = document.createElement("td");
                    totalPaid.textContent = item.paid;
                    let net = document.createElement("td");
                    net.textContent = item.net;
                    row.appendChild(date);
                    row.appendChild(added);
                    row.appendChild(totalPaid);
                    row.appendChild(net);
                    secondTable.appendChild(row);
                    lastItem = item;
                }else {}
            }
            });
            
    });
}

async function analysis(invoices){
    const con1 = document.querySelector(".con1");
    const con2 = document.querySelector(".con2");
    con1.textContent = "";
    con2.textContent = "";

    const numberOfInvoices = invoices.length;
    let numberOfOpenedInvoices = 0;
    let numberOfClosedInvoices = 0;
    let InvoicesSubtotal = 0;
    let totalPaid = 0;

    for (const invoice of invoices) {
        invoice["state"] == "opened" ? numberOfOpenedInvoices++ : numberOfClosedInvoices++;
        InvoicesSubtotal += +invoice["total_price"];
        totalPaid += +invoice["paid"];
    }
    const net = InvoicesSubtotal - totalPaid;

    let numberOfInvoicesSpan = document.createElement("span");
    numberOfInvoicesSpan.textContent =  "عدد الفواتير: " + numberOfInvoices;

    let numberOfOpenedInvoicesSpan = document.createElement("span");
    numberOfOpenedInvoicesSpan.textContent = "عدد الفواتير المفتوحة: " + numberOfOpenedInvoices;

    let numberOfClosedInvoicesSpan = document.createElement("span");
    numberOfClosedInvoicesSpan.textContent =  "عدد الفواتير المغلقة: " + numberOfClosedInvoices;

    let InvoicesSubtotalSpan = document.createElement("span");
    InvoicesSubtotalSpan.textContent = "إجمالي الفواتير: " + InvoicesSubtotal;

    let totalPaidSpan = document.createElement("span");
    totalPaidSpan.textContent =  "أجمالي المدفوع: " + totalPaid;

    let netSpan = document.createElement("span");
    netSpan.textContent = "الباقي: " + net;

    con1.appendChild(numberOfInvoicesSpan);
    con1.appendChild(numberOfOpenedInvoicesSpan);
    con1.appendChild(numberOfClosedInvoicesSpan);
    
    con2.appendChild(InvoicesSubtotalSpan);
    con2.appendChild(totalPaidSpan);
    con2.appendChild(netSpan);
    
}

function addItem(code){
    let name = document.querySelector("input[name='name']").value.trim();
    let client = document.querySelector("input[name='client']").value.trim();
    let guarantee = document.querySelector("input[name='guarantee']").value.trim();
    let table = document.querySelector(".add-receipt table tbody");

    if (name.length == 0 || client.length == 0 || guarantee.length ==0) {
        alert("أدخل البيانات كاملة");
        return;
    }

    products.push({"name": name,"serial": code,"guarantee": guarantee,"client": client});

    let row = document.createElement("tr");
    let nameItem = document.createElement("td");
    nameItem.textContent = name;
    let clientItem = document.createElement("td");
    clientItem.textContent = client;
    let guaranteeItem = document.createElement("td");
    guaranteeItem.textContent = guarantee;
    let codeItem = document.createElement("td");
    codeItem.textContent = code;
    row.appendChild(nameItem);
    row.appendChild(codeItem);
    row.appendChild(clientItem);
    row.appendChild(guaranteeItem);
    table.appendChild(row);
}



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
    await getInvoices();
    loader.style.display = "none";
    overlay.style.display = "none";
   
}

// Add
add.addEventListener("click",()=>{
    addReceipt.style.display = "flex";
    overlay.style.display = "block";
});

let codeInput = document.querySelector("input[name='code']");


codeInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (codeInput.value.length != 0) {
            addItem(codeInput.value);
            codeInput.value = "";
        }
    }
    
});

let uploadReceipt = document.querySelector(".add-receipt .btn");
uploadReceipt.addEventListener("click",async()=>{
    const total = document.querySelector("input[name='total']").value.trim();
    const paid = document.querySelector("input[name='paid']").value.trim();
    let date = document.querySelector("input[name='date']").value.trim().split("-").reverse().join("-");
    

    if (total.length == 0 || paid.length == 0 || date.length == 0) {
        alert("أدخل البيانات كاملة");
    }else if(total - paid < 0){
        alert("يحب أن يكون الإجمالي أصغر من المدفوع")
    }
    else {
        const name = localStorage.getItem("name");
        const password = localStorage.getItem("password");
        const seller = localStorage.getItem("seller");

        let state;
        if (total!=paid) {
            state = "opened";
        }else {
            state = "closed";
        }
    
        let data  = {
            "date": date,
            "last_edited_date": date,
            "total_price": total,
            "paid": paid,
            "state": state,
            "products": products,
            "history": [{"date": date,"added": +paid,"paid": +paid,"net": total-paid}],
        };
        data = JSON.stringify(data);
        addReceipt.style.display = "none";
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}buy_products.php?name=${name}&password=${password}&seller=${seller}&data=${data}`);
                let responseData = JSON.parse(await response.text());
                if (responseData.state === false) {
                    alert(`خطأ`);
                    location.href = "/";
                    break;
                } else if (responseData.state === true) {
                    alert("تم الإضافة بنجاح");
                    location.reload()
                    break;
                }
            }catch{
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
          
        }
    }


});

function hideClosed() {
    let edits = document.querySelectorAll("tr .edit");
    edits.forEach((ele)=>{
        ele.parentElement.style.display = "";
    })
    if(hide.innerHTML == "إخفاء الفواتير المغلقة") {
        edits.forEach((ele) => {
            if (ele.innerHTML === '-') {
                ele.parentElement.style.display = "none";
            }
        });
        hide.innerHTML = "إخفاء الفواتير المفتوحة";
    }else {
        edits.forEach((ele) => {
            if (ele.innerHTML != '-') {
                ele.parentElement.style.display = "none";
            }
        });
        hide.innerHTML = "إخفاء الفواتير المغلقة";
    }
   
}

hide.addEventListener("click", hideClosed);