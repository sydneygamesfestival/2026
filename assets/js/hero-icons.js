const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion) {
  document.querySelectorAll("[data-hero-icons]").forEach((hero) => {
    const iconUrls = hero.dataset.heroIcons.split("|");

    hero.querySelectorAll("[data-hero-icon]").forEach((icon, position) => {
      let iconIndex = Number(icon.dataset.iconIndex);
      const changeDelay = 900 + (position * 80);

      window.setInterval(() => {
        icon.classList.add("is-changing");

        window.setTimeout(() => {
          iconIndex = (iconIndex + 1) % iconUrls.length;
          icon.src = iconUrls[iconIndex];
          icon.classList.remove("is-changing");
        }, 180);
      }, changeDelay);
    });
  });
}
