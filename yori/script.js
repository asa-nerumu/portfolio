const filters = document.querySelectorAll(".filter");
const works = document.querySelectorAll(".work");
const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxClose = lightbox.querySelector(".lightbox__close");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const selected = filter.dataset.filter;

    filters.forEach((item) => item.classList.remove("is-active"));
    filter.classList.add("is-active");

    works.forEach((work) => {
      const visible = selected === "all" || work.dataset.category === selected;
      work.classList.toggle("is-hidden", !visible);
    });
  });
});

works.forEach((work) => {
  work.addEventListener("click", () => {
    const image = work.querySelector("img");
    lightboxImage.src = work.dataset.full;
    lightboxImage.alt = image.alt;
    lightbox.showModal();
  });
});

lightboxClose.addEventListener("click", () => {
  lightbox.close();
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});
