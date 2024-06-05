document
  .getElementById("photo-upload-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const profilePicture = document.querySelector(".profile-picture img");
        profilePicture.src = result.new_profile_photo;

        // to display a success message
        Swal.fire({
          icon: "success",
          title: "Photo uploaded successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error uploading photo",
          text: result.message,
        });
      }
    } catch (error) {
      // Handle fetch error
      Swal.fire({
        icon: "error",
        title: "Error uploading photo",
        text: "An unexpected error occurred. Please try again later.",
      });
    }
  });

document
  .getElementById("create-newsletter-button")
  .addEventListener("click", function () {
    // Розмір вікна
    var width = 620;
    var height = 420;

    // Позиція вікна по середині
    var left = window.innerWidth / 2 - width / 2;
    var top = window.innerHeight / 2 - height / 2;

    // Відкриття нового вікна зі сторінкою "newsletter.hbs"
    var newWindow = window.open(
      "/newsletter",
      "_blank",
      "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top
    );
    if (newWindow) {
      newWindow.focus();
    } else {
      alert("Popup blocked! Please allow popups for this site.");
    }
  });
