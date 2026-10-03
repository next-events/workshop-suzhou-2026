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

// Follow the section just below the sticky navigation, including compact sections.
const sectionLinks = [...navLinks.querySelectorAll("a")];
// Read page order, since the registration action is last in the navigation.
const sections = [...document.querySelectorAll('.conference-content section[id]')];
let navigationFramePending = false;

function updateActiveSection() {
  const readingLine = document.querySelector(".site-nav").getBoundingClientRect().bottom + 36;
  let active = null;
  let activeTop = -Infinity;
  for (const section of sections) {
    const top = section.getBoundingClientRect().top;
    if (top > readingLine) continue;
    if (top > activeTop + 1 || (Math.abs(top - activeTop) <= 1 && location.hash === `#${section.id}`)) {
      active = section;
      activeTop = top;
    }
  }
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    active = sections.at(-1);
  }
  sectionLinks.forEach((link) => {
    if (active && link.hash === `#${active.id}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function scheduleNavigationUpdate() {
  if (navigationFramePending) return;
  navigationFramePending = true;
  requestAnimationFrame(() => {
    navigationFramePending = false;
    updateActiveSection();
  });
}
window.addEventListener("scroll", scheduleNavigationUpdate, { passive: true });
window.addEventListener("resize", scheduleNavigationUpdate);
window.addEventListener("hashchange", scheduleNavigationUpdate);
window.addEventListener("load", scheduleNavigationUpdate);
scheduleNavigationUpdate();
