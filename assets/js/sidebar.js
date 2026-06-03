(function () {
  var scrollStorageKey = "zhaoolee-sidebar-scroll";
  var modeStorageKey = "zhaoolee-sidebar-mode";
  var defaultMode = "latest";

  function isVisibleInside(container, element) {
    var containerRect = container.getBoundingClientRect();
    var elementRect = element.getBoundingClientRect();
    var padding = 16;

    return (
      elementRect.top >= containerRect.top + padding &&
      elementRect.bottom <= containerRect.bottom - padding
    );
  }

  function keepActiveLinkVisible(sidebar) {
    var activeLink = Array.prototype.slice
      .call(sidebar.querySelectorAll(".sidebar-nav a.active"))
      .find(function (link) {
        return !link.closest("[hidden]");
      });

    if (!activeLink || isVisibleInside(sidebar, activeLink)) {
      return;
    }

    activeLink.scrollIntoView({
      block: "center",
      inline: "nearest",
    });
  }

  function setupSidebarMode(sidebar) {
    var buttons = Array.prototype.slice.call(sidebar.querySelectorAll("[data-sidebar-mode-button]"));
    var panels = Array.prototype.slice.call(sidebar.querySelectorAll("[data-sidebar-panel]"));

    if (buttons.length === 0 || panels.length === 0) {
      return;
    }

    function knownMode(mode) {
      return panels.some(function (panel) {
        return panel.dataset.sidebarPanel === mode;
      });
    }

    function setMode(mode, shouldSave) {
      var nextMode = knownMode(mode) ? mode : defaultMode;

      panels.forEach(function (panel) {
        panel.hidden = panel.dataset.sidebarPanel !== nextMode;
      });

      buttons.forEach(function (button) {
        var isActive = button.dataset.sidebarModeButton === nextMode;
        button.setAttribute("aria-selected", String(isActive));
      });

      if (shouldSave) {
        window.localStorage.setItem(modeStorageKey, nextMode);
      }

      window.requestAnimationFrame(function () {
        keepActiveLinkVisible(sidebar);
      });
    }

    var savedMode = window.localStorage.getItem(modeStorageKey);
    setMode(savedMode || defaultMode, false);

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        setMode(button.dataset.sidebarModeButton, true);
      });
    });
  }

  function setupArticleToc() {
    var toc = document.querySelector(".article-toc");
    var links = toc ? Array.prototype.slice.call(toc.querySelectorAll("a[href^='#']")) : [];

    if (!toc || links.length === 0) {
      return;
    }

    var headings = links
      .map(function (link) {
        var id = decodeURIComponent(link.hash.slice(1));
        var heading = document.getElementById(id);

        return heading ? { heading: heading, link: link } : null;
      })
      .filter(Boolean);

    function setActive(link) {
      links.forEach(function (item) {
        item.classList.toggle("is-active", item === link);
      });

      if (!isVisibleInside(toc, link)) {
        link.scrollIntoView({
          block: "nearest",
          inline: "nearest",
        });
      }
    }

    function syncActiveLink() {
      var current = headings[0];
      var offset = 96;

      headings.forEach(function (item) {
        if (item.heading.getBoundingClientRect().top <= offset) {
          current = item;
        }
      });

      if (current) {
        setActive(current.link);
      }
    }

    syncActiveLink();
    window.addEventListener("scroll", syncActiveLink, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var sidebar = document.querySelector(".sidebar");

    if (!sidebar) {
      return;
    }

    setupSidebarMode(sidebar);

    var savedScroll = window.sessionStorage.getItem(scrollStorageKey);
    if (savedScroll !== null) {
      sidebar.scrollTop = parseInt(savedScroll, 10) || 0;
      window.sessionStorage.removeItem(scrollStorageKey);
    }

    window.requestAnimationFrame(function () {
      keepActiveLinkVisible(sidebar);
    });

    sidebar.querySelectorAll(".sidebar-nav a[href]").forEach(function (link) {
      link.addEventListener("click", function () {
        window.sessionStorage.setItem(scrollStorageKey, String(sidebar.scrollTop));
      });
    });

    setupArticleToc();
  });
})();
