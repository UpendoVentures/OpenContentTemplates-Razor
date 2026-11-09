/*
 * NoBS Card Rotator
 * Starts every [data-nobs-card-rotator] element on the page exactly once, using the bundled Swiper.
 * Safe to load more than once and safe with any number of rotators per page.
 */
(function (window, document) {
    'use strict';

    if (window.NoBSCardRotator) {
        return;
    }

    var SELECTOR = '[data-nobs-card-rotator]';
    var READY_ATTRIBUTE = 'data-nobs-cr-ready';
    var LOOP_MINIMUM_CARDS = 5; // Swiper loop needs slidesPerView (max 4) + 1 slides.

    document.documentElement.classList.add('nobs-cr-js');

    function prefersReducedMotion() {
        return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    function readGap(element) {
        var value = parseFloat(window.getComputedStyle(element).columnGap);
        return isNaN(value) ? 16 : value;
    }

    function initRotator(root) {
        if (root.getAttribute(READY_ATTRIBUTE)) {
            return;
        }
        root.setAttribute(READY_ATTRIBUTE, 'true');

        var viewport = root.querySelector('.nobs-cr__swiper');
        if (!viewport) {
            return;
        }

        if (typeof window.Swiper !== 'function') {
            // Swiper is missing: show the cards as a plain wrapped grid.
            root.classList.add('nobs-cr--static');
            return;
        }

        var slideCount = viewport.querySelectorAll('.swiper-slide').length;
        var autoplayEnabled = root.getAttribute('data-autoplay') === 'true';
        var navigationEnabled = root.getAttribute('data-navigation') === 'true';
        var delay = parseInt(root.getAttribute('data-autoplay-delay'), 10) || 5000;
        var pauseLabel = root.getAttribute('data-label-pause') || 'Pause automatic rotation';
        var playLabel = root.getAttribute('data-label-play') || 'Play automatic rotation';
        var prevButton = root.querySelector('.nobs-cr__nav--prev');
        var nextButton = root.querySelector('.nobs-cr__nav--next');
        var pauseButton = root.querySelector('.nobs-cr__pause');
        var pauseText = pauseButton ? pauseButton.querySelector('.nobs-cr__pause-text') : null;
        var reducedMotion = prefersReducedMotion();
        var useLoop = slideCount >= LOOP_MINIMUM_CARDS;

        var state = {
            userPaused: reducedMotion,
            hovered: false,
            focused: false
        };

        var options = {
            slidesPerView: 2,
            slidesPerGroup: 1,
            spaceBetween: readGap(viewport),
            speed: reducedMotion ? 0 : 400,
            loop: useLoop,
            rewind: !useLoop,
            watchOverflow: true,
            grabCursor: true,
            keyboard: { enabled: false },
            breakpoints: {
                768: { slidesPerView: 3 },
                992: { slidesPerView: 4 }
            },
            a11y: {
                enabled: true,
                prevSlideMessage: 'Previous card',
                nextSlideMessage: 'Next card',
                firstSlideMessage: 'This is the first card',
                lastSlideMessage: 'This is the last card',
                containerMessage: root.getAttribute('data-label') || 'Featured cards',
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
            root.addEventListener('mouseenter', function () {
                state.hovered = true;
                updateAutoplay();
            });
            root.addEventListener('mouseleave', function () {
                state.hovered = false;
                updateAutoplay();
            });
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

        // Arrow keys move only the rotator that currently has focus.
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

        refresh();
    }

    function initAll() {
        var rotators = document.querySelectorAll(SELECTOR);
        for (var i = 0; i < rotators.length; i++) {
            try {
                initRotator(rotators[i]);
            } catch (error) {
                rotators[i].classList.add('nobs-cr--static');
                if (window.console && window.console.error) {
                    window.console.error('NoBS Card Rotator could not start.', error);
                }
            }
        }
    }

    // Re-run after DNN/ASP.NET partial postbacks so new rotators start too.
    function hookPartialPostbacks() {
        try {
            if (window.Sys && window.Sys.WebForms && window.Sys.WebForms.PageRequestManager) {
                window.Sys.WebForms.PageRequestManager.getInstance().add_endRequest(initAll);
            }
        } catch (error) {
            // Partial postbacks are not in use on this page.
        }
    }

    window.NoBSCardRotator = { init: initAll };

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
