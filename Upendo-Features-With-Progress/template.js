(function () {
  var namespace = 'UpendoFeaturesWithProgressInit';
  var queuedRoots = window[namespace] && window[namespace].queue ? window[namespace].queue : [];
  var stepMs = 50;
  var pauseMs = 200;

  function matchesFeature(element) {
    return element && element.classList && element.classList.contains('upendo-features-with-progress__feature');
  }

  function closestFeature(element) {
    while (element && element !== document) {
      if (matchesFeature(element)) {
        return element;
      }
      element = element.parentNode;
    }
    return null;
  }

  function closestRoot(element) {
    while (element && element !== document) {
      if (element.classList && element.classList.contains('upendo-features-with-progress')) {
        return element;
      }
      element = element.parentNode;
    }
    return null;
  }

  function getRootState(root) {
    if (!root || !root.upendoFeaturesWithProgress) {
      return null;
    }
    return root.upendoFeaturesWithProgress;
  }

  function stopAutoplay(state) {
    if (state.timer) {
      window.clearInterval(state.timer);
    }
    if (state.pauseTimer) {
      window.clearTimeout(state.pauseTimer);
    }
    state.timer = null;
    state.pauseTimer = null;
  }

  function setFeatureProgress(feature, progress) {
    var progressBar = feature.querySelector('.upendo-features-with-progress__progress-bar');

    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
  }

  function centerActiveFeature(state) {
    var isSmall = window.matchMedia && window.matchMedia('(max-width: 991.98px)').matches;
    if (!isSmall || !state.features[state.activeIndex] || !state.features[state.activeIndex].scrollIntoView) {
      return;
    }
    state.features[state.activeIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  function setActive(state, index, shouldReset) {
    if (!state || index < 0 || index >= state.features.length) {
      return;
    }

    state.activeIndex = index;
    if (shouldReset) {
      state.progress = 0;
    }

    for (var i = 0; i < state.features.length; i++) {
      var isFeatureActive = i === state.activeIndex;
      state.features[i].classList.toggle('is-active', isFeatureActive);
      state.features[i].setAttribute('aria-selected', isFeatureActive ? 'true' : 'false');
      state.features[i].setAttribute('tabindex', isFeatureActive ? '0' : '-1');
      setFeatureProgress(state.features[i], isFeatureActive ? state.progress : 0);
    }

    for (var j = 0; j < state.visuals.length; j++) {
      var visualIndex = parseInt(state.visuals[j].getAttribute('data-visual-index'), 10);
      var isVisualActive = visualIndex === state.activeIndex;
      state.visuals[j].classList.toggle('is-active', isVisualActive);
      state.visuals[j].setAttribute('aria-hidden', isVisualActive ? 'false' : 'true');
    }

    centerActiveFeature(state);
  }

  function setProgress(state, value) {
    var activeFeature = state.features[state.activeIndex];
    var bar = activeFeature ? activeFeature.querySelector('.upendo-features-with-progress__progress-bar') : null;
    if (bar) {
      bar.style.width = value + '%';
    }
  }

  function startAutoplay(state) {
    if (!state || !state.autoplay) {
      return;
    }

    stopAutoplay(state);
    state.timer = window.setInterval(function () {
      state.progress = Math.min(100, state.progress + (stepMs / state.duration * 100));
      setProgress(state, state.progress);

      if (state.progress >= 100) {
        stopAutoplay(state);
        state.pauseTimer = window.setTimeout(function () {
          setActive(state, (state.activeIndex + 1) % state.features.length, true);
          startAutoplay(state);
        }, pauseMs);
      }
    }, stepMs);
  }

  function activateFeature(feature) {
    var root = closestRoot(feature);
    var state = getRootState(root);
    var nextIndex = parseInt(feature.getAttribute('data-feature-index'), 10);

    if (!state || isNaN(nextIndex)) {
      return;
    }

    stopAutoplay(state);
    setActive(state, nextIndex, true);
    startAutoplay(state);
  }

  function moveFeatureFocus(feature, offset) {
    var root = closestRoot(feature);
    var state = getRootState(root);
    var currentIndex = parseInt(feature.getAttribute('data-feature-index'), 10);
    var nextIndex;

    if (!state || isNaN(currentIndex) || !state.features.length) {
      return;
    }

    if (offset === 'first') {
      nextIndex = 0;
    } else if (offset === 'last') {
      nextIndex = state.features.length - 1;
    } else {
      nextIndex = (currentIndex + offset + state.features.length) % state.features.length;
    }

    stopAutoplay(state);
    setActive(state, nextIndex, true);

    if (state.features[nextIndex] && state.features[nextIndex].focus) {
      state.features[nextIndex].focus();
    }

    startAutoplay(state);
  }

  function delegatedClick(event) {
    var feature = closestFeature(event.target);
    if (feature) {
      activateFeature(feature);
    }
  }

  function delegatedKeydown(event) {
    var key = event.key || event.keyCode;
    var feature = closestFeature(event.target);

    if (!feature) {
      return;
    }

    if (key === 'Enter' || key === ' ' || key === 13 || key === 32) {
      event.preventDefault();
      activateFeature(feature);
      return;
    }

    if (key === 'ArrowRight' || key === 'ArrowDown' || key === 39 || key === 40) {
      event.preventDefault();
      moveFeatureFocus(feature, 1);
      return;
    }

    if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 37 || key === 38) {
      event.preventDefault();
      moveFeatureFocus(feature, -1);
      return;
    }

    if (key === 'Home' || key === 36) {
      event.preventDefault();
      moveFeatureFocus(feature, 'first');
      return;
    }

    if (key === 'End' || key === 35) {
      event.preventDefault();
      moveFeatureFocus(feature, 'last');
    }
  }

  function bindDelegatedHandlers() {
    if (document.upendoFeaturesWithProgressDelegated === true) {
      return;
    }

    document.addEventListener('click', delegatedClick, false);
    document.addEventListener('keydown', delegatedKeydown, false);
    document.upendoFeaturesWithProgressDelegated = true;
  }

  function bootFeaturesWithProgress() {
    var roots = document.querySelectorAll('.upendo-features-with-progress');
    for (var rootIndex = 0; rootIndex < roots.length; rootIndex++) {
      window[namespace](roots[rootIndex]);
    }
  }

  function initializeFeaturesWithProgress(root) {
    if (!root) {
      return;
    }

    if (root.upendoFeaturesWithProgress && root.upendoFeaturesWithProgress.initialized) {
      return;
    }

    var features = root.querySelectorAll('.upendo-features-with-progress__feature');
    var visuals = root.querySelectorAll('.upendo-features-with-progress__visual');

    if (!features.length || !visuals.length) {
      return;
    }

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var state = {
      initialized: true,
      root: root,
      features: features,
      visuals: visuals,
      activeIndex: 0,
      progress: 0,
      duration: Math.max(parseInt(root.getAttribute('data-duration'), 10) || 4200, 1000),
      autoplay: root.getAttribute('data-autoplay') === 'true' && !reduceMotion,
      timer: null,
      pauseTimer: null,
      activateFeature: activateFeature,
      destroy: function () {
        stopAutoplay(state);
        root.upendoFeaturesWithProgress = null;
        root.removeAttribute('data-features-progress-ready');
      }
    };

    root.upendoFeaturesWithProgress = state;
    root.setAttribute('data-features-progress-ready', 'true');
    setActive(state, 0, true);
    startAutoplay(state);
  }

  window[namespace] = initializeFeaturesWithProgress;
  window.UpendoFeaturesWithProgressManual = activateFeature;

  bindDelegatedHandlers();

  if (queuedRoots.length) {
    while (queuedRoots.length) {
      window[namespace](queuedRoots.shift());
    }
  }

  bootFeaturesWithProgress();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootFeaturesWithProgress);
  }

  window.setTimeout(bootFeaturesWithProgress, 500);
})();
