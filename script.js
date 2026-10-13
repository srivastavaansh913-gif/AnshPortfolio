document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MOBILE NAVIGATION
    ========================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
        });

        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
            });

        });

    }


    /* =========================
       SCROLL REVEAL
    ========================= */

    const revealElements =
        document.querySelectorAll(".reveal");

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* =========================
       CURRENT YEAR
    ========================= */

    const yearElements =
        document.querySelectorAll("[data-current-year]");

    yearElements.forEach(element => {
        element.textContent =
            new Date().getFullYear();
    });


    /* =========================
       NAVBAR SCROLL
    ========================= */

    const navbar =
        document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (!navbar) return;

        if (window.scrollY > 30) {

            navbar.style.background =
                "rgba(5,6,10,.92)";

        } else {

            navbar.style.background =
                "rgba(5,6,10,.72)";

        }

    });


    /* =========================
       PROFILE PARALLAX
    ========================= */

    const profile =
        document.querySelector(".hero-profile");

    if (profile && window.innerWidth > 900) {

        document.addEventListener("mousemove", event => {

            const x =
                (event.clientX / window.innerWidth - .5) * 10;

            const y =
                (event.clientY / window.innerHeight - .5) * 10;

            profile.style.transform =
                `translate(${x}px, ${y}px)`;

        });

    }


    /* =========================
       CARD GLOW EFFECT
    ========================= */

    const cards =
        document.querySelectorAll(".glass-card");

    cards.forEach(card => {

        card.addEventListener("mousemove", event => {

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            card.style.background =
                `radial-gradient(
                    circle at ${x}px ${y}px,
                    rgba(139,92,246,.10),
                    rgba(255,255,255,.04) 45%
                )`;

        });

        card.addEventListener("mouseleave", () => {

            card.style.background =
                "rgba(255,255,255,.045)";

        });

    });


    /* =========================
       CONTACT FORM
    ========================= */

    const contactForm =
        document.querySelector(".contact-form");

    if (contactForm) {

        contactForm.addEventListener("submit", event => {

            event.preventDefault();

            const button =
                contactForm.querySelector("button");

            if (button) {

                const original =
                    button.innerHTML;

                button.innerHTML =
                    "Message Ready ✓";

                button.style.opacity = ".7";

                setTimeout(() => {

                    button.innerHTML =
                        original;

                    button.style.opacity =
                        "1";

                    contactForm.reset();

                }, 2500);

            }

        });

    }


    /* =========================
       CERTIFICATE CLICK
    ========================= */

    const certificateImages =
        document.querySelectorAll(".certificate-image img");

    certificateImages.forEach(image => {

        image.style.cursor = "zoom-in";

        image.addEventListener("click", () => {

            const overlay =
                document.createElement("div");

            overlay.style.position = "fixed";
            overlay.style.inset = "0";
            overlay.style.background =
                "rgba(0,0,0,.92)";
            overlay.style.display = "grid";
            overlay.style.placeItems = "center";
            overlay.style.zIndex = "5000";
            overlay.style.padding = "30px";

            const enlarged =
                document.createElement("img");

            enlarged.src = image.src;

            enlarged.style.maxWidth = "95%";
            enlarged.style.maxHeight = "90vh";
            enlarged.style.objectFit = "contain";
            enlarged.style.borderRadius = "12px";

            overlay.appendChild(enlarged);

            document.body.appendChild(overlay);

            overlay.addEventListener("click", () => {
                overlay.remove();
            });

        });

    });


    /* =========================
       PAGE LOADED
    ========================= */

    document.body.classList.add("page-loaded");

});
// Contact form submit
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("form-status");
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    status.textContent = "Sending...";

    try {
      const data = Object.fromEntries(new FormData(form));
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "message", ...data }),
      });
      if (!res.ok) throw new Error();
      status.textContent = "Message sent! Thanks 🙌";
      form.reset();
    } catch {
      status.textContent = "Something went wrong. Try WhatsApp or Instagram.";
    }
    btn.disabled = false;
  });
}

// Visitor notification (ek session mein sirf ek baar)
if (!sessionStorage.getItem("notified") && !localStorage.getItem("isOwner")) {
  sessionStorage.setItem("notified", "1");
  fetch("/api/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "visit", page: location.pathname }),
  }).catch(() => {});
}