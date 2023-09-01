
export let api = "http://192.168.1.2/puzzle-tech/";

export async function Login(){
    let name = localStorage.getItem("name");
    let password = localStorage.getItem("password");
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


export class WareHouseFunctions {
    constructor(){}
    async searchByCode(code){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            let response = await fetch(`${api}search_by_code.php?name=${name}&password=${password}&serial=${code}`);
            try {
                let responseData = JSON.parse(await response.text());   
                if (responseData.state === false) {
                    alert("خطأ");
                    location.href = "/";
                    break;
                } else if (responseData.state === "Not found") {
                    alert("عنصر غير موجود");
                    break;
                } else {
                    return responseData
                }
            }catch{
                alert("خطأ");
                location.href = "/";
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return code;
    }
    async searchByName(productName){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            let response = await fetch(`${api}search_by_name.php?name=${name}&password=${password}&product_name=${productName}`);
            try {
                let responseData = JSON.parse(await response.text());   
                if (responseData.state === false) {
                    alert("خطأ");
                    location.href = "/";
                    break;
                } else if (responseData.state === "Not found") {
                    alert("عنصر غير موجود");
                    return {"state": "Not found"}
                    break;
                } else {
                    return responseData
                }
            }catch{
                alert("خطأ");
                location.href = "/";
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    async editCategoryPrice (productName,price,customerPrice,gurantee,client,date){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            let response = await fetch(`${api}edit_category_price.php?name=${name}&password=${password}&product_name=${productName}&price=${price}&customer_price=${customerPrice}&gurantee=${gurantee}&client=${client}&date=${date}`);
            console.log(`${api}edit_category_price.php?name=${name}&password=${password}&product_name=${productName}&price=${price}&customer_price=${customerPrice}&gurantee=${gurantee}&client=${client}&date=${date}`)
            try {
                let responseData = JSON.parse(await response.text());   
                if (responseData.state === false) {
                    alert("خطأ");
                    location.href = "/";
                    break;
                } else if (responseData.state === "Not found") {
                    alert("عنصر غير موجود");
                    return {"state": "Not found"}
                } else {
                    return responseData
                }
            }catch{
                alert("خطأ");
                location.href = "/";
            }            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    async editProductPrice (code,price,customerPrice){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            let response = await fetch(`${api}edit_product_price.php?name=${name}&password=${password}&product_code=${code}&price=${price}&customer_price=${customerPrice}`);
            try {
                let responseData = JSON.parse(await response.text());   
                if (responseData.state === false) {
                    alert("خطأ");
                    location.href = "/";
                    break;
                } else if (responseData.state === "Not found") {
                    alert("عنصر غير موجود");
                    return {"state": "Not found"}
                } else {
                    return responseData
                }
            }catch{
                alert("خطأ");
                location.href = "/";
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    async deleteProduct (code,limit){
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            let response = await fetch(`${api}del_product.php?name=${name}&password=${password}&product_code=${code}&limit=${limit}`);
            try {
                let responseData = JSON.parse(await response.text());   
                if (responseData.state === false) {
                    alert("خطأ");
                    location.href = "/";
                    break;
                } else if (responseData.state === "Not found") {
                    alert("عنصر غير موجود");
                    return {"state": "Not found"}
                } else {
                    return responseData
                }
            }catch{
                alert("خطأ");
                location.href = "/";
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    async addProduct (products){
        console.log(products)
        let name = localStorage.getItem("name");
        let password = localStorage.getItem("password");
        for (let i = 0; i < 100; i++) {
            let response = await fetch(`${api}add_product.php?name=${name}&password=${password}&products=${products}`);
            console.log(`${api}add_product.php?name=${name}&password=${password}&product=${products}`);
            try {
                let responseData = JSON.parse(await response.text());   
                console.log(responseData)
                if (responseData.state === false) {
                    alert("خطأ");
                    // location.href = "/";
                    break;
                } else if (responseData.state === true) {
                    alert("تم الإضافة بنجاح");
                    break;
                }
            }catch{
                alert("خطأ");
                // location.href = "/";
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}