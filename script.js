/* Shared behaviour for every page. Safe to load on pages that
   don't have all of these elements — each block checks first. */

// --- Mobile navigation toggle ---
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.innerHTML = open ? "&#10005;" : "&#9776;";
  });
})();

// --- Footer year ---
(function () {
  document.querySelectorAll(".year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

// --- Contact form ---
// Posts to Formspree so messages land in the inbox. Until a real form id is
// set in contact.html, it falls back to opening the visitor's mail client so
// the form is never a dead end.
(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;

  var EMAIL = "chaudharyharshad209@gmail.com";
  var PLACEHOLDER = "YOUR_FORM_ID";

  var status = document.getElementById("response");
  var button = form.querySelector("button[type=submit]");

  function setStatus(text, state) {
    if (!status) return;
    status.textContent = text;
    status.dataset.state = state || "";
  }

  function mailtoFallback(name, from, message) {
    var subject = "Portfolio enquiry from " + name;
    var body = message + "\n\n---\nFrom: " + name + " <" + from + ">";

    window.location.href =
      "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    setStatus("Opening your mail app… if nothing happens, write to " + EMAIL + " directly.", "info");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = document.getElementById("name").value.trim();
    var from = document.getElementById("email").value.trim();
    var message = document.getElementById("message").value.trim();
    var endpoint = form.getAttribute("action") || "";

    // Honeypot: a real person leaves this hidden field empty. Silently accept
    // and drop, so a bot gets no signal that it was caught.
    var trap = form.querySelector("input[name=_gotcha]");
    if (trap && trap.value) {
      setStatus("Thanks — your message has been sent.", "ok");
      form.reset();
      return;
    }

    if (!endpoint || endpoint.indexOf(PLACEHOLDER) !== -1) {
      mailtoFallback(name, from, message);
      return;
    }

    button.disabled = true;
    setStatus("Sending…", "info");

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: name,
        email: from,
        message: message,
        _subject: "Portfolio enquiry from " + name
      })
    })
      .then(function (res) {
        if (res.ok) {
          setStatus("Thanks — your message has been sent. I'll reply soon.", "ok");
          form.reset();
          return;
        }
        return res.json().then(function (body) {
          var detail = body && body.errors && body.errors.length
            ? body.errors.map(function (x) { return x.message; }).join(", ")
            : "the form service rejected the request";
          throw new Error(detail);
        });
      })
      .catch(function () {
        // Never strand the visitor — hand them the mail client instead.
        setStatus(
          "Couldn't send that automatically. Opening your mail app — or write to " + EMAIL + ".",
          "error"
        );
        mailtoFallback(name, from, message);
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();
