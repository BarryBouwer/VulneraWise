import * as jsonDir from 'data/vulnerabilities.json';
document.addEventListener("DOMContentLoaded", function () {
  const sidebarContainer = document.querySelector(".sidebar-container");
  const sidebarOpener = document.querySelector(".sidebar-opener");
  const siderbarCloser = document.querySelector(".sidebar-closer");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const dialogue = document.getElementById("dialogue");
  const dialogueOpener = document.getElementById("openDialogue");
  const dialogueCloser = document.getElementById("closeDialogue");
  const scrollSection = document.getElementById("codeSection");
  const openSearch = document.querySelector('.openSearch');
  const searchContainer = document.querySelector('.searchContainer');
  const closeSearch = document.querySelector('.searchClose');
  const mainSearchElm = document.querySelector(".main-search");
  const popupSearchElm = document.querySelector(".popup-search");
  const baseUrl = document.querySelector('meta[name="site-base-url"]')?.content;
  const remembered = JSON.parse(localStorage.getItem('rememberedUser'));
  const prose = document.querySelector('.prose');
  let jsonData = [];
  let user, scrollInterval, fuse;

  // swiper config
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });

  var heroSwiper = new Swiper(".heroSwiper", {
    loop: true,
    autoplay: {
      delay: 5000,
    },
  });

  var blogSwiper = new Swiper(".blogSwiper", {
    pagination: {
      el: ".swiper-pagination",
    },
    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
    },
  });

  var loginSwiper = new Swiper(".auth-swiper", {
    loop: true,
    autoplay: {
      delay: 5000,
    },
    navigation: {
      nextEl: ".next",
      prevEl: ".prev"
    },
    pagination: {
      el: ".auth-pagination"
    },
  });

  // aos.js init
  AOS.init();

  
  // docs page functions
  if (sidebarContainer) {
    scrollToActiveItem();
    enableCollapsibles();

    function enableCollapsibles() {
      const buttons = document.querySelectorAll(
        ".hextra-sidebar-collapsible-button"
      );
      buttons.forEach(function (button) {
        button.addEventListener("click", function (e) {
          e.preventDefault();
          const list = button.parentElement.parentElement;
          if (list) {
            list.classList.toggle("open");
          }
        });
      });
    }

    function scrollToActiveItem() {
      const sidebarScrollbar = document.querySelector(
        "aside.sidebar-container > .hextra-scrollbar"
      );
      const activeItems = document.querySelectorAll(".sidebar-active-item");
      const visibleActiveItem = Array.from(activeItems).find(
        function (activeItem) {
          return activeItem.getBoundingClientRect().height > 0;
        }
      );

      if (!visibleActiveItem) {
        return;
      }

      const yOffset = visibleActiveItem.clientHeight;
      const yDistance =
        visibleActiveItem.getBoundingClientRect().top -
        sidebarScrollbar.getBoundingClientRect().top;
      sidebarScrollbar.scrollTo({
        behavior: "instant",
        top: yDistance - yOffset,
      });
    }

    const overlayClasses = [
      "fixed",
      "inset-0",
      "z-10",
      "bg-slate-50",
      "dark:bg-main",
      "opacity-50",
    ];
    overlay.classList.add("bg-transparent");
    overlay.classList.remove("hidden", ...overlayClasses);

    function toggleSidebar() {
      sidebarContainer.classList.toggle(
        "max-md:[transform:translate3d(-100%,0,0)]"
      );
      sidebarContainer.classList.toggle(
        "max-md:[transform:translate3d(0,0,0)]"
      );
    }

    sidebarOpener.addEventListener("click", (e) => {
      e.preventDefault();
      toggleSidebar();

      if (overlay.classList.contains("bg-transparent")) {
        // Show the overlay
        overlay.classList.add(...overlayClasses);
        overlay.classList.remove("bg-transparent");
      } else {
        // Hide the overlay
        overlay.classList.remove(...overlayClasses);
        overlay.classList.add("bg-transparent");
      }
    });

    siderbarCloser.addEventListener("click", (e) => {
      e.preventDefault();
      toggleSidebar();

      if (overlay.classList.contains("bg-transparent")) {
        // Show the overlay
        overlay.classList.add(...overlayClasses);
        overlay.classList.remove("bg-transparent");
      } else {
        // Hide the overlay
        overlay.classList.remove(...overlayClasses);
        overlay.classList.add("bg-transparent");
      }
    });

    overlay.addEventListener("click", (e) => {
      e.preventDefault();
      toggleSidebar();

      // Hide the overlay
      overlay.classList.remove(...overlayClasses);
      overlay.classList.add("bg-transparent");
    });
  }

  // Cookies dialogue
  if (dialogue) {
    dialogueOpener.addEventListener("click", () => {
      dialogue.classList.remove("hidden");
      dialogue.classList.add("flex");
      dialogue.classList.remove("opacity-0");
      dialogue.firstElementChild.classList.remove("scale-50");
      dialogue.firstElementChild.classList.add("scale-100");
    });
  
    dialogueCloser.addEventListener("click", () => {
      dialogue.classList.remove("flex");
      dialogue.classList.add("hidden");
    });
  }

  // Code section function
  if (scrollSection) {
    function startAutoScroll() {
      scrollInterval = setInterval(() => {
        scrollSection.scrollTop += 1;
        if (
          scrollSection.scrollTop >=
          scrollSection.scrollHeight - scrollSection.clientHeight
        ) {
          scrollSection.scrollTop = 0;
        }
      }, 70);
    }
    function stopAutoScroll() {
      clearInterval(scrollInterval);
    }
    startAutoScroll();
    scrollSection.addEventListener("mouseenter", stopAutoScroll);
    scrollSection.addEventListener("mouseleave", startAutoScroll);
  }

  const links = document.querySelectorAll(".divAnchor");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      clickedId = link.id;
      const url = link.getAttribute("data-url");
      window.location.href = url;
    });
  });
  
  if (openSearch) {
    openSearch.addEventListener('click', () => {
      searchContainer.classList.remove('hidden');
      document.getElementsByTagName('body')[0].dataset.scroll = "false";
    });
  };
  if (closeSearch) {
    closeSearch.addEventListener('click', () => {
      searchContainer.classList.add('hidden');
      document.getElementsByTagName('body')[0].dataset.scroll = "true";
    });
  };

  async function fetchData() {
    try {
      const response = jsonDir.data;
      jsonData = response;
      let data = [];
      for (let i = 0; i < jsonData.length; i++) {
        let cveId = jsonData[i].cve.id;
        let cveDes = jsonData[i].cve.description;
        let value = {
          id: cveId,
          description: cveDes
        }
        data.push(value)
      };
      // Initialize Fuse.js with options
      fuse = new Fuse(data, {
        keys: ["description", "id"],
        includeScore: true
      });
    } catch (error) {
      console.error("Error fetching JSON:", error);
    }
  }

  // Perform fuzzy search
  function searchFuzzy(elemId) {
    const query = elemId.value;
    let content = [];

    const results = fuse.search(query);
    for (let i = 0; i < results.length; i++) {
      const id = results[i].item.id;
      const des = results[i].item.description;
      content.push({id, des});
    };

    let html = [];
    content.map((item) => {
      const description = truncateString(item.des);
      function truncateString(str) {
        const num = 60;
        if (str.length > num) {
          return str.slice(0, num) + "...";
        } else {
          return str;
        };
      };
      const url = item.id.toLowerCase();
      html.push(`
        <a href="cves/${url}" class="block bg-transparent p-2 rounded-lg cursor-pointer space-y-0.5 font-poppins text-start result-item">
          <h6 class="font-semibold text-white">${item.id}</h6>
          <p class="text-sm text-slate-400">${description}</p>
        </a>
      `)
    });
    const resultElm = elemId.parentElement.querySelector('.results');
    if (html.length === 0) {
      resultElm.innerHTML = "Nothing to show. Search something else...";
    } else {
      resultElm.innerHTML = html.join('');
    }
  };

  function showResult() {
    const containerElem = this.parentElement.querySelector('.result-container');
    if (this.value === '') {
      containerElem.classList.add('hidden');
    } else {
      containerElem.classList.remove('hidden');
      searchFuzzy(this)
    }
  }
  if (mainSearchElm) {
    mainSearchElm.addEventListener('input', showResult);
  };
  if (openSearch) {
    popupSearchElm.addEventListener('input', showResult);
  };

  // Fetch JSON when page loads
  fetchData();

  if (remembered && remembered.expiry > Date.now()) {
    user = remembered.user;
    // Optionally sync into sessionStorage so rest of app works the same
    sessionStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('rememberedUser'); // cleanup expired
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      user = JSON.parse(sessionUser);
    }
  };

  if (prose) {
    document.querySelectorAll(".prose table:not(.lntable)").forEach((table) => {
      table.classList.add("fixed-table");
    });
  };

  // function toggleAuthButtons(showLoginSignup) {
  //   const loginBtns = document.querySelectorAll('.js-login');
  //   const signupBtns = document.querySelectorAll('.js-signup');
  //   const logoutBtns = document.querySelectorAll('.js-logout');
  
  //   loginBtns.forEach(btn => {
  //     if (showLoginSignup) {
  //       btn.classList.remove('hidden');
  //     } else {
  //       btn.classList.add('hidden');
  //     }
  //   });
  
  //   signupBtns.forEach(btn => {
  //     if (showLoginSignup) {
  //       btn.classList.remove('hidden');
  //     } else {
  //       btn.classList.add('hidden');
  //     }
  //   });
  
  //   logoutBtns.forEach(btn => {
  //     if (showLoginSignup) {
  //       btn.classList.add('hidden');
  //     } else {
  //       btn.classList.remove('hidden');
  //     }
  //   });
  // }
  
  // // ✅ Apply initial state
  // toggleAuthButtons(!user);
  
  // // ✅ Logout
  // document.querySelectorAll('.js-logout').forEach(btn => {
  //   btn.addEventListener('click', () => {
  //     sessionStorage.removeItem('user');
  //     localStorage.removeItem('rememberedUser');
  //     toggleAuthButtons(true);
  //     window.location.href = baseUrl;
  //   });
  // });  
});
