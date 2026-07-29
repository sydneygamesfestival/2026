const menuToggle = document.querySelector(".menu-toggle");
const siteHeader = document.querySelector(".site-header");

if (menuToggle && siteHeader) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function openLinkedFaq() {
  if (!window.location.hash) return;

  const faqId = decodeURIComponent(window.location.hash.slice(1));
  const faq = document.getElementById(faqId);

  if (faq instanceof HTMLDetailsElement && faq.classList.contains("faq-entry")) {
    faq.open = true;
  }
}

openLinkedFaq();
window.addEventListener("hashchange", openLinkedFaq);
