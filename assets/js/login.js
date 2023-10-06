let form = document.querySelector("form");
let username = form.name;
let password = form.password;
let api = "https://192.168.137.1/puzzle-tech/";
let audio = new Audio("./assets/sounds/error.mp3");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (username.value.trim().length == 0 || password.value.trim().length == 0) {
        audio.play();
        alert("يجب إدخال البيانات كاملة");
    } else {
        try {
            let success = false; // To track successful login
            for (let i = 0; i < 100; i++) {
                console.log(`${api}login.php?name=${username.value}&password=${password.value}`)
                let response = await fetch(`${api}login.php?name=${username.value}&password=${password.value}`);
                let responseData = JSON.parse(await response.text());
                if (responseData.state === false) {
                    audio.play();
                    alert("بيانات خاطئة");
                    break;
                } else if (responseData.state === true) {
                    await localStorage.setItem("name",username.value);
                    await  localStorage.setItem("password",password.value)
                    location.href = "/dashboard";
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            alert("خطأ");
        }
    }
});
