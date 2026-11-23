/*
 * Upendo GUID Generator
 * Client-side generator for UUID v4, UUID v7, ULID, and NanoID values.
 * All randomness comes from crypto.getRandomValues (works on HTTP and HTTPS).
 */
(function (window, document) {
    "use strict";

    var MIN_COUNT = 1;
    var MAX_COUNT = 1000;
    var COPIED_MESSAGE_MS = 2500;
    var CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    var NANOID_ALPHABET = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
    var NANOID_LENGTH = 21;

    var VERSION_HELP = {
        v4: "The most common choice. Works almost everywhere a GUID or UUID is needed.",
        v7: "Like v4, but values created later sort after earlier ones. Useful for databases.",
        ulid: "A shorter, time-sortable ID made of 26 letters and numbers.",
        nanoid: "A very short, random ID of 21 characters. Upper and lower case matter."
    };

    /* ---------- Core generators ---------- */

    function randomBytes(length) {
        var bytes = new Uint8Array(length);
        window.crypto.getRandomValues(bytes);
        return bytes;
    }

    function setVersionAndVariant(bytes, version) {
        bytes[6] = (bytes[6] & 0x0f) | (version << 4);
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        return bytes;
    }

    function createUuidV4Bytes() {
        return setVersionAndVariant(randomBytes(16), 4);
    }

    // Monotonic state so a batch of v7 values stays in creation order.
    var v7State = { ms: -1, counter: 0 };

    function createUuidV7Bytes() {
        var bytes = randomBytes(16);
        var ms = Date.now();

        if (ms <= v7State.ms) {
            ms = v7State.ms;
            v7State.counter += 1;
            if (v7State.counter > 0x0fff) {
                ms += 1;
                v7State.counter = bytes[7] & 0x07;
            }
        } else {
            // Start low so there is room to count up within the same millisecond.
            v7State.counter = bytes[7] & 0x07;
        }
        v7State.ms = ms;

        // 48-bit big-endian Unix timestamp in milliseconds.
        var high = Math.floor(ms / 0x100000000);
        var low = ms >>> 0;
        bytes[0] = (high >>> 8) & 0xff;
        bytes[1] = high & 0xff;
        bytes[2] = (low >>> 24) & 0xff;
        bytes[3] = (low >>> 16) & 0xff;
        bytes[4] = (low >>> 8) & 0xff;
        bytes[5] = low & 0xff;

        // 12-bit counter in rand_a.
        bytes[6] = (v7State.counter >>> 8) & 0x0f;
        bytes[7] = v7State.counter & 0xff;

        return setVersionAndVariant(bytes, 7);
    }

    function bytesToHex(bytes) {
        var hex = "";
        for (var i = 0; i < bytes.length; i++) {
            hex += (bytes[i] < 16 ? "0" : "") + bytes[i].toString(16);
        }
        return hex;
    }

    function bytesToBase64(bytes) {
        var binary = "";
        for (var i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    function bytesToBase64Url(bytes) {
        return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }

    // Monotonic state so a batch of ULIDs stays in creation order.
    var ulidState = { ms: -1, random: null };

    function incrementBase32(digits) {
        for (var i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 31) {
                digits[i] += 1;
                return true;
            }
            digits[i] = 0;
        }
        return false;
    }

    function createUlid() {
        var ms = Date.now();
        var random;

        if (ms <= ulidState.ms && ulidState.random) {
            ms = ulidState.ms;
            random = ulidState.random.slice(0);
            if (!incrementBase32(random)) {
                ms += 1;
                random = null;
            }
        }

        if (!random) {
            var bytes = randomBytes(16);
            random = [];
            for (var r = 0; r < 16; r++) {
                random.push(bytes[r] & 31);
            }
        }

        ulidState.ms = ms;
        ulidState.random = random;

        var time = "";
        var remaining = ms;
        for (var t = 0; t < 10; t++) {
            time = CROCKFORD.charAt(remaining % 32) + time;
            remaining = Math.floor(remaining / 32);
        }

        var tail = "";
        for (var d = 0; d < random.length; d++) {
            tail += CROCKFORD.charAt(random[d]);
        }

        return time + tail;
    }

    function createNanoId() {
        var bytes = randomBytes(NANOID_LENGTH);
        var id = "";
        for (var i = 0; i < bytes.length; i++) {
            // Alphabet has exactly 64 characters, so masking keeps the result unbiased.
            id += NANOID_ALPHABET.charAt(bytes[i] & 63);
        }
        return id;
    }

    /* ---------- Formatting ---------- */

    function isUuidVersion(version) {
        return version === "v4" || version === "v7";
    }

    function usesBinaryEncoding(encoding) {
        return encoding === "base64" || encoding === "rfc7515";
    }

    function formatUuid(bytes, options) {
        if (options.encoding === "base64") {
            return bytesToBase64(bytes);
        }
        if (options.encoding === "rfc7515") {
            return bytesToBase64Url(bytes);
        }

        var hex = bytesToHex(bytes);
        var text = options.hyphens
            ? hex.substr(0, 8) + "-" + hex.substr(8, 4) + "-" + hex.substr(12, 4) + "-" + hex.substr(16, 4) + "-" + hex.substr(20, 12)
            : hex;

        if (options.uppercase) {
            text = text.toUpperCase();
        }
        if (options.braces) {
            text = "{" + text + "}";
        }
        if (options.encoding === "url") {
            text = encodeURIComponent(text);
        }
        return text;
    }

    function createOne(options) {
        switch (options.version) {
            case "v7":
                return formatUuid(createUuidV7Bytes(), options);
            case "ulid":
                return createUlid();
            case "nanoid":
                return createNanoId();
            default:
                return formatUuid(createUuidV4Bytes(), options);
        }
    }

    function clampCount(value) {
        var count = parseInt(value, 10);
        if (isNaN(count) || count < MIN_COUNT) {
            return MIN_COUNT;
        }
        return count > MAX_COUNT ? MAX_COUNT : count;
    }

    function generate(options) {
        var count = clampCount(options.count);
        var values = [];

        for (var i = 0; i < count; i++) {
            var value = createOne(options);
            if (options.quotes) {
                value = "\"" + value + "\"";
            }
            if (options.commas && i < count - 1) {
                value += ",";
            }
            values.push(value);
        }

        return values;
    }

    /* ---------- Clipboard ---------- */

    function copyWithFallback(textarea) {
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        var ok = false;
        try {
            ok = document.execCommand("copy");
        } catch (e) {
            ok = false;
        }
        return ok;
    }

    function copyText(text, textarea) {
        if (window.navigator.clipboard && window.isSecureContext) {
            return window.navigator.clipboard.writeText(text).then(
                function () { return true; },
                function () { return copyWithFallback(textarea); }
            );
        }
        return Promise.resolve(copyWithFallback(textarea));
    }

    /* ---------- UI ---------- */

    function initGenerator(root) {
        var output = root.querySelector("[data-oc-guid-output]");
        var outputHelp = root.querySelector("[data-oc-guid-output-help]");
        var copyButton = root.querySelector("[data-oc-guid-copy]");
        var copyLabel = root.querySelector("[data-oc-guid-copy-label]");
        var copyIcon = root.querySelector("[data-oc-guid-copy-icon]");
        var generateButton = root.querySelector("[data-oc-guid-generate]");
        var status = root.querySelector("[data-oc-guid-status]");
        var toggle = root.querySelector("[data-oc-guid-toggle]");
        var panel = root.querySelector("[data-oc-guid-panel]");
        var countInput = root.querySelector("[data-oc-guid-count]");
        var versionSelect = root.querySelector("[data-oc-guid-version]");
        var versionHelp = root.querySelector("[data-oc-guid-version-help]");
        var encodingSelect = root.querySelector("[data-oc-guid-encoding]");
        var optionInputs = root.querySelectorAll("[data-oc-guid-option]");
        var conditionalItems = root.querySelectorAll("[data-oc-guid-applies]");
        var statusTimer = null;

        if (!output || !copyButton || !generateButton) {
            return;
        }

        function readOptions() {
            var options = {
                count: countInput ? countInput.value : 1,
                version: versionSelect ? versionSelect.value : "v4",
                encoding: encodingSelect ? encodingSelect.value : "none"
            };

            for (var i = 0; i < optionInputs.length; i++) {
                var input = optionInputs[i];
                var item = input.closest("[data-oc-guid-applies]");
                // Hidden options never apply.
                options[input.getAttribute("data-oc-guid-option")] = input.checked && !(item && item.hidden);
            }

            if (!isUuidVersion(options.version)) {
                options.encoding = "none";
            }

            return options;
        }

        function updateVisibility() {
            var version = versionSelect ? versionSelect.value : "v4";
            var encoding = encodingSelect ? encodingSelect.value : "none";
            var isUuid = isUuidVersion(version);

            for (var i = 0; i < conditionalItems.length; i++) {
                var item = conditionalItems[i];
                var applies = item.getAttribute("data-oc-guid-applies");
                var show = applies === "uuid"
                    ? isUuid
                    : isUuid && !usesBinaryEncoding(encoding);
                item.hidden = !show;
            }

            if (versionHelp && VERSION_HELP[version]) {
                versionHelp.textContent = VERSION_HELP[version];
            }
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

        // A single value may wrap on small screens, so size the box to fit it.
        function fitSingleOutput() {
            if (!output.classList.contains("is-single")) {
                output.style.height = "";
                return;
            }
            output.style.height = "auto";
            output.style.height = (output.scrollHeight + 4) + "px";
        }

        function render(values) {
            var isSingle = values.length === 1;
            output.value = values.join("\n");
            output.classList.toggle("is-single", isSingle);
            output.rows = isSingle ? 1 : Math.min(values.length, 10);
            fitSingleOutput();

            if (copyLabel) {
                copyLabel.textContent = isSingle ? "Copy" : "Copy all";
            }
            if (outputHelp) {
                outputHelp.textContent = isSingle
                    ? "Your unique ID is ready. Click it, or click Copy, to copy it."
                    : values.length.toLocaleString() + " unique IDs are ready, one per line. Click the list, or click Copy all, to copy them.";
            }
        }

        function runGenerate() {
            if (countInput) {
                countInput.value = clampCount(countInput.value);
            }
            setStatus("");
            render(generate(readOptions()));
        }

        function setEnabled(enabled) {
            var controls = root.querySelectorAll("button, input, select");
            for (var i = 0; i < controls.length; i++) {
                controls[i].disabled = !enabled;
            }
            root.setAttribute("aria-busy", enabled ? "false" : "true");
        }

        function copyOutput(returnFocusToButton) {
            var text = output.value;
            if (!text || root.getAttribute("aria-busy") === "true") {
                return;
            }
            copyText(text, output).then(function (ok) {
                setStatus(ok ? "✔ Copied!" : "Copy did not work. Select the text above and press Ctrl+C (or Cmd+C).", !ok);
                if (returnFocusToButton) {
                    copyButton.focus();
                } else {
                    // Keep the value highlighted so it is clear what was copied.
                    output.select();
                }
            });
        }

        copyButton.addEventListener("click", function () {
            copyOutput(true);
        });

        generateButton.addEventListener("click", runGenerate);

        // Clicking into the result copies it, exactly like the Copy button.
        output.addEventListener("click", function () {
            copyOutput(false);
        });

        // Keyboard focus selects everything, so manual copying is easy too.
        output.addEventListener("focus", function () {
            output.select();
        });

        // DNN wraps the whole page in one <form>. Pressing Enter in a text or number
        // field would submit that form, so handle Enter here instead.
        root.addEventListener("keydown", function (event) {
            var target = event.target;
            if (event.key !== "Enter" || !target || target.tagName !== "INPUT") {
                return;
            }
            event.preventDefault();
            if (target === countInput) {
                runGenerate();
            }
        });

        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                var expanded = toggle.getAttribute("aria-expanded") === "true";
                toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
                panel.hidden = expanded;
            });
        }

        if (versionSelect) {
            versionSelect.addEventListener("change", updateVisibility);
        }
        if (encodingSelect) {
            encodingSelect.addEventListener("change", updateVisibility);
        }
        if (countInput) {
            countInput.addEventListener("blur", function () {
                countInput.value = clampCount(countInput.value);
            });
        }

        window.addEventListener("resize", fitSingleOutput);

        updateVisibility();

        if (!window.crypto || !window.crypto.getRandomValues) {
            output.value = "";
            if (outputHelp) {
                outputHelp.textContent = "Sorry, this browser cannot create secure random IDs. Please try a newer browser.";
            }
            return;
        }

        runGenerate();
        setEnabled(true);
    }

    function initAll() {
        var roots = document.querySelectorAll("[data-oc-guid-generator]");
        for (var i = 0; i < roots.length; i++) {
            if (roots[i].getAttribute("data-oc-guid-ready") === "true") {
                continue;
            }
            roots[i].setAttribute("data-oc-guid-ready", "true");
            initGenerator(roots[i]);
        }
    }

    // Expose the pure generator for testing and reuse.
    window.UpendoGuidGenerator = {
        generate: generate,
        clampCount: clampCount
    };

    // Wait until the page has fully loaded before generating and enabling the controls.
    if (document.readyState === "complete") {
        initAll();
    } else {
        window.addEventListener("load", initAll);
    }
})(window, document);
