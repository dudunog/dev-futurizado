(function () {
  "use strict";

  function getApiBaseUrl() {
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      if (script.src && script.src.includes("magic-banner.js")) {
        const url = new URL(script.src);
        return url.origin; // Returns the origin of the script (e.g., https://your-app.vercel.app)
      }
    }

    // Fallback
    return window.location.origin;
  }

  const CONFIG = {
    apiBaseUrl: getApiBaseUrl(),
    containerId: "magic-banner-container",
    bannerClass: "magic-banner",
  };

  async function fetchBanner(url) {
    try {
      const apiUrl = `${
        CONFIG.apiBaseUrl
      }/api/banners/query?url=${encodeURIComponent(url)}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.banner;
    } catch (_) {
      return null;
    }
  }

  function createStyles() {
    const styleId = "magic-banner-styles";

    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      #${CONFIG.containerId} {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .${CONFIG.bannerClass} {
        position: relative;
        width: 100%;
        display: block;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .${CONFIG.bannerClass} img {
        width: 100%;
        height: auto;
        display: block;
        margin: 0;
        padding: 0;
      }

      .${CONFIG.bannerClass} a {
        display: block;
        text-decoration: none;
        cursor: pointer;
      }

      .magic-banner-close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: background 0.2s;
      }

      .magic-banner-close:hover {
        background: rgba(0, 0, 0, 0.7);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideDown {
        from {
          transform: translateY(-100%);
        }
        to {
          transform: translateY(0);
        }
      }

      @keyframes bounceIn {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-20px);
        }
        60% {
          transform: translateY(-10px);
        }
      }

      .magic-banner-fade {
        animation: fadeIn 0.5s ease-in forwards;
      }

      .magic-banner-slide {
        animation: slideDown 0.5s ease-out forwards;
      }

      .magic-banner-bounce {
        animation: bounceIn 0.6s ease-out forwards;
      }

      @media (max-width: 768px) {
        .magic-banner-close {
          width: 25px;
          height: 25px;
          font-size: 14px;
          top: 5px;
          right: 5px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function createBannerElement(banner) {
    const container = document.createElement("div");
    container.id = CONFIG.containerId;
    container.className = CONFIG.bannerClass;

    if (banner.animationType) {
      container.classList.add(`magic-banner-${banner.animationType}`);
    } else {
      container.classList.add("magic-banner-fade"); // Default
    }

    let bannerContent;
    if (banner.clickUrl) {
      bannerContent = document.createElement("a");
      bannerContent.href = banner.clickUrl;
      bannerContent.target = "_blank";
      bannerContent.rel = "noopener noreferrer";
    } else {
      bannerContent = document.createElement("div");
    }

    const img = document.createElement("img");
    img.src = banner.imageUrl;
    img.alt = banner.imageAlt || "Banner";
    img.loading = "lazy";

    bannerContent.appendChild(img);

    const closeButton = document.createElement("button");
    closeButton.className = "magic-banner-close";
    closeButton.innerHTML = "×";
    closeButton.setAttribute("aria-label", "Close banner");
    closeButton.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      removeBanner();
    };

    container.appendChild(bannerContent);
    container.appendChild(closeButton);

    return container;
  }

  function removeBanner() {
    const container = document.getElementById(CONFIG.containerId);
    if (container) {
      container.style.opacity = "0";
      container.style.transition = "opacity 0.3s ease-out";
      setTimeout(() => {
        container.remove();
        document.body.style.paddingTop = "";
      }, 300);
    }
  }

  function displayBanner(banner) {
    const existing = document.getElementById(CONFIG.containerId);
    if (existing) {
      existing.remove();
    }

    const bannerElement = createBannerElement(banner);
    document.body.insertBefore(bannerElement, document.body.firstChild);

    const bannerHeight = bannerElement.offsetHeight;
    if (bannerHeight > 0) {
      document.body.style.paddingTop = `${bannerHeight}px`;
    }

    if (banner.displayDuration && banner.displayDuration > 0) {
      setTimeout(() => {
        removeBanner();
      }, banner.displayDuration * 1000);
    }
  }

  async function init() {
    createStyles();

    const currentUrl = window.location.href;

    const banner = await fetchBanner(currentUrl);

    if (banner) {
      displayBanner(banner);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
