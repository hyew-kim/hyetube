import "regenerator-runtime";
import "../scss/main.scss";

const menuBtn = document.querySelector("a.menu");
const gnb = document.querySelector("#gnb");

document.addEventListener("click", (evt) => {
  const a = evt.target.closest("a");
  if (!a) return false;
  if (a.getAttribute("href") !== "#") return false;
  evt.preventDefault();
});

const handleMenuBtn = function () {
  menuBtn.classList.toggle("close");
  gnb.classList.toggle("close");
};
menuBtn.addEventListener("click", handleMenuBtn);
