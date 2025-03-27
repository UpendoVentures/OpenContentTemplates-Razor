document.addEventListener("DOMContentLoaded", function () {
    var banner = document.getElementById("announcement-bar");
    var closeBtn = document.getElementById("close-announcement");

    if (localStorage.getItem("announcementClosed") !== "true") {
      banner.style.display = "block"; 
      document.body.prepend(banner); 
      document.body.style.paddingTop = banner.offsetHeight + "px"; 
    }

    closeBtn.addEventListener("click", function () {
      banner.style.display = "none"; 
      localStorage.setItem("announcementClosed", "true"); 
      document.body.style.paddingTop = "0"; 
    });
  });