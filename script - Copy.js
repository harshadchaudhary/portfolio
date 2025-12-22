document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  document.getElementById("response").innerText = "✅ Thanks, I’ll get back to you soon!";
  this.reset();
});
