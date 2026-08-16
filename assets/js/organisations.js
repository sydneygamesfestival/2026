const organisationCards = Array.from(document.querySelectorAll("[data-organisation-card]"));

function setOrganisationCardOpen(card, open) {
  const trigger = card.querySelector(".organisation-card-trigger");
  const modal = card.querySelector(".organisation-modal");

  if (open) card.classList.remove("is-dismissed");
  card.classList.toggle("is-open", open);
  trigger?.setAttribute("aria-expanded", String(open));
  modal?.setAttribute("aria-hidden", String(!open));
}

function closeOtherOrganisationCards(currentCard) {
  organisationCards.forEach((card) => {
    if (card !== currentCard) setOrganisationCardOpen(card, false);
  });
}

organisationCards.forEach((card) => {
  const trigger = card.querySelector(".organisation-card-trigger");

  card.addEventListener("mouseenter", () => {
    closeOtherOrganisationCards(card);
    setOrganisationCardOpen(card, true);
  });

  card.addEventListener("mouseleave", () => {
    card.classList.remove("is-dismissed");
    if (!card.contains(document.activeElement)) setOrganisationCardOpen(card, false);
  });

  card.addEventListener("focusin", () => {
    closeOtherOrganisationCards(card);
    setOrganisationCardOpen(card, true);
  });

  card.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!card.contains(document.activeElement)) setOrganisationCardOpen(card, false);
    }, 0);
  });

  trigger?.addEventListener("click", () => {
    closeOtherOrganisationCards(card);
    setOrganisationCardOpen(card, true);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setOrganisationCardOpen(card, false);
    card.classList.add("is-dismissed");
    trigger?.focus();
  });
});

document.addEventListener("pointerdown", (event) => {
  organisationCards.forEach((card) => {
    if (!card.contains(event.target)) setOrganisationCardOpen(card, false);
  });
});
