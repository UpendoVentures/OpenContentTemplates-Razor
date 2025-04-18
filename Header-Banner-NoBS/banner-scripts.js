document.addEventListener("DOMContentLoaded", function () {
  var banner = document.getElementById("announcement-bar");
  var closeBtn = document.getElementById("close-announcement");
  var lastScrollTop = 0; 
  var isDismissed = localStorage.getItem("announcementClosed") === "true"; 

  if (!isDismissed) {
    banner.style.display = "block"; 
    document.body.prepend(banner); 
    document.body.style.paddingTop = banner.offsetHeight + "px"; 
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      banner.style.display = "none"; 
      localStorage.setItem("announcementClosed", "true"); 
      document.body.style.paddingTop = "0"; 
    });
  }

  // Scroll-based visibility toggle
  window.addEventListener("scroll", function () {
      if (isDismissed) return;

      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop < 100) {
          // Only show the banner if the user is near the top
          banner.style.transform = "translateY(0)";
      } else {
          // Hide it once scrolling down past the threshold
          banner.style.transform = "translateY(-100%)";
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
});