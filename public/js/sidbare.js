document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector(
    "[data-drawer-toggle='separator-sidebar']"
  );
  const sidebar = document.getElementById("separator-sidebar");

  toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
  });
});
