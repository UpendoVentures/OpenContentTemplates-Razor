(function () {
    function closest(el, selector) {
        while (el && el.nodeType === 1) {
            if (el.matches && el.matches(selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }

    function setActiveThumbnail(group, activeButton) {
        var buttons = group.querySelectorAll('.oc-store-thumbnail-button');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('is-active');
            buttons[i].setAttribute('aria-selected', 'false');
        }

        activeButton.classList.add('is-active');
        activeButton.setAttribute('aria-selected', 'true');
    }

    function swapProductImage(button) {
        var group = closest(button, '.oc-store-card-media');
        if (!group) { return; }

        var image = group.querySelector('.oc-store-card-primary-image');
        if (!image) { return; }

        var newSrc = button.getAttribute('data-image-src');
        var newAlt = button.getAttribute('data-image-alt');

        if (!newSrc) { return; }

        image.classList.add('is-changing');

        window.setTimeout(function () {
            image.setAttribute('src', newSrc);
            image.setAttribute('alt', newAlt || image.getAttribute('alt') || 'Product image');
            image.classList.remove('is-changing');
        }, 110);

        setActiveThumbnail(group, button);
    }

    document.addEventListener('click', function (event) {
        var button = closest(event.target, '.oc-store-thumbnail-button');
        if (!button) { return; }

        event.preventDefault();
        swapProductImage(button);
    });

    document.addEventListener('mouseover', function (event) {
        var button = closest(event.target, '.oc-store-thumbnail-button');
        if (!button) { return; }

        if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
            swapProductImage(button);
        }
    });
}());
