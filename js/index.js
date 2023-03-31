function updateResolution() {
  var win_w = $(window).width();

  var classname = "w1300";
  if (win_w > 1500) {
    classname = "w1900";
  } else if (win_w <= 1500 && win_w > 1040) {
    classname = "w1300";
  } else if (win_w <= 1040 && win_w > 620) {
    classname = "w1000";
  } else {
    classname = "mobile";
  }

  menuAction(true);

  var servNavHeight =
    classname == "mobile" ? 0 : $("#serv-navigation").height();
  var servPagePadding = {
    w1900: 285,
    w1300: 165,
    w1000: 125,
    mobile: 30,
  };

  var servOverlayHeight = servPagePadding[classname] + servNavHeight;

  if (!$("body").hasClass("disabled-onepage-scroll")) {
    $(".page.serv").css("paddingTop", servOverlayHeight);
  } else {
    $(".page.serv").css("paddingTop", 50);
  }

  if (classname == "mobile") {
    $("#serv-overlay").height(70);
  } else {
    $("#serv-overlay").height(servOverlayHeight);
  }

  if ($(window).height() < 600) {
    $(".page").addClass("forsescroll");
  } else {
    $(".page").removeClass("forsescroll");
  }

  if ($("body").hasClass("disabled-onepage-scroll")) {
    mobileScroll();
  }
}

var future_words = [
  "автомобильные дороги",
  "мосты",
  "путепроводы",
  "транспортные развязки",
  "объекты ПГС",
  "транспортные системы",
];
var future_cur = 0;
function animateFuture() {
  future_cur++;
  if (future_cur == future_words.length) future_cur = 0;
  $(".main-dynamic-header span").fadeOut(250, function () {
    var br = "";
    if ($(window).width() < 620) br = "<br>";
    $(".main-dynamic-header span").html(br + future_words[future_cur]);
    $(".main-dynamic-header span").fadeIn(250);
  });
  setTimeout(animateFuture, 1000);
}

var pageIndex = 1;

function mobileScroll(event) {
  var scrollTop = $("body").scrollTop();
  var logoHeight = $("#logo").outerHeight() + parseInt($("#logo").css("top"));
  var firstSlideHeight = $(".page.main").outerHeight();
  $("section.page.main").css(
    "clip-path",
    "inset(" + (scrollTop + logoHeight + 15) + "px 0px 0px)"
  );
  $("section.page.main").css(
    "-webkit-clip-path",
    "inset(" + (scrollTop + logoHeight + 15) + "px 0px 0px)"
  );

  if ($("body").hasClass("disabled-onepage-scroll")) {
    if (scrollTop >= firstSlideHeight - $("#logo").outerHeight()) {
      $("#logo, #navigation, #hamburger")
        .removeClass("white")
        .addClass("black");
      $("#serv-overlay").addClass("visible");
      pageIndex = 2;
    } else {
      $("#logo, #navigation, #hamburger")
        .removeClass("black")
        .addClass("white");
      $("#serv-overlay").removeClass("visible");
      pageIndex = 1;
    }

    if ($(window).width() > 619) {
      if (pageIndex != 1) $("#serv-navigation").addClass("visible");
      else $("#serv-navigation").removeClass("visible");
    }
  } else {
    if (scrollTop >= $(window).height() - logoHeight) {
      $("#logo, #navigation, #hamburger")
        .removeClass("white")
        .addClass("black");
      $("#serv-overlay").addClass("visible");
      pageIndex = 2;
    } else {
      $("#logo, #navigation, #hamburger")
        .removeClass("black")
        .addClass("white");
      $("#serv-overlay").removeClass("visible");
      pageIndex = 1;
    }
  }
}

var scrollTimeout = 0;
var disableScroll = false;

function oneScrollBefore(index) {
  if (pageIndex == 1) {
    $("#logo, #navigation").animate({ opacity: 0 }, 250, function () {
      $("#logo, #navigation, #hamburger")
        .removeClass("white")
        .addClass("black");
    });
    $("#serv-navigation a.active").removeClass("active");
    $("#serv-navigation a[data-index='" + index + "']").addClass("active");
    $("#videobg").addClass("edgefix");
  } else {
    if (index == 1) {
      $("#serv-overlay").removeClass("visible");
      $("#logo, #navigation, #serv-navigation").animate({ opacity: 0 }, 250);
    } else {
      $("#serv-navigation a.active").removeClass("active");
      $("#serv-navigation a[data-index='" + index + "']").addClass("active");
    }
  }
}

function oneScrollAfter(index) {
  if (pageIndex == 1) {
    $("#serv-navigation").css({ opacity: 0 }).addClass("visible");
    $("#serv-overlay").addClass("visible");
    $("#logo, #navigation, #serv-navigation").animate({ opacity: 1 }, 250);
  } else {
    if (index == 1) {
      $("#logo, #navigation, #hamburger")
        .removeClass("black")
        .addClass("white");
      $("#logo, #navigation").animate({ opacity: 1 }, 250);
      $("#videobg").removeClass("edgefix");
    }
  }
  pageIndex = index;
}

function menuAction(force_close) {
  if ($("#hamburger").hasClass("active") || force_close) {
    $("#navigation-m").removeClass("flex").addClass("hidden");
    if (pageIndex === 1) $("#logo").removeClass("black").addClass("white");
    else $("#logo").removeClass("white").addClass("black");

    $("#hamburger").removeClass("active");
  } else {
    $("#navigation-m").removeClass("hidden").addClass("flex"); // показываем меню
    $("#logo").removeClass("white").addClass("black");
    $("#hamburger").addClass("active");
  }
}

$(document).ready(function () {
  $("#main").onepage_scroll({
    sectionContainer: "section",
    responsiveFallback: 800,
    loop: false,
    beforeMove: oneScrollBefore,
    afterMove: oneScrollAfter,
    keyboard: false,
    updateURL: false,
  });

  $(
    "#serv-navigation a, .main-icons .ico, #navigation-m a, #navigation a[data-index=8]"
  ).click(function () {
    if (
      $(window).width() < 800 ||
      $("body").hasClass("disabled-onepage-scroll")
    ) {
      var slide_index = $(this).attr("data-index");
      var slide_offset = $(".page[data-index=" + slide_index + "]").offset()
        .top;
      var body_scrolltop = $("body").scrollTop();
      var overlay_height = $("#serv-overlay").height();

      if (typeof slide_index != "undefined") {
        menuAction(true);
        $("#serv-navigation a.active").removeClass("active");
        $("#serv-navigation a[data-index='" + slide_index + "']").addClass(
          "active"
        );

        $("html, body").animate(
          { scrollTop: slide_offset + body_scrolltop - overlay_height },
          750
        );
      }
    } else {
      $("#main").moveTo($(this).attr("data-index"));
    }
  });
  $(".main-icons .ico").mouseover(function () {
    $(this).addClass("active");
  });
  $(".main-icons .ico").mouseout(function () {
    $(this).removeClass("active");
  });

  $(window).resize(updateResolution);

  setTimeout(updateResolution, 300);
  setTimeout(animateFuture, 1000);

  $("#hamburger").click(function () {
    menuAction(false);
  });

  $(".serv-3-collage div").click(function () {
    window.location.href = $(this).children("a").prop("href");
  });
});
