import { JSFunctions, Login } from "./functions.js";

let items = document.querySelectorAll("aside img");
let overlay = document.querySelector(".overlay");
let loader = document.querySelector(".loader");

let functions = new JSFunctions();
let products = [];

// Widgets
let searchByCodeWidget  = document.querySelector(".search-by-code-widget");
let searchByNameWidget  = document.querySelector(".search-by-name-widget");
let editCategoryPriceWidget  = document.querySelector(".edit-category-price-widget");
let editProductPriceWidget  = document.querySelector(".edit-product-price-widget");
let deleteProductWidget = document.querySelector(".delete-product-widget");
let addProductWidget = document.querySelector(".add-product-widget");



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
    await getProducts();
    loader.style.display = "none";
    overlay.style.display = "none";
}
async function getProducts(){
    let data = await functions.searchByName("");
    function addItems(data){
        let n=0;
        let table = document.querySelector("table.products tbody");
        let dataItems = ["name","serial","price","customerprice","client","gurantee","date"];
        table.innerHTML = "";
    
        for(let item of data) {
            item = JSON.parse(item)
            // Num
            n++;
            let tr  = document.createElement("tr");
            let numElement = document.createElement("td");
            numElement.innerHTML = n;
            tr.appendChild(numElement);
            // Name
            let nameElement = document.createElement("td");
            nameElement.innerHTML = item["name"];
            tr.appendChild(nameElement);
            // Serial
            let serialElement = document.createElement("td");
            serialElement.innerHTML = item["serial"];
            tr.appendChild(serialElement);
            // Price
            let priceElement = document.createElement("td");
            priceElement.innerHTML = item["price"];
            tr.appendChild(priceElement);
            // CustomerPrice
            let customerPriceElement = document.createElement("td");
            customerPriceElement.innerHTML = item["customerprice"];
            tr.appendChild(customerPriceElement);
            // Client
            let clientElement = document.createElement("td");
            clientElement.innerHTML = item["client"];
            tr.appendChild(clientElement);
            // Serial
            let guranteeElement = document.createElement("td");
            guranteeElement.innerHTML = item["gurantee"];
            tr.appendChild(guranteeElement);
            // Date
            let dateElement = document.createElement("td");
            dateElement.innerHTML = item["date"];
            tr.appendChild(dateElement);
            // Edit
            let editElement = document.createElement("td");
            editElement.textContent = "تعديل";
            editElement.classList.add("edit-element")
            tr.appendChild(editElement);
            table.appendChild(tr);
            // Del
            let delElement = document.createElement("td");
            delElement.textContent = "حذف";
            delElement.classList.add("del-element")
            tr.appendChild(delElement);
            table.appendChild(tr);
        }
    
        let edits = document.querySelectorAll("table.products tbody .edit-element");
        edits.forEach((ele, index) => {
            ele.removeEventListener("click", clickEvent);
            ele.addEventListener("click", () => clickEvent(data, index));
        });
        let dels = document.querySelectorAll("table.products tbody .del-element");
        dels.forEach((ele, index) => {
            ele.removeEventListener("click", delEvent);
            ele.addEventListener("click", () => delEvent(data, index));
        });
    }
    function clickEvent(data, index) {
        data = JSON.parse(data[index]);
        editProductPriceWidget.style.display = "flex";
        overlay.style.display = "block";
        
        let serial = document.querySelector(".edit-product-price-widget input[name='code']");
        let price = document.querySelector(".edit-product-price-widget input[name='price']");
        serial.value = data.serial;
        price.value = data.price;
    }
    function delEvent(data, index) {
        data = JSON.parse(data[index]);
        deleteProductWidget.style.display = "flex";
        overlay.style.display = "block";
        
        let serial = document.querySelector(".delete-product-widget input[name='code']");
        serial.value = data.serial;
    }
    if (data.state != "Not found") {
        addItems(data) ;
    }
}


overlay.addEventListener("click",()=>{
    overlay.style.display = "none";
    searchByCodeWidget.style.display = "none";
    searchByNameWidget.style.display = "none";
    editCategoryPriceWidget.style.display = "none";
    editProductPriceWidget.style.display = "none";
    deleteProductWidget.style.display = "none";
    addProductWidget.style.display = "none";
});


let searchByCode = document.querySelector(".serach-by-code");
searchByCode.addEventListener("click",()=>{
    overlay.style.display = "block";
    searchByCodeWidget.style.display = "flex";
    searchByCodeInput.focus();
});
let searchByCodeInput = document.querySelector(".search-by-code-widget input");
searchByCodeInput.addEventListener('keydown', async function(event) {
    if (event.key === 'Enter') {
        let table = document.querySelector(".search-by-code-widget table tbody");
        table.innerHTML = ""
        if (searchByCodeInput.value.length != 0) {
            let data = await functions.searchByCode(searchByCodeInput.value);
            if (data.state === "Not found") {
                alert("لم يتم العثور علي منتح بهذا الكود");
            }else {
                let dataItems = ["name","price","customerprice","client","gurantee","date"];
                
                // Row
                let row = document.createElement("tr");
                for (const item of dataItems) {
                    let td = document.createElement("td");
                    td.textContent = data[item];
                    row.appendChild(td);
                }
                table.appendChild(row);
                searchByCodeInput.value = "";
            }
        }
    }
});


let searchByName = document.querySelector(".search-by-name");
searchByName.addEventListener("click",()=>{
    overlay.style.display = "block";
    searchByNameWidget.style.display = "flex";
    searchByNameInput.focus();
});
let searchByNameInput = document.querySelector(".search-by-name-widget input");
searchByNameInput.addEventListener('keydown', async function(event) {
    if (event.key === 'Enter') {
        if (searchByNameInput.value.length != 0) {
            document.querySelector(".search-by-name-widget table tbody").innerHTML = "";
            let data = await functions.searchByName(searchByNameInput.value);
            if (data.state == "Not found") {
                alert("لم يتم العثور علي منتجات بهذا الإسم");
            }else {
            // Row
            if (data.state != "Not found") {
                addItems(data) ;
            }
            searchByNameInput.value = "";
            }
        }
    }
});
function addItems(data){
    let table = document.querySelector(".search-by-name-widget table tbody");
    let dataItems = ["name","serial","price","customerprice","client","gurantee"];
    table.innerHTML = "";

    const items = {};
    for (const json of data) {
        const item = JSON.parse(json);
        const key = `${item.name}-${item.client}-${item.gurantee}-${item.price}-${item.customerprice}`;

        if (!items[key]) {
            items[key] = {
                name: item.name,
                serial: "",
                client: item.client,
                gurantee: item.gurantee,
                price: item.price,
                customerprice: item.customerprice
            };
        }

        if (item.serial && !items[key].serial.includes(item.serial)) {
            if (items[key].serial) {
                items[key].serial += "<br/>";
            }
            items[key].serial += item.serial;
        }
    }

    const groupedArray = Object.values(items);
    for(let item of groupedArray) {        
        let tr  = document.createElement("tr");
        let len = item["serial"].split("<br/>").length;

        let lenElement = document.createElement("td");
        lenElement.textContent = len
        tr.appendChild(lenElement);
        for(let i of dataItems) {
            let td = document.createElement("td");
            td.innerHTML = item[i];
            tr.appendChild(td);
        }
        let editElement = document.createElement("td");
        editElement.textContent = "تعديل";
        editElement.classList.add("edit-element")
        tr.appendChild(editElement);
        table.appendChild(tr);
    }

    let trs = document.querySelectorAll(".search-by-name-widget table tbody .edit-element");
    trs.forEach((ele, index) => {
        ele.removeEventListener("click", clickEvent);
        ele.addEventListener("click", () => clickEvent(data, index));
    });
}
function clickEvent(data, index) {
    data = JSON.parse(data[index])
    searchByNameWidget.style.display = "none";
    editCategoryPriceWidget.style.display = "flex";
    let name = document.querySelector(".edit-category-price-widget input[name='name']");
    let price = document.querySelector(".edit-category-price-widget input[name='price']");
    let customerPrice = document.querySelector(".edit-category-price-widget input[name='customer-price']");
    let guarantee = document.querySelector(".edit-category-price-widget input[name='guarantee']");
    let client = document.querySelector(".edit-category-price-widget input[name='client']");
    let date = document.querySelector(".edit-category-price-widget input[name='date']");
    name.value = data.name;
    guarantee.value = data.gurantee;
    client.value = data.client;
    customerPrice.value = data.customerPrice;
    date.value = data.date
}


let editCategoryPrice = document.querySelector(".edit-category-price");
editCategoryPrice.addEventListener("click",()=>{
    overlay.style.display = "block";
    editCategoryPriceWidget.style.display = "flex";
});
let editCategoryPriceButton = document.querySelector(".edit-category-price-widget .btn");
editCategoryPriceButton.addEventListener('click', async function(event) {
    
    let name = document.querySelector(".edit-category-price-widget input[name='name']").value.trim();
    let price = document.querySelector(".edit-category-price-widget input[name='price']").value.trim();
    let customerPrice = document.querySelector(".edit-category-price-widget input[name='customer-price']").value.trim();
    let guarantee = document.querySelector(".edit-category-price-widget input[name='guarantee']").value.trim();
    let client = document.querySelector(".edit-category-price-widget input[name='client']").value.trim();
    let date = document.querySelector(".edit-category-price-widget input[name='date']").value.trim();
    date = date.split("-").reverse().join("-");

        if (name.length != 0 && price.length != 0 && customerPrice.length !=0 && guarantee.length !=0 && client.length != 0 && date.length != 0) {
            editCategoryPriceWidget.style.display = "none";
            let data = await functions.editCategoryPrice(name,price,customerPrice,guarantee,client,date);
            if (data.state == "edited") {
                alert(`تم تعديل سعر ${data.num} قطع`);
                location.reload()
            }
        }else {
            alert("أدخل البيانات كاملة")
        }
});



let editProductPrice = document.querySelector(".edit-product-price");
editProductPrice.addEventListener("click",()=>{
    overlay.style.display = "block";
    editProductPriceWidget.style.display = "flex";
});
let editProductPriceButton = document.querySelector(".edit-product-price-widget .btn");
editProductPriceButton.addEventListener('click', async function(event) {
    let code = document.querySelector(".edit-product-price-widget input[name='code']").value.trim();
    let price = document.querySelector(".edit-product-price-widget input[name='price']").value.trim();
    let customerPrice = document.querySelector(".edit-product-price-widget input[name='customer-price']").value.trim();

        if (code.length != 0 && price.length != 0 && customerPrice.length !=0) {
                editProductPriceWidget.style.display = "none";
                    let data = await functions.editProductPrice(code,price,customerPrice);
                    if (data.state == "edited") {
                        alert(`تم تعديل سعر ${data.num} قطع`)
                        overlay.style.display = "none";
                        location.reload()

                    }else if (data.state == "Not found"){
                        alert(`منتح غير موجود`);
                        overlay.style.display = "none"

                    }else {
                        alert(`خطأ`);
                        overlay.style.display = "none"
                    }
        }else {
            alert("أدخل البيانات كاملة")
        }
});


let deleteProduct = document.querySelector(".del-product");
deleteProduct.addEventListener("click",()=>{
    overlay.style.display = "block";
    deleteProductWidget.style.display = "flex";
});
let deleteProductButton = document.querySelector(".delete-product-widget .btn");
deleteProductButton.addEventListener('click', async function(event) {
    let code = document.querySelector(".delete-product-widget input[name='code']").value.trim();
    let limit = 1;
    if(code.includes("*")) {
        let index = code.indexOf("*");
        let multiplier  = +code.substring(index+1);
        if(!isNaN(multiplier)) {
            limit = multiplier;
        }
        code = code.substring(0, index);
    }
        if (code.length != 0) {

                try {
                    let data = await functions.deleteProduct(code,limit);
                    if (data.state == "deleted") {
                        alert(`تم حذف  ${data.num} قطع`);
                        location.reload()
                    }else if (data.state == "Not found"){
                        alert(`غير موجود`)
                    }else {
                        alert(`خطأ`);
                    }
                }catch {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
        }else {
            alert("أدخل البيانات كاملة")
        }
});


let addProduct  = document.querySelector(".add-product");
addProduct.addEventListener("click",()=>{
    overlay.style.display = "block";
    addProductWidget.style.display = "flex";
});
let addProductButton = document.querySelector(".add-product-widget .btn");
addProductButton.addEventListener('click', async function(event) {
        if (products.length != 0) {
            addProductWidget.style.display = "none";
            await functions.addProduct(JSON.stringify(products));
            overlay.style.display = "none";

        }else {
            alert("أنت لم تدخل أي منتجات بالفعل")
        }
});
let codeInput = document.querySelector(".add-product-widget input[name='code']");
codeInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (codeInput.value.length != 0) {
            addItem(codeInput.value);
            codeInput.value = "";
        }
    }
    
});
function addItem(code){
    let table = document.querySelector(".add-product-widget table tbody");
    let name = document.querySelector(".add-product-widget input[name='name']").value.trim();
    let client = document.querySelector(".add-product-widget input[name='client']").value.trim();
    let guarantee = document.querySelector(".add-product-widget input[name='guarantee']").value.trim();
    let price = document.querySelector(".add-product-widget input[name='price']").value.trim();
    let customerPrice = document.querySelector(".add-product-widget input[name='customer-price']").value.trim();
    let totalPrice = document.querySelector(".add-product-widget input[name='total']");
    let total = 0;
    let date = document.querySelector(".add-product-widget input[name='date']").value.trim();
    date = date.split("-").reverse().join("-");
    if (name.length != 0 && client.length != 0 && guarantee.length != 0 && price.length != 0 && customerPrice.length != 0 && date.length != 0) {
        products.push({"name": name,"serial": code,"gurantee": guarantee,"client": client,"price": price,"customerprice": customerPrice,"date": date});
        products.forEach((ele)=>{
            total+= +ele["price"];
        })
        totalPrice.value = total;
        let row = document.createElement("tr"); 
        let nameItem = document.createElement("td");
        nameItem.textContent = name;
        let clientItem = document.createElement("td");
        clientItem.textContent = client;
        let guranteeItem = document.createElement("td");
        guranteeItem.textContent = guarantee;
        let codeItem = document.createElement("td");
        codeItem.textContent = code;
        let priceItem = document.createElement("td");
        priceItem.textContent = price;
        let customerPriceItem = document.createElement("td");
        customerPriceItem.textContent = customerPrice;
        row.appendChild(nameItem);
        row.appendChild(clientItem);
        row.appendChild(guranteeItem);
        row.appendChild(codeItem);

        row.appendChild(customerPriceItem);
        row.appendChild(priceItem);
        table.appendChild(row);
    }else {
        alert("أدخل البيانات كاملة");
    }
}

let state = true;
let showTableActions = document.querySelector(".show-table-actions");
showTableActions.addEventListener("click",()=>{
    let edits = document.querySelectorAll(".edit-element,.del-element");
    edits.forEach((ele)=>{
        ele.classList.toggle("hidden");
    });
    if (state) {
        showTableActions.innerHTML = "إظهار عناصر التحكم"
    }else {
        showTableActions.innerHTML = "إخفاء عناصر التحكم"
    }
    state = !state;
});
