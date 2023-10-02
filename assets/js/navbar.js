const navlinks = document.getElementById("navlinks");
const menuButton = document.getElementById("menu");
const closeMenuButton = document.getElementById("close-nav");
const backdrop = document.createElement("div");
let toggle = [false];
function showBackdrop() {
  backdrop.classList.add("backdrop");
  document.body.appendChild(backdrop);
  backdrop.addEventListener("click", HideBackdrop);
}
function HideBackdrop() {
  const backdrop = document.querySelector(".backdrop");
  if (backdrop) {
    backdrop.remove();
    showNavigation();
  }
}
const showNavigation = () => {
  let toggleState = () => !toggle[0];
  if (toggleState()) {
    menuButton.innerHTML = `<i class="bx bx-x bx-md"></i>`;
    showBackdrop();
    navlinks.classList.remove("hidden");
    navlinks.classList.add("visible");
  } else {
    menuButton.innerHTML = `<i class="bx bx-menu-alt-right bx-md"></i>`;
    navlinks.classList.remove("visible");
    navlinks.classList.add("hidden");
    backdrop.remove();
  }
  toggle[0] = toggleState();
};
menuButton.addEventListener("click", showNavigation);
