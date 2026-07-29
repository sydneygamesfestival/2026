const menuToggle = document.querySelector(".menu-toggle");
const siteHeader = document.querySelector(".site-header");

if (menuToggle && siteHeader) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}
