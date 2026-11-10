/*
 * Hero Banner Carousel NoBS
 * Starts every [data-hero-banner-carousel-nobs] element on the page exactly once, using the bundled Swiper.
 * Shows one full-width banner at a time on every screen size.
 * Safe to load more than once and safe with any number of carousels per page.
 */
(function (window, document) {
    'use strict';

    if (window.HeroBannerCarouselNoBS) {
        return;
    }

    var SELECTOR = '[data-hero-banner-carousel-nobs]';
    var READY_ATTRIBUTE = 'data-hbc-ready';
    var LOOP_MINIMUM_BANNERS = 3; // With 2 banners, rewind is smoother than Swiper's loop rearranging.

    document.documentElement.classList.add('hbc-js');

    function prefersReducedMotion() {
        return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    function canHover() {
        return !!(window.matchMedia && window.matchMedia('(hover: hover)').matches);
    }

    function initCarousel(root) {
        if (root.getAttribute(READY_ATTRIBUTE)) {
            return;
        }
        root.setAttribute(READY_ATTRIBUTE, 'true');

        var viewport = root.querySelector('.hbc__swiper');
        var stage = root.querySelector('.hbc__stage') || root;
        if (!viewport) {
            return;
        }

        if (typeof window.Swiper !== 'function') {
            // Swiper is missing: show the banners stacked, one below another.
            root.classList.add('hbc--static');
            return;
        }

        var slideCount = viewport.querySelectorAll('.swiper-slide').length;
        var autoplayEnabled = root.getAttribute('data-autoplay') === 'true';
        var pauseOnHover = root.getAttribute('data-pause-on-hover') !== 'false';
        var navigationEnabled = root.getAttribute('data-navigation') === 'true';
        var delay = parseInt(root.getAttribute('data-autoplay-delay'), 10) || 5000;
        var pauseLabel = root.getAttribute('data-label-pause') || 'Pause automatic rotation';
        var playLabel = root.getAttribute('data-label-play') || 'Play automatic rotation';
        var prevButton = root.querySelector('.hbc__nav--prev');
        var nextButton = root.querySelector('.hbc__nav--next');
        var pauseButton = root.querySelector('.hbc__pause');
        var pauseText = pauseButton ? pauseButton.querySelector('.hbc__pause-text') : null;
        var reducedMotion = prefersReducedMotion();
        var useLoop = slideCount >= LOOP_MINIMUM_BANNERS;

        var state = {
            userPaused: reducedMotion,
            hovered: false,
            focused: false
        };

        var options = {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 0,
            speed: reducedMotion ? 0 : 600,
            loop: useLoop,
            rewind: !useLoop,
            watchOverflow: true,
            grabCursor: slideCount > 1,
            keyboard: { enabled: false },
            a11y: {
                enabled: true,
                prevSlideMessage: 'Previous banner',
                nextSlideMessage: 'Next banner',
                firstSlideMessage: 'This is the first banner',
                lastSlideMessage: 'This is the last banner',
                containerMessage: root.getAttribute('data-label') || 'Featured banners',
                containerRoleDescriptionMessage: 'carousel',
                itemRoleDescriptionMessage: 'slide',
                slideLabelMessage: '{{index}} of {{slidesLength}}',
                scrollOnFocus: true
            }
        };

        if (navigationEnabled && prevButton && nextButton) {
            prevButton.hidden = false;
            nextButton.hidden = false;
            options.navigation = { prevEl: prevButton, nextEl: nextButton };
        }

        if (autoplayEnabled) {
            options.autoplay = { delay: delay, disableOnInteraction: false };
        }

        var swiper = new window.Swiper(viewport, options);

        function renderPauseButton() {
            if (!pauseButton) {
                return;
            }
            pauseButton.hidden = !!swiper.isLocked;
            pauseButton.setAttribute('aria-label', state.userPaused ? playLabel : pauseLabel);
            pauseButton.classList.toggle('is-paused', state.userPaused);
            if (pauseText) {
                pauseText.textContent = state.userPaused ? 'Play' : 'Pause';
            }
        }

        function updateAutoplay() {
            if (!autoplayEnabled || !swiper.autoplay) {
                return;
            }
            var shouldRun = !state.userPaused && !state.hovered && !state.focused && !swiper.isLocked;
            if (shouldRun && !swiper.autoplay.running) {
                swiper.autoplay.start();
            } else if (!shouldRun && swiper.autoplay.running) {
                swiper.autoplay.stop();
            }
        }

        function refresh() {
            renderPauseButton();
            updateAutoplay();
        }

        if (pauseButton) {
            pauseButton.addEventListener('click', function () {
                state.userPaused = !state.userPaused;
                refresh();
            });
        }

        if (autoplayEnabled) {
            // Pause on hover only where a real pointer can hover; touch taps must not stop rotation for good.
            if (pauseOnHover && canHover()) {
                stage.addEventListener('mouseenter', function () {
                    state.hovered = true;
                    updateAutoplay();
                });
                stage.addEventListener('mouseleave', function () {
                    state.hovered = false;
                    updateAutoplay();
                });
            }
            // Keyboard focus always pauses, so the banner a keyboard user is on does not move away.
            root.addEventListener('focusin', function () {
                state.focused = true;
                updateAutoplay();
            });
            root.addEventListener('focusout', function (event) {
                if (!event.relatedTarget || !root.contains(event.relatedTarget)) {
                    state.focused = false;
                    updateAutoplay();
                }
            });
        }

        // Arrow keys move only the carousel that currently has focus.
        root.addEventListener('keydown', function (event) {
            var target = event.target;
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
                return;
            }
            if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) {
                return;
            }
            if (event.key === 'ArrowLeft' || event.key === 'Left') {
                swiper.slidePrev();
                event.preventDefault();
            } else if (event.key === 'ArrowRight' || event.key === 'Right') {
                swiper.slideNext();
                event.preventDefault();
            }
        });

        swiper.on('lock', refresh);
        swiper.on('unlock', refresh);

        // Lazy images can change the banner height after they load; keep Swiper's measurements current.
        var images = viewport.querySelectorAll('img');
        for (var i = 0; i < images.length; i++) {
            if (!images[i].complete) {
                images[i].addEventListener('load', function () {
                    swiper.update();
                });
            }
        }

        refresh();
    }

    function initAll() {
        var carousels = document.querySelectorAll(SELECTOR);
        for (var i = 0; i < carousels.length; i++) {
            try {
                initCarousel(carousels[i]);
            } catch (error) {
                carousels[i].classList.add('hbc--static');
                if (window.console && window.console.error) {
                    window.console.error('Hero Banner Carousel NoBS could not start.', error);
                }
            }
        }
    }

    // Re-run after DNN/ASP.NET partial postbacks so new carousels start too.
    function hookPartialPostbacks() {
        try {
            if (window.Sys && window.Sys.WebForms && window.Sys.WebForms.PageRequestManager) {
                window.Sys.WebForms.PageRequestManager.getInstance().add_endRequest(initAll);
            }
        } catch (error) {
            // Partial postbacks are not in use on this page.
        }
    }

    window.HeroBannerCarouselNoBS = { init: initAll };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    window.addEventListener('load', function () {
        hookPartialPostbacks();
        initAll();
    });
}(window, document));
