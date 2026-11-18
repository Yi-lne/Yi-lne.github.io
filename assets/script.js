(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* reveal on scroll */
  const revealEls = [...document.querySelectorAll("[data-reveal]")];
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* nav active state */
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((a) =>
            a.classList.toggle("is-active", a.getAttribute("href") === id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  /* image viewer */
  const allThumbs = [...document.querySelectorAll(".thumb")];
  const dialog = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCount = document.getElementById("lightbox-count");
  const lightboxOpen = document.getElementById("lightbox-open");
  const closeBtn = dialog ? dialog.querySelector(".lightbox-close") : null;
  const prevBtn = dialog ? dialog.querySelector(".lightbox-prev") : null;
  const nextBtn = dialog ? dialog.querySelector(".lightbox-next") : null;
  let lightboxIndex = 0;

  function showImage(index) {
    if (!allThumbs.length) return;
    lightboxIndex = (index + allThumbs.length) % allThumbs.length;
    const thumb = allThumbs[lightboxIndex];
    lightboxImg.src = thumb.dataset.src;
    lightboxImg.alt = thumb.dataset.alt || "";
    lightboxCaption.textContent = [thumb.dataset.label, thumb.dataset.caption]
      .filter(Boolean)
      .join(" — ");
    lightboxCount.textContent = `${lightboxIndex + 1} / ${allThumbs.length}`;
    if (lightboxOpen) lightboxOpen.href = thumb.dataset.src;
  }

  function openLightboxFor(thumb) {
    if (!dialog) return;
    const index = allThumbs.indexOf(thumb);
    showImage(index >= 0 ? index : 0);
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    if (!dialog) return;
    if (dialog.open) dialog.close();
    else dialog.removeAttribute("open");
    document.body.classList.remove("lightbox-open");
  }

  if (dialog) {
    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", () => showImage(lightboxIndex - 1));
    nextBtn.addEventListener("click", () => showImage(lightboxIndex + 1));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeLightbox();
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("lightbox-open");
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showImage(lightboxIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showImage(lightboxIndex + 1);
      }
    });
  }

  document.querySelectorAll("[data-viewer]").forEach((viewer) => {
    const stage = viewer.querySelector(".stage");
    const stageImg = viewer.querySelector(".stage-img");
    const stageLabel = viewer.querySelector(".stage-label");
    const stageCaption = viewer.querySelector(".stage-caption");
    const thumbs = [...viewer.querySelectorAll(".thumb")];

    const activate = (thumb) => {
      thumbs.forEach((item) => {
        const isActive = item === thumb;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      stageImg.src = thumb.dataset.src;
      stageImg.alt = thumb.dataset.alt || "";
      stageLabel.textContent = thumb.dataset.label || "";
      stageCaption.textContent = thumb.dataset.caption || "";
    };

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => activate(thumb));
    });

    const initial = thumbs.find((thumb) => thumb.classList.contains("is-active")) || thumbs[0];
    if (initial) activate(initial);

    if (stage) {
      stage.tabIndex = 0;
      stage.setAttribute("role", "button");
      stage.setAttribute("aria-label", "放大查看当前图片");
      stage.addEventListener("click", () => {
        const current =
          thumbs.find((thumb) => thumb.classList.contains("is-active")) || thumbs[0];
        if (current) openLightboxFor(current);
      });
      stage.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        const current =
          thumbs.find((thumb) => thumb.classList.contains("is-active")) || thumbs[0];
        if (current) openLightboxFor(current);
      });
    }
  });
})();
