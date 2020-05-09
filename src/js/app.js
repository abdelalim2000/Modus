$(document).ready(() => {
  $(window).scroll(() => {
    if ($(window).scrollTop() > 30) {
      $("header").addClass("scroll");
      $(".nav-link").addClass("changed");
      $(".logo").addClass("changed");
    } else {
      $("header").removeClass("scroll");
      $(".nav-link").removeClass("changed");
      $(".logo").removeClass("changed");
    }
  });
});
