document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("updateInfoModal");
    const closeModal = document.getElementById("closeModal");

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });
});
