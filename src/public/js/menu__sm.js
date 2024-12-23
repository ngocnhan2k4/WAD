const menu__img_outner = document.querySelector(".menu__img-outner");
const menu__img_inner = document.querySelector(".menu__img-inner");
const overlay__main = document.querySelector(".overlay__main");
const menu__nav = document.querySelector(".menu__nav");

menu__img_outner.addEventListener("click", () => {
    console.log("click");
    overlay__main.classList.toggle("overlay__main-active");
    menu__nav.classList.toggle("menu__nav-active");
    document.body.style.overflow = "hidden";
});

overlay__main.addEventListener("click", () => {
    overlay__main.classList.remove("overlay__main-active");
    menu__nav.classList.remove("menu__nav-active");
    document.body.style.overflow = "auto";
});

menu__img_inner.addEventListener("click", () => {
    overlay__main.classList.remove("overlay__main-active");
    menu__nav.classList.remove("menu__nav-active");
    document.body.style.overflow = "auto";
});
