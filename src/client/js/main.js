import "../scss/styles.scss";

document.addEventListener("click", (evt) => {
  const a = evt.target.closest("a");
  if (!a) return;
  if (a.getAttribute("href") !== "#") return;
  evt.preventDefault();
});
