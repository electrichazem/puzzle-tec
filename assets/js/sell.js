import { JSFunctions, Login , api } from "./functions.js";

let items = document.querySelectorAll("aside img");
let overlay = document.querySelector(".overlay");
let loader = document.querySelector(".loader");
let functions = new JSFunctions();
let products = [];

// Seller Invoice
class Seller {
    constructor(){}
    addToTable() { 
        let table = document.querySelector(".seller-invoice table tbody");
        table.innerHTML = "";
        let items = ["name", "serial", "client", "gurantee"];
        
        for (let i=0;i<products.length;i++) {
          let tr = document.createElement("tr");
          // no.
          let td = document.createElement("td");
          td.textContent = i+1;
          tr.appendChild(td);

          for (const item of items) {
            let td = document.createElement("td");
            td.textContent = products[i][item];
            tr.appendChild(td);
          }
          
          
          let inputParent = document.createElement("td");
          inputParent.classList.add("table-input")
          let input = document.createElement("input");
          inputParent.appendChild(input);
          tr.appendChild(inputParent);
    
          let del = document.createElement("td");
          del.textContent = "حذف";
          del.classList.add("del-element");
          tr.appendChild(del);
    
          table.appendChild(tr);
        }
        
        let dels = document.querySelectorAll(".seller-invoice .del-element");
        dels.forEach((del, index) => {
          del.removeEventListener("click", this.deleteProduct); // Remove the old event listener
          del.addEventListener("click", () =>  this.deleteProduct(index)); // Add the correct event listener
        });
        let discounts = document.querySelectorAll(".seller-invoice .table-input input");
        discounts.forEach((discountItem, index) => {
            discountItem.removeEventListener("input", this.editPrice); // Remove the old event listener
            discountItem.addEventListener("input", async(e) => this.editPrice(index,discountItem.value)); // Add the correct event listener
        });
        this.getTotal();
    }
    deleteProduct(index) {
        products.splice(index, 1);
        this.addToTable()
    }
    editPrice (index,value) {
        if (isNaN(value)) value = 0
        products[index]["customerprice"] = +value;
        this.getTotal();
        
    }
    checkExistance(product){
        let is_exist = false;
        for (const item of products) {
            if (item.serial == product.serial) {
                is_exist = true;
                alert("عنصر موجود بالفعل");
                break;;
            }
        }
        return is_exist;
    }
    getTotal(){
        let total = 0;
        for (const product of products) {
            total += +product.customerprice;
        }
        totalSellerInvoicePrice.value =  "الإجمالي: " + total;
    }
    async finishSell(total,net,profit){
        let customerName = document.querySelector(".complete-seller-sell input[name='name']").value;
        let phone = document.querySelector(".complete-seller-sell input[name='phone']").value;
        let paid = document.querySelector(".complete-seller-sell #paid").value;
        let loader = document.querySelector(".loader");
    

        if (customerName.trim().length == 0 || phone.trim().length == 0 || paid.trim().length == 0) {
            alert("أدخل البيانات كاملة");
        } else if (isNaN(+paid.trim())) {
            alert("يحب كتابةالمدفوع بطريقة صحيحة")
        }
        else {
            loader.style.display = "block";
            document.querySelector(".complete-seller-sell").style.display = "none";
            function getDate() {
                const now = new Date();
                
                const day = now.getDate().toString().padStart(2, '0');
                const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
                const year = now.getFullYear().toString().slice(2); // Get last two digits of the year
                const hour = now.getHours().toString().padStart(2, '0');
                const minute = now.getMinutes().toString().padStart(2, '0');
              
                const formattedDate = `${day}-${month}-${year}-${hour}-${minute}`;
    
                return formattedDate;
            }
            function generateCode() {
                const now = new Date();
                const day = parseInt(now.getDate(), 10).toString(16);
                const month = (parseInt(now.getMonth(), 10) + 1).toString(16);
                const year = parseInt(now.getFullYear(), 10).toString(16);
                const hours = parseInt(now.getHours(), 10).toString(16);
                const minutes = parseInt(now.getMinutes(), 10).toString(16);
                const seconds = parseInt(now.getSeconds(), 10).toString(16);
                const milliseconds = parseInt(now.getMilliseconds(), 10).toString(16);
                const code = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}-${milliseconds}`;
                return code;
            }
    
            const date = getDate();
            let data = {};
            data["name"] = customerName;
            data["products"] = products;
            data["date"] = date;
            data["total"] = total;
            data["net"] = net;
            data["phone"] = phone;
            data["profit"] = profit;
            data["iscustomer"] = 0;
            data["code"] = generateCode();
            data = JSON.stringify(data);
            let responseData = await functions.finishCustomerSell(data);
            if (responseData) {
                loader.style.display = "none";
                overlay.style.display = "none";
                alert("تم البيع بنجاح.");
                
                localStorage.setItem("invoice-data",data);
                location.href = "/sell/invoice";
            }else {
                alert("خطأ.")
            }
    
        }
    }
    
    completeSellButton = document.querySelector(".seller-invoice .complete-sell");
}
let seller = new Seller();
let sellerInvoice = document.querySelector(".seller-invoice");
let openSellerInvoice = document.querySelector(".open-seller-invoice");
let sellerInvoiceInput = sellerInvoice.querySelector("input[name='serial']");
let sellerManualInvoiceInput = sellerInvoice.querySelector("input[name='code']");
let totalSellerInvoicePrice = sellerInvoice.querySelector("input[name='total']");
openSellerInvoice.addEventListener("click", ()=>{
    hideActions();
    sellerInvoice.style.display = "block";
    seller.addToTable();
    sellerInvoiceInput.focus();
    cancleReceitButton.style.display = "block";
});
sellerInvoiceInput.addEventListener("keypress",async(e)=>{
    if (e.key == "Enter" && sellerInvoiceInput.value.trim().length != 0) {
        overlay.style.display = "block";
        let product = await functions.searchByCode(sellerInvoiceInput.value);
        product["discount"] = 0;
        if(product.state == "Not found") {
        }else {
            let is_exist = seller.checkExistance(product);
            if (!is_exist) {
                product["customerprice"] = 0;
                products.push(product);
                seller.addToTable();   
            }
            sellerInvoiceInput.value = "";
        }
        overlay.style.display = "none";
    }
});
sellerManualInvoiceInput.addEventListener("keypress",async(e)=>{
    let code = sellerManualInvoiceInput.value.trim();
    let name = sellerInvoice.querySelector("input[name='name']").value.trim();
    let price = sellerInvoice.querySelector("input[name='price']").value.trim();
    let client = sellerInvoice.querySelector("input[name='client']").value.trim();
    let gurantee = sellerInvoice.querySelector("input[name='gurantee']").value.trim();
    let customerPrice = sellerInvoice.querySelector("input[name='seller-price']").value.trim();
    if (e.key == "Enter" && code.length != 0 && name.length != 0 && price.length != 0 && client.length != 0 && gurantee.length != 0 && customerPrice.length != 0) {
        let product = {name: name,serial: code,price: price,customerprice: customerPrice,gurantee: gurantee,client: client};
        let is_exist = seller.checkExistance(product);
        if (!is_exist) {
            products.push(product);
            seller.addToTable();
            sellerInvoice.querySelector("table tbody").lastChild.children[4].lastChild.value = +product.customerprice
        }
    }

});
seller.completeSellButton.addEventListener("click",async()=>{ 
    let is_zeroPriced = 0;
    for (let j=0;j<products.length;j++) {
        if (products[j]["customerprice"] == 0) {
            is_zeroPriced = j+1;   
            break;
        }
    }
    if (products.length == 0) {
        alert("أنت لم تدخل أي منتجات بالفعل")
    }else if (is_zeroPriced != 0) {
        alert(`أنت لم تدخل سعر للمنتج رقم: ${is_zeroPriced}`)
    } else {
        let completeSell = document.querySelector(".complete-seller-sell");
        completeSell.style.display = "flex"
        overlay.style.display = "block";
        let total = 0;
        let profit = 0;
        let net = 0;
        // ++++++++++
        let subtotalItem = document.querySelector(".complete-seller-sell #subtotal");
        let totalItem = document.querySelector(".complete-seller-sell #total");
        let paidItem = document.querySelector(".complete-seller-sell #paid");
        let netItem = document.querySelector(".complete-seller-sell #net");
        netItem.value = 0;
        // ++++++++++++

        for (const product of products) {
            total+= +product["customerprice"];
            profit+= product["customerprice"] - product["price"];
        }
        net = total;

        subtotalItem.innerHTML = "الإجمالي: " + total;
        totalItem.innerHTML = "المبلغ المطلوب: " + net;
        paidItem.value =  net;

        paidItem.addEventListener("input",()=>{
            netItem.value = net - (+paidItem.value)
            if (net - (+paidItem.value) < 0) {
                netItem.value = 0;
                paidItem.value = net;
            }
        }) 
        let finishSellButton = document.querySelector(".complete-seller-sell .btn");
    
        function finishSellFunction() {
            seller.finishSell(total, netItem.value, profit);
            finishSellButton.removeEventListener("click", finishSellFunction);
        }
        if (!finishSellButton.hasEventListener) {
            finishSellButton.addEventListener("click", finishSellFunction);
            finishSellButton.hasEventListener = true;
        }
    
    }
});


// Customer Invoice
class Customer {
    constructor (){}
    addToTable() {
        let table = document.querySelector(".customer-invoice table tbody");
        table.innerHTML = "";
        let items = ["name", "serial", "customerprice", "client", "gurantee"];
        
        for (let i=0;i<products.length;i++) {
            let tr = document.createElement("tr");
          
            // no.
            let td = document.createElement("td");
            td.textContent = i+1;
            tr.appendChild(td);

            for (const item of items) {
                let td = document.createElement("td");
                td.textContent = products[i][item];
                tr.appendChild(td);
            }
            
            
            let inputParent = document.createElement("td");
            inputParent.classList.add("table-input")
            let input = document.createElement("input");
            inputParent.appendChild(input);
            tr.appendChild(inputParent);
            if (products[i]["discount"] >= 0) {
                input.value = products[i]["discount"];
            }else {
                products[i]["discount"] =0
            }
        
            let del = document.createElement("td");
            del.textContent = "حذف";
            del.classList.add("del-element");
            tr.appendChild(del);
        
            table.appendChild(tr);
        }
        
        let dels = document.querySelectorAll(".customer-invoice .del-element");
        dels.forEach((del, index) => {
          del.removeEventListener("click", this.deleteProduct); // Remove the old event listener
          del.addEventListener("click", () => this.deleteProduct(index)); // Add the correct event listener
        });
        let discounts = customerInvoice.querySelectorAll(".customer-invoice .table-input input");
        discounts.forEach((discountItem, index) => {
            discountItem.removeEventListener("input", this.editDiscount); // Remove the old event listener
            discountItem.addEventListener("keypress", async(e) => this.editDiscount(e,index,discountItem.value)); // Add the correct event listener
        });
        this.getTotal();
    }
    deleteProduct(index) {
        products.splice(index, 1);
        this.addToTable()
    }
    editDiscount(e,index,value) {
        if (e.key == "Enter") {
            if (isNaN(value)) value = 0
            products[index]["discount"] = +value;
            this.addToTable()    
        }

    }
    checkExistance(product){
        let is_exist = false;
        for (const item of products) {
            if (item.serial == product.serial) {
                is_exist = true;
                alert("عنصر موجود بالفعل");
                break;;
            }
        }
        return is_exist;
    }
    getTotal(){
        let total = 0;
        for (const product of products) {
            total += +(product.customerprice) - +(product.discount);
        }
        totalPrice.value =  "الإجمالي: " + total;
    }
}
let customer = new Customer();
let customerInvoice = document.querySelector(".customer-invoice");
let customerInvoiceInput = customerInvoice.querySelector("input[name='serial']");
let customerManualInvoiceInput = customerInvoice.querySelector("input[name='code']");
let totalPrice = customerInvoice.querySelector("input[name='total']");

let openCustomerInvoice = document.querySelector(".open-customer-invoice");
openCustomerInvoice.addEventListener("click", ()=>{
    hideActions();
    customerInvoice.style.display = "block";
    customerInvoiceInput.focus();
    customer.addToTable();
    cancleReceitButton.style.display = "block";
});
customerInvoiceInput.addEventListener("keypress",async(e)=>{
    if (e.key == "Enter" && customerInvoiceInput.value.trim().length != 0) {
        overlay.style.display = "block";
        let product = await functions.searchByCode(customerInvoiceInput.value);
        product["discount"] = 0;
        if(product.state == "Not found") {
        }else {
            let is_exist = customer.checkExistance(product);
            if (!is_exist) {
                products.push(product);
                customer.addToTable();   
            }
            customerInvoiceInput.value = "";
        }
        overlay.style.display = "none";
    }
});
customerManualInvoiceInput.addEventListener("keypress",async(e)=>{
    let code = customerManualInvoiceInput.value.trim();
    let name = customerInvoice.querySelector("input[name='name']").value.trim();
    let price = customerInvoice.querySelector("input[name='price']").value.trim();
    let client = customerInvoice.querySelector("input[name='client']").value.trim();
    let gurantee = customerInvoice.querySelector("input[name='gurantee']").value.trim();
    let customerPrice = customerInvoice.querySelector("input[name='customer-price']").value.trim();
    if (e.key == "Enter" && code.length != 0 && name.length != 0 && price.length != 0 && client.length != 0 && gurantee.length != 0 && customerPrice.length != 0) {
        let product = {name: name,serial: code,price: price,customerprice: customerPrice,gurantee: gurantee,client: client};
        let is_exist = customer.checkExistance(product);
        if (!is_exist) {
            products.push(product);
            customer.addToTable();   
        }
    }

});

let completeSellButton = customerInvoice.querySelector(".customer-invoice .complete-sell");
completeSellButton.addEventListener("click",async()=>{ 
   
    if (products.length == 0) {
        alert("أنت لم تدخل أي منتجات بالفعل")
    } else {
        let completeSell = document.querySelector(".complete-customer-sell");
        completeSell.style.display = "flex"
        overlay.style.display = "block";
        let total = 0;
        let discount = 0;
        let profit = 0;
        let net = 0;
        // ++++++++++
        let subtotalItem = document.querySelector(".complete-customer-sell #subtotal");
        let discountItem = document.querySelector(".complete-customer-sell #discount");
        let totalItem = document.querySelector(".complete-customer-sell #total");
        let paidItem = document.querySelector(".complete-customer-sell #paid");
        let netItem = document.querySelector(".complete-customer-sell #net");
        netItem.value = 0;
        // ++++++++++++

        for (const product of products) {
            total+= +product["customerprice"];
            discount+= +product["discount"];
            profit+= product["customerprice"] - product["price"];
        }
        net = total - discount;
   
        subtotalItem.innerHTML = "الإجمالي: " + total;
        discountItem.innerHTML = "الخصم: " + discount;
        totalItem.innerHTML = "المبلغ المطلوب: " + net;
        paidItem.value =  net;

        paidItem.addEventListener("input",()=>{
            netItem.value = net - (+paidItem.value)
            if (net - (+paidItem.value) < 0) {
                netItem.value = 0;
                paidItem.value = net;
            }
        }) 
        let finishSellButton = document.querySelector(".complete-customer-sell .btn");
    
        function finishSellFunction() {
            finishSell(total, netItem.value, profit, discount);
            finishSellButton.removeEventListener("click", finishSellFunction);
        }
        if (!finishSellButton.hasEventListener) {
            finishSellButton.addEventListener("click", finishSellFunction);
            finishSellButton.hasEventListener = true;
        }
    
    }
        

});
async function finishSell(total,net,profit,discount){
    let customerName = document.querySelector(".complete-customer-sell input[name='name']").value;
    let phone = document.querySelector(".complete-customer-sell input[name='phone']").value;
    let paid = document.querySelector(".complete-customer-sell #paid").value;
    let loader = document.querySelector(".loader");

    
    if (customerName.trim().length == 0 || phone.trim().length == 0 || paid.trim().length == 0) {
        alert("أدخل البيانات كاملة");
    } else if (isNaN(+paid.trim())) {
        alert("يحب كتابةالمدفوع بطريقة صحيحة")
    }
    else {
        loader.style.display = "block";
        document.querySelector(".complete-customer-sell").style.display = "none";
        function getDate() {
            const now = new Date();
            
            const day = now.getDate().toString().padStart(2, '0');
            const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
            const year = now.getFullYear().toString(); // Get last two digits of the year
            const hour = now.getHours().toString().padStart(2, '0');
            const minute = now.getMinutes().toString().padStart(2, '0');
          
            const formattedDate = `${day}-${month}-${year}-${hour}-${minute}`;

            return formattedDate;
        }
        function generateCode() {
            const now = new Date();
            const day = parseInt(now.getDate(), 10).toString(16);
            const month = (parseInt(now.getMonth(), 10) + 1).toString(16);
            const year = parseInt(now.getFullYear(), 10).toString(16);
            const hours = parseInt(now.getHours(), 10).toString(16);
            const minutes = parseInt(now.getMinutes(), 10).toString(16);
            const seconds = parseInt(now.getSeconds(), 10).toString(16);
            const milliseconds = parseInt(now.getMilliseconds(), 10).toString(16);
            const code = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}-${milliseconds}`;
            return code;
        }

        const date = getDate();
        let data = {};
        for (let product of products) {
            product["selling_date"] = date
        }
        data["name"] = customerName;
        data["products"] = products;
        data["date"] = date;
        data["total"] = total;
        data["net"] = net;
        data["phone"] = phone;
        data["profit"] = profit - discount;
        data["iscustomer"] = 1;
        data["code"] = generateCode();
        data = JSON.stringify(data);
        let responseData = await functions.finishCustomerSell(data);
        if (responseData) {
            loader.style.display = "none";
            overlay.style.display = "none";
            alert("تم البيع بنجاح.");
            
            localStorage.setItem("invoice-data",data);
            location.href = "/sell/invoice"
        }else {
            alert("خطأ.")
        }

    }
}
// ++++++++++++++++++

function hideActions(){
    openCustomerInvoice.style.display = "none";
    openSellerInvoice.style.display = "none";
}
function cancleReceit(){
    products.length = 0 ;
    customerInvoice.style.display = "none";
    customerInvoice.querySelector("input").value = "";
    openCustomerInvoice.style.display = "block";
    openSellerInvoice.style.display = "block";

    sellerInvoice.style.display = "none";
    sellerInvoice.querySelector("input").value = "";
    cancleReceitButton.style.display = "none";
}

overlay.addEventListener("click",()=>{
    overlay.style.display = "none";
    document.querySelector(".complete-customer-sell").style.display = "none";
    document.querySelector(".complete-seller-sell").style.display = "none";
});

let cancleReceitButton = document.querySelector(".cancle-invoice");
cancleReceitButton.addEventListener("click",cancleReceit);

let printReceipt = document.querySelectorAll(".print-receipt");
printReceipt.forEach((ele)=>{
    ele.addEventListener("click",()=>{
        products.length = 0;
        location.href = "/sell/invoice";
    });
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
    loader.style.display = "none";
    overlay.style.display = "none";
}

  