document.addEventListener("DOMContentLoaded", function () {
  const imageUploadInput = document.getElementById("image-upload-input");
  const uploadPreview = document.getElementById("upload-preview");
  const uploadButton = document.getElementById("upload-button");

  imageUploadInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        uploadPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  uploadButton.addEventListener("click", function () {
    imageUploadInput.click();
  });
});
