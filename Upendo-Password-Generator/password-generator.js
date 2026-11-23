/*
 * Upendo Password Generator
 * Client-side random password generator.
 * All randomness comes from crypto.getRandomValues (works on HTTP and HTTPS).
 * Nothing is stored: no cookies, no localStorage, no history, no network calls.
 */
(function (window, document) {
    "use strict";

    var MIN_LENGTH = 8;
    var MAX_LENGTH = 64;
    var DEFAULT_LENGTH = 16;
    var COPIED_MESSAGE_MS = 2500;

    var LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    var UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var NUMBERS = "0123456789";
    // Quotes, backslash, backtick, angle brackets, and spaces are left out because
    // many sites and systems reject or mishandle them.
    var SYMBOLS = "!#$%&()*+,-./:;=?@[]^_{|}~";

    // Strength is based on entropy in bits: length * log2(pool size).
    var STRENGTH_LEVELS = [
        { min: 0, key: "weak", label: "Weak" },
        { min: 45, key: "fair", label: "Fair" },
        { min: 60, key: "good", label: "Good" },
        { min: 80, key: "strong", label: "Strong" },
        { min: 100, key: "very-strong", label: "Very strong" }
    ];
    var METER_FULL_BITS = 128;

    /* ---------- Core generator ---------- */

    // Unbiased random integer in [0, max) using rejection sampling.
    function randomInt(max) {
        var limit = Math.floor(0x100000000 / max) * max;
        var buffer = new Uint32Array(1);
        do {
            window.crypto.getRandomValues(buffer);
        } while (buffer[0] >= limit);
        return buffer[0] % max;
    }

    function pick(set) {
        return set.charAt(randomInt(set.length));
    }

    function shuffle(chars) {
        for (var i = chars.length - 1; i > 0; i--) {
            var j = randomInt(i + 1);
            var temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
        }
        return chars;
    }

    function clampLength(value) {
        var length = parseInt(value, 10);
        if (isNaN(length)) {
            return DEFAULT_LENGTH;
        }
        if (length < MIN_LENGTH) {
            return MIN_LENGTH;
        }
        return length > MAX_LENGTH ? MAX_LENGTH : length;
    }

    function getCharacterSets(options) {
        var sets = [LOWERCASE];
        if (options.mixedCase) {
            sets.push(UPPERCASE);
        }
        if (options.numbers) {
            sets.push(NUMBERS);
        }
        if (options.symbols) {
            sets.push(SYMBOLS);
        }
        return sets;
    }

    // Guarantees at least one character from every enabled set, then fills the rest
    // from the combined pool and shuffles so the guaranteed characters are not predictable.
    function generate(options) {
        var length = clampLength(options.length);
        var sets = getCharacterSets(options);
        var pool = sets.join("");
        var chars = [];

        for (var s = 0; s < sets.length; s++) {
            chars.push(pick(sets[s]));
        }
        while (chars.length < length) {
            chars.push(pick(pool));
        }

        return shuffle(chars).join("");
    }

    function getEntropyBits(options) {
        var poolSize = getCharacterSets(options).join("").length;
        return clampLength(options.length) * (Math.log(poolSize) / Math.LN2);
    }

    function getStrength(options) {
        var bits = getEntropyBits(options);
        var level = STRENGTH_LEVELS[0];
        for (var i = 0; i < STRENGTH_LEVELS.length; i++) {
            if (bits >= STRENGTH_LEVELS[i].min) {
                level = STRENGTH_LEVELS[i];
            }
        }
        return {
            bits: bits,
            key: level.key,
            label: level.label,
            percent: Math.max(8, Math.min(100, Math.round((bits / METER_FULL_BITS) * 100)))
        };
    }

    /* ---------- Clipboard ---------- */

    // Fallback for HTTP pages and older browsers: copy from a temporary, off-screen textarea.
    function copyWithFallback(text) {
        var temp = document.createElement("textarea");
        temp.value = text;
        temp.setAttribute("readonly", "");
        temp.style.position = "fixed";
        temp.style.top = "-1000px";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        temp.setSelectionRange(0, text.length);
        var ok = false;
        try {
            ok = document.execCommand("copy");
        } catch (e) {
            ok = false;
        }
        document.body.removeChild(temp);
        return ok;
    }

    function copyText(text) {
        if (window.navigator.clipboard && window.isSecureContext) {
            return window.navigator.clipboard.writeText(text).then(
                function () { return true; },
                function () { return copyWithFallback(text); }
            );
        }
        return Promise.resolve(copyWithFallback(text));
    }

    /* ---------- UI ---------- */

    function getCharClass(ch) {
        if (NUMBERS.indexOf(ch) !== -1) {
            return "is-number";
        }
        if (SYMBOLS.indexOf(ch) !== -1) {
            return "is-symbol";
        }
        return "";
    }

    // Builds colored spans with textContent only, so no markup is ever injected.
    function renderColored(container, text) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < text.length; i++) {
            var ch = text.charAt(i);
            var cls = getCharClass(ch);
            if (cls) {
                var span = document.createElement("span");
                span.className = cls;
                span.textContent = ch;
                fragment.appendChild(span);
            } else {
                fragment.appendChild(document.createTextNode(ch));
            }
        }
        container.appendChild(fragment);
    }

    function selectContents(element) {
        var selection = window.getSelection ? window.getSelection() : null;
        if (!selection || !document.createRange) {
            return;
        }
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function initGenerator(root) {
        var output = root.querySelector("[data-oc-pw-output]");
        var outputHelp = root.querySelector("[data-oc-pw-output-help]");
        var copyButton = root.querySelector("[data-oc-pw-copy]");
        var copyIcon = root.querySelector("[data-oc-pw-copy-icon]");
        var generateButton = root.querySelector("[data-oc-pw-generate]");
        var status = root.querySelector("[data-oc-pw-status]");
        var strength = root.querySelector("[data-oc-pw-strength]");
        var meter = root.querySelector("[data-oc-pw-meter]");
        var strengthLabel = root.querySelector("[data-oc-pw-strength-label]");
        var lengthRange = root.querySelector("[data-oc-pw-length-range]");
        var lengthInput = root.querySelector("[data-oc-pw-length]");
        var optionInputs = root.querySelectorAll("[data-oc-pw-option]");
        var statusTimer = null;
        // The current password lives only in this closure and the DOM.
        var current = "";

        if (!output || !copyButton || !generateButton) {
            return;
        }

        function readOptions() {
            var options = {
                length: lengthInput ? lengthInput.value : DEFAULT_LENGTH
            };
            for (var i = 0; i < optionInputs.length; i++) {
                options[optionInputs[i].getAttribute("data-oc-pw-option")] = optionInputs[i].checked;
            }
            return options;
        }

        function setCopiedState(isCopied) {
            copyButton.classList.toggle("is-copied", isCopied);
            if (copyIcon) {
                copyIcon.classList.toggle("fa-copy", !isCopied);
                copyIcon.classList.toggle("fa-check", isCopied);
            }
        }

        function setStatus(message, isError) {
            if (!status) {
                return;
            }
            window.clearTimeout(statusTimer);
            status.textContent = message;
            status.classList.toggle("is-error", !!isError);
            setCopiedState(!!message && !isError);

            if (message) {
                statusTimer = window.setTimeout(function () {
                    status.textContent = "";
                    status.classList.remove("is-error");
                    setCopiedState(false);
                }, COPIED_MESSAGE_MS);
            }
        }

        function renderStrength(options) {
            if (!strength) {
                return;
            }
            var result = getStrength(options);
            strength.setAttribute("data-oc-pw-strength", result.key);
            if (meter) {
                meter.style.width = result.percent + "%";
            }
            if (strengthLabel) {
                strengthLabel.textContent = result.label;
            }
        }

        function runGenerate() {
            var options = readOptions();
            current = generate(options);
            setStatus("");
            renderColored(output, current);
            renderStrength(options);
            if (outputHelp) {
                outputHelp.textContent = "Your password is ready. Click it, or click Copy, to copy it.";
            }
        }

        function syncLength(value, source) {
            var length = clampLength(value);
            if (lengthRange && source !== lengthRange) {
                lengthRange.value = length;
            }
            if (lengthInput && source !== lengthInput) {
                lengthInput.value = length;
            }
            return length;
        }

        function setEnabled(enabled) {
            var controls = root.querySelectorAll("button, input");
            for (var i = 0; i < controls.length; i++) {
                controls[i].disabled = !enabled;
            }
            root.setAttribute("aria-busy", enabled ? "false" : "true");
        }

        function copyOutput(returnFocusToButton) {
            if (!current || root.getAttribute("aria-busy") === "true") {
                return;
            }
            copyText(current).then(function (ok) {
                setStatus(ok ? "✔ Copied!" : "Copy did not work. Select the password above and press Ctrl+C (or Cmd+C).", !ok);
                if (returnFocusToButton) {
                    copyButton.focus();
                } else {
                    // Keep the password highlighted so it is clear what was copied.
                    selectContents(output);
                }
            });
        }

        copyButton.addEventListener("click", function () {
            copyOutput(true);
        });

        generateButton.addEventListener("click", runGenerate);

        // Clicking the password copies it, exactly like the Copy button.
        output.addEventListener("click", function () {
            copyOutput(false);
        });

        // Keyboard focus selects the password, so manual copying is easy too.
        output.addEventListener("focus", function () {
            selectContents(output);
        });

        output.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                copyOutput(false);
            }
        });

        if (lengthRange) {
            // Regenerate live while dragging, like the reference tools.
            lengthRange.addEventListener("input", function () {
                syncLength(lengthRange.value, lengthRange);
                runGenerate();
            });
        }

        if (lengthInput) {
            lengthInput.addEventListener("change", function () {
                lengthInput.value = syncLength(lengthInput.value, lengthInput);
                runGenerate();
            });
        }

        for (var i = 0; i < optionInputs.length; i++) {
            optionInputs[i].addEventListener("change", runGenerate);
        }

        // DNN wraps the whole page in one <form>. Pressing Enter in an input
        // would submit that form, so handle Enter here instead.
        root.addEventListener("keydown", function (event) {
            var target = event.target;
            if (event.key !== "Enter" || !target || target.tagName !== "INPUT") {
                return;
            }
            event.preventDefault();
            if (target === lengthInput) {
                lengthInput.value = syncLength(lengthInput.value, lengthInput);
                runGenerate();
            }
        });

        if (!window.crypto || !window.crypto.getRandomValues) {
            output.textContent = "";
            if (outputHelp) {
                outputHelp.textContent = "Sorry, this browser cannot create secure random passwords. Please try a newer browser.";
            }
            return;
        }

        // Always start from the defaults on page load. Browsers may restore form
        // values on reload or back/forward, and nothing should be remembered.
        syncLength(DEFAULT_LENGTH, null);
        for (var o = 0; o < optionInputs.length; o++) {
            optionInputs[o].checked = true;
        }

        runGenerate();
        setEnabled(true);
    }

    function initAll() {
        var roots = document.querySelectorAll("[data-oc-pw-generator]");
        for (var i = 0; i < roots.length; i++) {
            if (roots[i].getAttribute("data-oc-pw-ready") === "true") {
                continue;
            }
            roots[i].setAttribute("data-oc-pw-ready", "true");
            initGenerator(roots[i]);
        }
    }

    // Expose the pure functions for testing and reuse.
    window.UpendoPasswordGenerator = {
        generate: generate,
        getStrength: getStrength,
        clampLength: clampLength
    };

    // Wait until the page has fully loaded before generating and enabling the controls.
    if (document.readyState === "complete") {
        initAll();
    } else {
        window.addEventListener("load", initAll);
    }
})(window, document);
