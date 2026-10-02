const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("is-open");
}
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  navLinks.classList.toggle("is-open", !expanded);
});
navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-nav")) closeMenu();
});
window.matchMedia("(min-width: 1001px)").addEventListener("change", closeMenu);

const toast = document.querySelector(".toast");
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 4200);
}
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(button.dataset.copy);
      showToast("Chinese address copied. You can share it with your driver.");
    } catch {
      // The address remains available even in non-secure browser contexts.
      showToast(`Address: ${button.dataset.copy}`);
    }
  });
});

if ("IntersectionObserver" in window) {
  const sectionLinks = [...navLinks.querySelectorAll("a")];
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        sectionLinks.forEach((link) => {
          if (link.hash === `#${entry.target.id}`)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    },
    { rootMargin: "-20% 0px -60% 0px" },
  );
  document
    .querySelectorAll("main section[id], .hero")
    .forEach((section) => observer.observe(section));
}
