(() => {
  const scrollKey = "portfolioReturnScroll";
  const restoreKey = "portfolioShouldRestoreScroll";

  const saveReturnPosition = () => {
    sessionStorage.setItem(scrollKey, String(window.scrollY));
  };

  const restoreReturnPosition = () => {
    if (sessionStorage.getItem(restoreKey) !== "true") {
      return;
    }

    const savedScrollText = sessionStorage.getItem(scrollKey);
    sessionStorage.removeItem(restoreKey);

    if (savedScrollText === null) {
      return;
    }

    const savedScroll = Number(savedScrollText);

    if (!Number.isFinite(savedScroll)) {
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo(0, savedScroll);
    });
  };

  const setupWorkCards = () => {
    document.querySelectorAll('a.card[href^="work"]').forEach((link) => {
      link.addEventListener("click", saveReturnPosition);
    });
  };

  const setupBackLink = () => {
    const backLink = document.querySelector(".back-link");

    if (!backLink) {
      return;
    }

    backLink.addEventListener("click", (event) => {
      event.preventDefault();
      sessionStorage.setItem(restoreKey, "true");

      if (document.referrer.endsWith("index.html") || document.referrer.includes("index.html#")) {
        history.back();
        return;
      }

      window.location.href = "index.html#works";
    });
  };

  const setupScrollAnimations = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        let delay = 0;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const d = delay;
            setTimeout(() => {
              entry.target.classList.add("is-visible");
            }, d);
            delay += 80;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document
      .querySelectorAll(".card, .skill-card, .detail-section")
      .forEach((el) => {
        el.classList.add("fade-up");
        observer.observe(el);
      });
  };

  window.addEventListener("pageshow", restoreReturnPosition);
  document.addEventListener("DOMContentLoaded", () => {
    setupWorkCards();
    setupBackLink();
    setupScrollAnimations();
  });
})();
