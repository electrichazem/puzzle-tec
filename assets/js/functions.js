
export let api = "https://192.168.137.1/puzzle-tech/";

export async function Login(){
    let name = localStorage.getItem("name");
    let password = localStorage.getItem("password");
    for (let i = 0; i < 100; i++) {
        try {
            let response = await fetch(`${api}login.php?name=${name}&password=${password}`);
            let responseData = JSON.parse(await response.text());
            if (responseData.state === false) {
                location.href = "/";
                break;
            } else if (responseData.state === true) {
                for(let i = 0; i < 100; i++) {
                    try {
                        let response2 = await fetch(`${api}permissions.php?name=${name}`);
                        let responseData2 = JSON.parse(await response2.text());
                        if(responseData2["state"] == false) {location.href = "/";}
                        else{
                            return responseData2;
                        }
                    }catch {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
                break;
            }
        }catch {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
            
    }
}


export async function AddSeller(name,type,date){
    try {
        for (let i = 0; i < 100; i++) {
            let response = await fetch(`${api}login.php?name=${name}&password=${password}`);
            let responseData = JSON.parse(await response.text());
            if (responseData.state === false) {
                location.href = "/";
                break;
            } else if (responseData.state === true) {
                for(let i = 0; i < 100; i++) {
                    let response2 = await fetch(`${api}permissions.php?name=${name}`);
                    let responseData2 = JSON.parse(await response2.text());
                    if(responseData2["state"] == false) {location.href = "/";}
                    else{
                        return responseData2;
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (error) {
        alert("خطأ");
        location.href = "/";
    }
}


export class JSFunctions {
    constructor(){}
    async searchByCode(code){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}search_by_code.php?name=${name}&password=${password}&serial=${code}`);
                let responseData = JSON.parse(await response.text());   
                if (responseData.state === false) {
                    alert("خطأ");
                    location.href = "/";
                } else if (responseData.state === "Not found") {
                    return responseData
                } else {
                    return responseData
                }
            }catch (e){
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
        }
        alert("خطأ")
        location.href = "/";
    }
    async searchByName(productName){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}search_by_name.php?name=${name}&password=${password}&product_name=${productName}`);
                let responseData = JSON.parse(await response.text());   
                if (responseData.state === false) {
                    alert("خطأ");
                    location.href = "/";
                } else if (responseData.state === "Not found") {
                    alert("عنصر غير موجود");
                    return {"state": "Not found"}
                } else {
                    return responseData
                }
            }catch{
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        alert("خطأ");
        location.href = "/";
    }
    async editCategoryPrice (productName,price,customerPrice,gurantee,client,date){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}edit_category_price.php?name=${name}&password=${password}&product_name=${productName}&price=${price}&customer_price=${customerPrice}&gurantee=${gurantee}&client=${client}&date=${date}`);
                let responseData = JSON.parse(await response.text());   
                if (responseData.state === false) {
                    alert("خطأ");
                    location.href = "/";
                } else if (responseData.state === "Not found") {
                    alert("عنصر غير موجود");
                    return {"state": "Not found"}
                } else {
                    return responseData
                }
            }catch{
                await new Promise(resolve => setTimeout(resolve, 1000));
            }            
        }
        alert("خطأ");
        location.href = "/";
    }
    async editProductPrice (code,price,customerPrice){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}edit_product_price.php?name=${name}&password=${password}&product_code=${code}&price=${price}&customer_price=${customerPrice}`);
                let responseData = JSON.parse(await response.text());   
                if (responseData.state === false) {
                    alert("خطأ");
                    location.href = "/";
                } else if (responseData.state === "Not found") {
                    alert("عنصر غير موجود");
                    return {"state": "Not found"}
                } else {
                    return responseData
                }
            }catch{
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        alert("خطأ");
        location.href = "/";
    }
    async deleteProduct (code,limit){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}del_product.php?name=${name}&password=${password}&product_code=${code}&limit=${limit}`);
                console.log(`${api}del_product.php?name=${name}&password=${password}&product_code=${code}&limit=${limit}`)
                let responseData = JSON.parse(await response.text());   
                if (responseData.state === false) {
                    alert("خطأ");
                    location.href = "/";
                } else if (responseData.state === "Not found") {
                    alert("عنصر غير موجود");
                    return {"state": "Not found"}
                } else {
                    return responseData
                }
            }catch{
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        alert("خطأ");
        location.href = "/";
    }
    async addProduct (products){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}add_product.php?name=${name}&password=${password}&products=${products}`);
                let responseData = JSON.parse(await response.text());   
                if (!responseData.state) {
                    alert("خطأ");
                    location.href = "/"
                } else if (responseData.state) {
                    alert("تم الإضافة بنجاح");
                    return 1;
                }
            }catch{
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        alert("خطأ");
        location.href = "/";
    }

    async finishCustomerSell(data){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}finish_customer_sell.php?name=${name}&password=${password}&data=${data}`);
                let responseData = JSON.parse(await response.text());   
                return responseData;
            }catch{
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        alert("خطأ");
        location.href = "/";
    }
    async invoiceSearchByName(invoice_name){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}invoice_search_by_name.php?name=${name}&password=${password}&invoice_name=${invoice_name}`);
                let responseData = JSON.parse(await response.text());   
                return responseData;
            }catch{
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        alert("خطأ");
        location.href = "/";
    }
    async invoiceSearchByCode(invoice_code){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");

        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}invoice_search_by_code.php?name=${name}&password=${password}&invoice_code=${invoice_code}`);
                let responseData = JSON.parse(await response.text());   
                return responseData;
            }catch{
                await new Promise(resolve => setTimeout(resolve, 1000));
            }           
        }  
        alert("خطأ");
        location.href = "/";

    }

    async invoiceSearchByDate(date){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}invoice_search_by_date.php?name=${name}&password=${password}&date=${date}`);
                let responseData = JSON.parse(await response.text());  
                console.log(responseData.state)
                return responseData;
            }catch(e){
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }  
        alert("خطأ");
        location.href = "/";
    }
    async returnsSearch(date){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}returns_search_date.php?name=${name}&password=${password}&date=${date}`);
                let responseData = JSON.parse(await response.text());    
                return responseData;
            }catch(e){
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }  
        alert("خطأ");
        location.href = "/";
    }
    async addReturn(data){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}add_return.php?name=${name}&password=${password}&data=${JSON.stringify(data)}`);
                let responseData = JSON.parse(await response.text());
                return responseData;
            }catch(e){
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }  
        alert("خطأ");
        location.href = "/";
    }
    async expenseSearch(date){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}expense_search_date.php?name=${name}&password=${password}&date=${date}`);
                let responseData = JSON.parse(await response.text());   
                return responseData;
            }catch(e){
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }  
        alert("خطأ");
        location.href = "/";
    }
    async addExpense(data){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}add_expense.php?name=${name}&password=${password}&data=${JSON.stringify(data)}`);
                let responseData = JSON.parse(await response.text());
                return responseData;
            }catch(e){
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }  
        alert("خطأ");
        location.href = "/";
    }
    async getEmployees(){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}get_employees.php?name=${name}&password=${password}`);
                let responseData = JSON.parse(await response.text());
                return responseData;
            }catch(e){
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        alert("خطأ");
        location.href = "/";
    }
    async editEmployeeData(data){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}update_employee_data.php?name=${name}&password=${password}&data=${data}`);
                let responseData = JSON.parse(await response.text());   
                return responseData;
            }catch(e){
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        alert("خطأ");
        location.href = "/";
    }
    async giveSalary(data){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}give_salary.php?name=${name}&password=${password}&data=${JSON.stringify(data)}`);
                let responseData = JSON.parse(await response.text());
                return responseData;   
            }catch(e){
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }  
        alert("خطأ");
        location.href = "/";
    }
    async createMonthlyReport(data){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}create_report.php?name=${name}&password=${password}&data=${JSON.stringify(data)}&type=0`);
                let responseData = JSON.parse(await response.text());   
                return responseData;
            }catch(e){
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        alert("خطأ");
        location.href = "/";
    }
    async createYearlyReport(data){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 1; i++) {
            try {
                let response = await fetch(`${api}create_report.php?name=${name}&password=${password}&data=${JSON.stringify(data)}&type=1`);
                let responseData = JSON.parse(await response.text());   
                return responseData;
            }catch(e){
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        alert("خطأ");
        location.href = "/";
    }
    async createCustomReport(data){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            try {
                let response = await fetch(`${api}create_report.php?name=${name}&password=${password}&data=${JSON.stringify(data)}&type=2`);
                let responseData = JSON.parse(await response.text());   
                return responseData;
            }catch(e){
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        alert("خطأ");
        location.href = "/";
    }
}

