import "regenerator-runtime";
import "../scss/styles.scss";

document.addEventListener("click", (evt) => {
  const a = evt.target.closest("a");
  if (!a) return false;
  if (a.getAttribute("href") !== "#") return false;
  evt.preventDefault();
});
