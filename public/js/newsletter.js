// Функція для відображення повідомлення та закриття вікна
function showMessageAndClose(message) {
  const messageDiv = document.getElementById("message");
  messageDiv.innerText = message;
  messageDiv.style.display = "block";
}

// Чекаємо на завершення завантаження сторінки
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const message = urlParams.get("message");
  if (message) {
    showMessageAndClose(message);
  }
};
