document.addEventListener("DOMContentLoaded", function () {
  const APIKey = "2f6eda8a8af558ce4ff7adf8d766b986";

  const $cardsBox = document.getElementById("cards-box");
  const $locationForm = document.getElementById("location-form");
  const $locationInput = document.getElementById("location-form_input");
  const $body = document.getElementById("body");
  let currentCard = null;

  async function getWeatherData(location) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}&units=metric`
    );

    const data = await response.json();

    return data;
  }

  function getNewCard() {
    const $card = document.createElement("div");
    $card.classList.add("card");

    $card.innerHTML = `
        <div class="card">
            <div class="card_inner">
              <!-- upper part of card -->
              <div class="card_head">
                <div class="card_head-left">
                  <div class="card-icon"></div>
                  <div class="card_head-left-title">
                    <h3 class="card_title"> </h3>
                    <span class="card_desc"></span>
                  </div>
                </div>

                <div class="card_head-right card-param">
                  <svg
                    class="card-param_icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 15.9998C7.44772 15.9998 7 16.4475 7 16.9998C7 17.5521 7.44772 17.9998 8 17.9998C8.55228 17.9998 9 17.5521 9 16.9998C9 16.4475 8.55228 15.9998 8 15.9998ZM8 15.9998V6M8 16.9998L8.00707 17.0069M20 5C20 6.10457 19.1046 7 18 7C16.8954 7 16 6.10457 16 5C16 3.89543 16.8954 3 18 3C19.1046 3 20 3.89543 20 5ZM12 16.9998C12 19.209 10.2091 20.9998 8 20.9998C5.79086 20.9998 4 19.209 4 16.9998C4 15.9854 4.37764 15.0591 5 14.354L5 6C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6V14.354C11.6224 15.0591 12 15.9854 12 16.9998Z"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>

                  <span class="card-param_text">
                    <span class="card-param-value card-param-value_temp"
                      ></span
                    >
                    <sup>0</sup>C
                  </span>
                </div>
              </div>

              <!-- lower part of card -->
              <div class="card_footer">
                <div class="card_footer-left card-param">
                  <svg
                    class="card-param_icon card-param-icon_footer"
                    fill="#000000"
                    width="800px"
                    height="800px"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M55.9775,24.2549A12.0171,12.0171,0,0,0,44,13a12.1822,12.1822,0,0,0-1.68.1162,14.9911,14.9911,0,0,0-27.458,1.8848A8.0093,8.0093,0,0,0,7,23a7.7816,7.7816,0,0,0,.0537.916A9.0645,9.0645,0,0,0,2,32a8.8714,8.8714,0,0,0,1.2188,4.5078A.9986.9986,0,0,0,4.08,37H59.74a.9993.9993,0,0,0,.8194-.4268A7.9408,7.9408,0,0,0,62,32,8.0292,8.0292,0,0,0,55.9775,24.2549Z" />

                    <path
                      d="M12.7725,44.0225,13,45l-.3066-.9521a.9608.9608,0,0,0-.6016,1.24,1.0406,1.0406,0,0,0,1.2959.6367.9407.9407,0,0,1,1.1953.6563.9039.9039,0,0,1-.5332,1.23,3.0783,3.0783,0,0,1-1.7832.1035A3.0031,3.0031,0,0,1,13,42H37a1,1,0,0,0,0-2H13a5.0027,5.0027,0,0,0-1.1855,9.8633,5.2691,5.2691,0,0,0,1.1845.1357,4.987,4.987,0,0,0,1.752-.3144,3.002,3.002,0,0,0-1.9785-5.6621Z" />

                    <path
                      d="M35.9639,51H26.0361a4.0014,4.0014,0,0,0-.9472,7.89,4.1685,4.1685,0,0,0,.9463.11,3.98,3.98,0,0,0,1.4-.2529,2.5013,2.5013,0,0,0-1.624-4.7256c-.0127.0039-.0918.0293-.1035.0342a.97.97,0,0,0-.5879,1.247,1.0269,1.0269,0,0,0,1.2813.63.4437.4437,0,0,1,.5849.334.4271.4271,0,0,1-.2509.6074,2.0692,2.0692,0,0,1-1.1934.0684,1.9757,1.9757,0,0,1-1.45-1.4561A2.0051,2.0051,0,0,1,26.0361,53h9.9278a1,1,0,0,0,0-2Z" />

                    <path
                      d="M51,45H25a1,1,0,0,0,0,2H51a3.0024,3.0024,0,0,1,.7344,5.9141,3.09,3.09,0,0,1-1.7842-.1026.9039.9039,0,0,1-.5332-1.23.9272.9272,0,0,1,1.1777-.6622l.0987.0332a1,1,0,0,0,.6132-1.9042l-.0966-.0313a3.0024,3.0024,0,0,0-1.961,5.668,4.9992,4.9992,0,0,0,1.752.3144,5.2222,5.2222,0,0,0,1.1855-.1367,4.9507,4.9507,0,0,0,3.68-3.6924A5.0068,5.0068,0,0,0,51,45Z" />
                  </svg>

                  <span class="card-param-text_footer">
                    <span class="card-param-value card-param-value_wind"
                      ></span
                    >
                    meter/sec</span
                  >
                </div>

                <div class="card_footer-right card-param">
                  <svg
                    class="card-param_icon card-param-icon_footer"
                    width="800px"
                    height="800px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.5 5.5L3.11612 6.11612C3.68206 6.68206 4.44964 7 5.25 7C6.05036 7 6.81794 6.68206 7.38388 6.11612L7.61612 5.88388C8.18206 5.31794 8.94964 5 9.75 5C10.5504 5 11.3179 5.31794 11.8839 5.88388L12.1161 6.11612C12.6821 6.68206 13.4496 7 14.25 7C15.0504 7 15.8179 6.68206 16.3839 6.11612L16.6161 5.88388C17.1821 5.31794 17.9496 5 18.75 5C19.5504 5 20.3179 5.31794 20.8839 5.88388L21.5 6.5M2.5 11.5L3.11612 12.1161C3.68206 12.6821 4.44964 13 5.25 13C6.05036 13 6.81794 12.6821 7.38388 12.1161L7.61612 11.8839C8.18206 11.3179 8.94964 11 9.75 11C10.5504 11 11.3179 11.3179 11.8839 11.8839L12.1161 12.1161C12.6821 12.6821 13.4496 13 14.25 13C15.0504 13 15.8179 12.6821 16.3839 12.1161L16.6161 11.8839C17.1821 11.3179 17.9496 11 18.75 11C19.5504 11 20.3179 11.3179 20.8839 11.8839L21.5 12.5M2.5 17.5L3.11612 18.1161C3.68206 18.6821 4.44964 19 5.25 19C6.05036 19 6.81794 18.6821 7.38388 18.1161L7.61612 17.8839C8.18206 17.3179 8.94964 17 9.75 17C10.5504 17 11.3179 17.3179 11.8839 17.8839L12.1161 18.1161C12.6821 18.6821 13.4496 19 14.25 19C15.0504 19 15.8179 18.6821 16.3839 18.1161L16.6161 17.8839C17.1821 17.3179 17.9496 17 18.75 17C19.5504 17 20.3179 17.3179 20.8839 17.8839L21.5 18.5"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  <span class="card-param-text_footer">
                    <span class="card-param-value card-param-value_water">
                      </span
                    >%</span
                  >
                </div>
              </div>
            </div>
          </div>
    `;

    return {
      $card: $card.querySelector(".card"),
      $icon: $card.querySelector(".card-icon"),
      $title: $card.querySelector(".card_title"),
      $temp: $card.querySelector(".card-param-value_temp"),
      $desc: $card.querySelector(".card_desc"),
      $wind: $card.querySelector(".card-param-value_wind"),
      $water: $card.querySelector(".card-param-value_water"),
    };
  }

  async function getAndDisplayWeather(location) {
    const newCard = getNewCard();

    $cardsBox.prepend(newCard.$card);

    const $existingCards = document.querySelectorAll(".card");
    if ($existingCards.length > 5) {
      $existingCards[$existingCards.length - 1].remove();
    }

    newCard.$card.classList.add("loading");

    const data = await getWeatherData(location);

    newCard.$icon.style.backgroundImage = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
    newCard.$title.textContent = data.name;
    newCard.$desc.textContent = data.weather[0].description;
    newCard.$temp.textContent = data.main.temp;
    newCard.$wind.textContent = data.wind.speed;
    newCard.$water.textContent = data.main.humidity;

    console.log(data);
    setTimeout(function () {
      document
        .querySelector(".app_container")
        .classList.add("app_container_top");
      $body.style.backgroundImage = `url(img/${data.weather[0].icon}.jpg)`;

      if (currentCard !== null) {
        // currentCard.$card.classList.remove("full")
        currentCard.$card.classList.add("glass");
      }

      currentCard = newCard;

      newCard.$card.classList.remove("loading");
      newCard.$card.classList.add("full");
    }, 600);
  }

  $locationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const location = $locationInput.value.trim();
    $locationInput.value = "";

    getAndDisplayWeather(location);
  });

  window.addEventListener("load", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKey}&units=metric`
        );
        const data = await response.json();
        const location = data.name;
        getAndDisplayWeather(location);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  });

  // Отримуємо кнопку
  var btn_reg = document.getElementsByClassName("btn_reg")[0];
  var btn_logIn = document.getElementsByClassName("btn_logIn")[0];

  // Отримуємо модальне вікно для створення облікового запису
  var modalAc = document.getElementById("modal_acount");

  // Отримуємо модальне вікно для входу
  var modalLog = document.getElementById("modal_logIn");

  // Отримуємо елемент закриття модального вікна
  var closeAc = document.getElementsByClassName("close")[0];
  var closeLog = document.getElementsByClassName("close")[1];

  // Показуємо модальне вікно при натисканні на кнопку створення облікового запису
  btn_reg.onclick = function () {
    modalAc.style.display = "block";
  };

  // Показуємо модальне вікно при натисканні на кнопку входу
  btn_logIn.onclick = function () {
    modalLog.style.display = "block";
  };

  // Приховуємо модальне вікно при натисканні на хрестик
  closeAc.onclick = function () {
    modalAc.style.display = "none";
  };
  closeLog.onclick = function () {
    modalLog.style.display = "none";
  };

  // Приховуємо модальне вікно при натисканні за межами вікна
  window.onclick = function (event) {
    if (event.target == modalAc) {
      modalAc.style.display = "none";
    }
    if (event.target == modalLog) {
      modalLog.style.display = "none";
    }
  };

  var btnCreateAcount = document.querySelector(".btn_create_ac");
  var btnLogInAcount = document.querySelector(".btn_logIn_ac");
  var modalAc = document.getElementById("modal_acount");
  var modalLog = document.getElementById("modal_logIn");

  btnCreateAcount.addEventListener("click", function () {
    console.log("Create account button clicked!");
    validateInputsAndReplaceButtons();
  });

  btnLogInAcount.addEventListener("click", function () {
    console.log("Log in button clicked!");
    modalAc.style.display = "none";
    modalLog.style.display = "none";
  });

  function validateInputsAndReplaceButtons() {
    var usernameInput = document.getElementById("modal_acount-input_username");
    var emailInput = document.getElementById("modal_acount-input_email");
    var passwordInput = document.getElementById("modal_acount-input_password");

    var usernameValidationMessage = document.getElementById(
      "username-validation-message"
    );
    var emailValidationMessage = document.getElementById(
      "email-validation-message"
    );
    var passwordValidationMessage = document.getElementById(
      "password-validation-message"
    );

    var usernamePattern = /^[a-zA-Z0-9_-]{3,16}$/;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    var isUsernameValid = usernamePattern.test(usernameInput.value);
    var isEmailValid = emailPattern.test(emailInput.value);
    var isPasswordValid = passwordPattern.test(passwordInput.value);

    if (!isUsernameValid) {
      usernameValidationMessage.innerHTML =
        "Wrong username. Only letters, numbers, dashes (-), and underscores (_) are allowed.";
      usernameValidationMessage.style.display = "block";
    } else {
      usernameValidationMessage.innerHTML = "";
      usernameValidationMessage.style.display = "none";
    }

    if (!isEmailValid) {
      emailValidationMessage.innerHTML = "Incorrect email format.";
      emailValidationMessage.style.display = "block";
    } else {
      emailValidationMessage.innerHTML = "";
      emailValidationMessage.style.display = "none";
    }

    if (!isPasswordValid) {
      passwordValidationMessage.innerHTML =
        "Incorrect password. Your password must contain at least one letter and one number and be at least 8 characters long.";
      passwordValidationMessage.style.display = "block";
    } else {
      passwordValidationMessage.innerHTML = "";
      passwordValidationMessage.style.display = "none";
    }

    if (isUsernameValid && isEmailValid && isPasswordValid) {
      modalAc.style.display = "none";
      modalLog.style.display = "none";
      window.location.href = "/user";
    }
  }
});
