( () => {
    var t = {
        545: t => {
            t.exports = class {
                constructor(t) {
                    this.settings = t,
                    this.button = this.settings.button,
                    this.form = this.settings.form,
                    this.array_divider = this.settings.array_divider,
                    this.apiUrl = this.settings.apiUrl,
                    this.activeFormID = null,
                    this.setListeners()
                }
                setListeners() {
                    this.button.addEventListener("click", (async t => {
                        if (this.disabled && t.preventDefault(),
                        this.activeFormID = this.getActiveFormID(),
                        Object.values(this.settings.classNames).forEach((e => {
                            this.button.classList.contains(e) && t.preventDefault()
                        }
                        )),
                        !t.defaultPrevented && this.activeFormID) {
                            this._toggleButtonState("loading", !0);
                            try {
                                const t = await this.makeRequest()
                                  , e = t.result;
                                if (t.error)
                                    throw {
                                        error: new Error(t.error),
                                        isCustom: !0
                                    };
                                if (!e || !e.length)
                                    throw {
                                        error: new Error(this.settings.loadingErrorNotice),
                                        isCustom: !0
                                    };
                                this.setList(e)
                            } catch (t) {
                                this.settings.onError && this.settings.onError(t.isCustom && t.error.message || t.message)
                            }
                            this._toggleButtonState("loading", !1)
                        }
                    }
                    ))
                }
                getActiveFormID() {
                    return "instant"
                }
                setList(t, e) {
                    this._toggleButtonState("success", !0),
                    this.settings.onSelect && this.settings.onSelect(t, e)
                }
                restoreState() {
                    this._toggleButtonState("loading", !1),
                    this._toggleButtonState("success", !1)
                }
                _toggleButtonState(t, e) {
                    this.button.classList.toggle(this.settings.classNames[t], e)
                }
                disable() {
                    this.disabled = !0,
                    this.button.disabled = !0
                }
                enable() {
                    this.disabled = !1,
                    this.button.disabled = !1
                }
                async makeRequest() {
                    let t = this.settings.resultsContainer.querySelectorAll(this.settings.selectors.itemTextInner);
                    t = Array.prototype.map.call(t, (t => t.innerText));
                    const e = TOOL_CONFIG.forms[this.activeFormID].request.url.split("/")
                      , s = this.form?.dataset?.successValue;
                    let i = null;
                    try {
                        let t = e.indexOf("wk")
                          , s = e.slice(t + 1).join("/");
                        s.startsWith("city-names") && (s = "fake-" + s),
                        i = "/" + s
                    } catch (t) {
                        return
                    }
                    s && (i += s.replace(this.array_divider, "-").replace(/\s/g, "-"));
                    const n = {
                        source: i,
                        options: t
                    };
                    return (await fetch(this.apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(n)
                    })).json()
                }
            }
        }
        ,
        301: t => {
            t.exports = class {
                constructor(t) {
                    this.settings = t,
                    this.form = this.settings.element,
                    this.resultsContainer = this.settings.resultsContainer,
                    this.button = this.form.querySelector(this.settings.selectors.button),
                    this.labels = this.form.querySelectorAll(this.settings.selectors.label),
                    this.xhr = new XMLHttpRequest,
                    this.fields = this.settings.fields,
                    this._setListeners(),
                    this._setAttributes()
                }
                _setListeners() {
                    this.settings.url ? (this.form.addEventListener("submit", (t => this._onSubmit.call(this, t))),
                    this.xhr.addEventListener("readystatechange", (t => this._onReadyStateChange.call(this, t)))) : this.form.addEventListener("submit", (t => this._onSubmitLocal.call(this, t))),
                    this.fields.forEach((t => {
                        let e = t.elem;
                        document.body.contains(e) && "select" != t.type && ((t.allowed || t.max_length || t.max_words) && (e.addEventListener("beforeinput", (e => this._onBeforeTextInput(e, t))),
                        e.addEventListener("input", (e => this._onInputTextInput(e, t)))),
                        e.addEventListener("input", ( () => {
                            e.closest(this.settings.selectors.label)?.classList.remove(this.settings.classNames.invalid)
                        }
                        )),
                        e.addEventListener("change", ( () => {
                            e.closest(this.settings.selectors.label)?.classList.remove(this.settings.classNames.invalid)
                        }
                        )))
                    }
                    ))
                }
                _validateFormOnSubmit(t) {
                    let e = !0;
                    this.form.querySelectorAll(".form__field").forEach((t => {
                        this.settings.trim && t.value.trim().match(this.validationSettings.validation) ? e = e && !0 : this.settings.trim || !t.value.match(this.validationSettings.validation) ? (t.dataset.invalid = !0,
                        e = !1) : e = e && !0
                    }
                    )),
                    e || (t.preventDefault(),
                    t.stopPropagation(),
                    this._setInvalidState(),
                    this.validationSettings?.specialErrorText ? new Notice(this.validationSettings.specialErrorText,"specialInput") : TOOL_CONFIG.notices.input && new Notice(TOOL_CONFIG.notices.input,"input"))
                }
                _setInvalidState() {
                    if (this.labels.forEach((t => {
                        let e = t.querySelector(this.settings.selectors.field);
                        e.dataset.invalid && (delete e.dataset.invalid,
                        t.classList.add(this.settings.classNames.invalid))
                    }
                    )),
                    this.form.classList.contains(this.settings.classNames.formAnimation))
                        return;
                    let t = function(e) {
                        "shake" == e.animationName && (this.form.classList.remove(this.settings.classNames.formAnimation),
                        this.form.removeEventListener("animationend", t))
                    }
                    .bind(this);
                    this.form.addEventListener("animationend", t),
                    this.form.classList.add(this.settings.classNames.formAnimation)
                }
                _setAttributes() {
                    let t = [];
                    this.labels.forEach((e => {
                        let s = e.querySelector("input, select");
                        s && t.push(s.value)
                    }
                    )),
                    this.form.dataset.lastValue = 1 == t.length ? t[0] : t.join(this.settings.array_divider),
                    this.form.dataset.successValue = this.form.dataset.lastValue,
                    this.successInitValue = this.form.dataset.successValue
                }
                _onSubmitLocal(t) {
                    let e = [];
                    if (t.preventDefault(),
                    this._formIsInvalid())
                        return;
                    let s = [];
                    this.labels.forEach((t => {
                        let i = t.querySelector("input, select");
                        if (i)
                            if ("checkbox" == i.type)
                                e.push(i.checked.toString());
                            else if ("radio" == i.type) {
                                if (s.includes(i.name))
                                    return;
                                let t = this.form.querySelector(`input[name='${i.name}']:checked`);
                                e.push(t.value || "false"),
                                s.push(i.name)
                            } else
                                e.push(i.value)
                    }
                    ));
                    let i = this.settings.action(e);
                    if (this.form.dataset.lastValue = 1 == e.length ? e[0] : e.join(this.settings.array_divider),
                    !i.length) {
                        if (!TOOL_CONFIG.notices)
                            return;
                        return void (TOOL_CONFIG.notices.empty ? new Notice(TOOL_CONFIG.notices.empty,"empty") : TOOL_CONFIG.notices.error && new Notice(TOOL_CONFIG.notices.error,"error"))
                    }
                    this.form.dataset.successValue = 1 == e.length ? e[0] : e.join(this.settings.array_divider);
                    let n = document.querySelector("button[data-page]");
                    n && (n.dataset.page = 0),
                    this.settings.showUniqueOnly && (i = [...new Set(i)]),
                    i = i.filter(Boolean),
                    this._updateResults(i)
                }
                _onSubmit(t) {
                    t.preventDefault();
                    let e = this.settings && this.settings.url ? this.settings.url : this.form.action;
                    if (this._formIsInvalid())
                        return;
                    let s = null;
                    if ("json" == this.settings.composer_type)
                        s = this.settings.composer(this.form),
                        s = JSON.stringify(s),
                        this.form.dataset.lastValue = s,
                        this.xhr.addEventListener("load", ( () => this._onDataRecieve(this.form.dataset.lastValue)), {
                            once: !0
                        });
                    else {
                        let t = [];
                        this.labels.forEach((e => {
                            let s = e.querySelector("input, select").value;
                            this.settings.trim && (s = s.trim()),
                            t.push(s)
                        }
                        )),
                        this.form.dataset.lastValue = 1 == t.length ? t[0] : t.join(this.settings.array_divider),
                        this.settings.more_url && this.form.dataset.lastValue == this.successInitValue ? e = this.settings.more_url : this.settings.url && this.settings.composer && (e = this.settings.composer(e, 1 == t.length ? t[0] : t)),
                        this.xhr.addEventListener("load", ( () => this._onDataRecieve(this.form.dataset.lastValue)), {
                            once: !0
                        })
                    }
                    this.button.matches("[class*=button--gradient]") ? this.button.classList.add("button--state--processing") : (this.button.classList.add("button--loading"),
                    this.button.classList.add("button--prevent")),
                    this.xhr.open(this.form.method, e, !0),
                    this.xhr.send(s)
                }
                _onInputTextInput(t, e) {
                    let s = t.target
                      , i = e.allowed
                      , n = e.max_length
                      , o = e.max_words;
                    if (!i.test(s.value)) {
                        let t = s.selectionStart
                          , e = 0;
                        s.value = s.value.split("").filter((function(s, n) {
                            let o = s.match(i);
                            return n < t && !o && e++,
                            o && o.length && o[0]
                        }
                        )).join(""),
                        s.selectionStart = t - e,
                        s.selectionEnd = s.selectionStart
                    }
                    n && n < s.value.length && (s.value = s.value.slice(0, n),
                    TOOL_CONFIG.notices && TOOL_CONFIG.notices.max_length && new Notice(TOOL_CONFIG.notices.max_length,"max_length")),
                    o && o < s.value.split(" ").length && (s.value = s.value.split(" ").slice(0, o).join(" "),
                    TOOL_CONFIG.notices && TOOL_CONFIG.notices.max_length && new Notice(TOOL_CONFIG.notices.max_length,"max_length"))
                }
                _onBeforeTextInput(t, e) {
                    let s = t.data
                      , i = t.target
                      , n = i.value
                      , o = e.allowed
                      , r = e.max_length
                      , a = e.max_words;
                    if (null === s)
                        return;
                    o && !o.test(s) && (s = s.split("").filter((function(t) {
                        let e = t.match(o);
                        return e && e.length && e[0]
                    }
                    )).join(""),
                    s.length || t.preventDefault(),
                    t.data.length != s.length && TOOL_CONFIG.notices && TOOL_CONFIG.notices.rules && new Notice(TOOL_CONFIG.notices.rules,"rules"));
                    let l = i.selectionEnd - i.selectionStart
                      , c = n.length - l + s.length;
                    r && r < c && (t.preventDefault(),
                    TOOL_CONFIG.notices && TOOL_CONFIG.notices.max_length && new Notice(TOOL_CONFIG.notices.max_length,"max_length")),
                    a && s.match(/\s/) && a <= n.split(" ").length && (t.preventDefault(),
                    TOOL_CONFIG.notices && TOOL_CONFIG.notices.max_length && new Notice(TOOL_CONFIG.notices.max_length,"max_length"))
                }
                _onDataRecieve(t) {
                    if (this._isEmptyResponse())
                        return;
                    let e = document.querySelector("button[data-page]");
                    e && (e.dataset.page = 0),
                    t && (this.form.dataset.successValue = t),
                    this.settings?.onSuccessLoad?.call()
                }
                _isEmptyResponse() {
                    let t = this.xhr?.response;
                    try {
                        if (t = JSON.parse(t),
                        t.error)
                            throw new Error(t.error);
                        if (Array.isArray(t)) {
                            if (!t.length)
                                throw new Error("Error")
                        } else if (t.result) {
                            if (Array.isArray(t.result)) {
                                if (!t.result.length)
                                    throw new Error("Error")
                            } else if (t.result.hasOwnProperty("nicknames") && !t.result.nicknames.length)
                                throw new Error("Error")
                        } else if (!t.titles)
                            throw new Error("Error")
                    } catch (t) {
                        return !0
                    }
                    return !1
                }
                _formIsInvalid() {
                    let t = !1;
                    if (this.labels.forEach((e => {
                        (t || e.classList.contains(this.settings.classNames.invalid)) && (t = !0)
                    }
                    )),
                    t)
                        return this._setInvalidState(),
                        !0
                }
                _onReadyStateChange() {
                    if (4 != this.xhr.readyState)
                        return;
                    this.button.classList.remove("button--prevent"),
                    this.button.classList.remove("button--loading"),
                    this.button.classList.remove("button--state--processing");
                    let t = null;
                    try {
                        if (this.xhr.status < 200 || this.xhr.status >= 300)
                            throw new Error(TOOL_CONFIG.notices?.error);
                        let e = JSON.parse(this.xhr.response);
                        if (e.error)
                            throw new Error(e.error);
                        let s = this.form.dataset?.lastValue.split(this.settings.array_divider) || "";
                        if (t = this.settings.parser(this.xhr.response, s),
                        !t)
                            throw new Error(TOOL_CONFIG.notices?.error);
                        if (!t.length)
                            throw new Error(TOOL_CONFIG.notices?.empty)
                    } catch (t) {
                        let e = t.message || TOOL_CONFIG.notices?.error;
                        return e && new Notice(e,"error"),
                        void this.settings?.onError?.call(this, t)
                    }
                    this.settings.showUniqueOnly && (t = [...new Set(t)]),
                    t = t.filter(Boolean),
                    this._updateResults(t)
                }
                _updateResults(t) {
                    let e = document.querySelector(".results-header__counter-highlight")
                      , s = document.querySelector(".results-header__counter-label");
                    e && (e.innerText = e.dataset.value),
                    s && (s.innerText = s.dataset.label),
                    "undefined" != typeof RESULTS_PAGINATOR && RESULTS_PAGINATOR ? (this.resultsContainer.classList.contains("results--hidden") && this.resultsContainer.querySelectorAll(".result--hidden").forEach((t => {
                        t.classList.remove("result--hidden")
                    }
                    )),
                    RESULTS_PAGINATOR.update({
                        data: t,
                        noAnim: this.resultsContainer.classList.contains("results--hidden")
                    })) : RESULTS_UPDATER.updateElements({
                        data: t,
                        noAnim: this.resultsContainer.classList.contains("results--hidden"),
                        push_new: !1,
                        aiHighlight: "smart" == this.form.dataset?.type
                    }),
                    "undefined" != typeof TOOL_DATA && (TOOL_DATA = t),
                    e && "undefined" != typeof RESULTS_PAGINATOR && (e.innerText = t.length),
                    this.resultsContainer.classList.remove("results--hidden")
                }
            }
        }
        ,
        600: t => {
            t.exports = class {
                constructor(t) {
                    this.settings = t,
                    document.addEventListener("click", (t => this.handleClick(t)))
                }
                handleClick(t) {
                    const e = t.target.closest(this.settings.selectors.button);
                    if (!e)
                        return;
                    const s = e.closest(this.settings.selectors.textOuter)
                      , i = s && s.querySelector(this.settings.selectors.text)
                      , n = i && i.innerText;
                    let o = !1;
                    try {
                        o = e.matches(":focus-visible")
                    } catch (t) {
                        o = e.matches(".focus-visible")
                    }
                    n ? this.copyToClipboard(n, e, ( () => {
                        o && e.focus()
                    }
                    )) : this.onCopyFn(e, ( () => {
                        o && e.focus()
                    }
                    ), "error")
                }
                copyToClipboard(t, e, s) {
                    const i = document.createElement("textarea");
                    i.value = t,
                    i.setAttribute("readonly", !0),
                    i.style.top = "0",
                    i.style.left = "0",
                    i.style.fontSize = "16px",
                    i.style.opacity = "0",
                    i.style.pointerEvents = "none",
                    i.style.position = "fixed",
                    document.body.appendChild(i),
                    i.focus(),
                    i.select();
                    try {
                        document.execCommand("copy") ? this.onCopyFn(e, s, "success") : this.onCopyFn(e, s, "error")
                    } catch (t) {
                        this.onCopyFn(e, s, "error")
                    }
                    document.body.removeChild(i)
                }
                onCopyFn(t, e, s) {
                    t.dataset.status = TOOL_CONFIG.copy[s],
                    requestAnimationFrame(( () => {
                        t.classList.add(this.settings.classes.completed),
                        setTimeout(( () => {
                            t.classList.remove(this.settings.classes.completed)
                        }
                        ), 1e3)
                    }
                    )),
                    e && e()
                }
            }
        }
        ,
        354: t => {
            t.exports = class {
                constructor(t) {
                    this.settings = t,
                    this.selects = document.querySelectorAll(this.settings.selectors.select),
                    this.initSelects()
                }
                initSelects() {
                    Array.prototype.forEach.call(this.selects, this.initSelect.bind(this))
                }
                initSelect(t) {
                    const e = customSelect(t, this.settings.customSelectOptions)
                      , s = e[0].container
                      , i = e[0].panel
                      , n = e[0].opener
                      , o = (t.dataset.class || "").split(" ")
                      , r = t.getAttribute("placeholder");
                    n.setAttribute("aria-label", "Toggle select-box"),
                    i.setAttribute("aria-label", "Select option"),
                    s.addEventListener("custom-select:open", (t => {
                        const e = t.target.closest(this.settings.selectors.outer);
                        if (!e)
                            return;
                        const s = e.getBoundingClientRect();
                        e.style.width = `${s.width}px`,
                        e.style.flexShrink = 0,
                        e.classList.add(this.settings.classes.open),
                        n.classList.add(this.settings.classes.openerActive)
                    }
                    )),
                    s.addEventListener("custom-select:close", (t => {
                        const s = t.target.closest(this.settings.selectors.outer);
                        if (!s)
                            return;
                        const i = e[0].panel;
                        i.addEventListener("transitionend", (function t(e) {
                            e.target === i && "opacity" === e.propertyName && (i.removeEventListener("transitionend", t),
                            s.style.removeProperty("width"),
                            s.style.removeProperty("flex-shrink"))
                        }
                        )),
                        n.classList.remove(this.settings.classes.openerActive),
                        s.classList.remove(this.settings.classes.open)
                    }
                    )),
                    i.insertAdjacentHTML("beforeend", `<div class='${this.settings.customSelectOptions.panelClass}-inner ss-relative' ss-container></div>`);
                    const a = i.lastElementChild;
                    for (; i.children.length > 1; )
                        a.appendChild(i.firstElementChild);
                    r && (n.querySelector("span").innerText = r,
                    n.classList.add(this.settings.customSelectOptions.openerPlaceholderClass),
                    t.value = "",
                    a.firstElementChild.classList.remove(this.settings.customSelectOptions.isSelectedClass)),
                    t.addEventListener("change", ( () => {
                        n.classList.remove(this.settings.customSelectOptions.openerPlaceholderClass)
                    }
                    )),
                    o.filter((t => t.length)).forEach((t => s.classList.add(t)))
                }
            }
        }
        ,
        123: t => {
            t.exports = class {
                constructor(t, e) {
                    this.elem = t,
                    this.input = e.input,
                    this.onClick = e.onClick || this.defaultOnClick.bind(this),
                    this.toggleEraser(),
                    "select" !== e.type && this.input.addEventListener("input", ( () => this.toggleEraser())),
                    this.elem.addEventListener("click", ( () => {
                        this.onClick(),
                        this.toggleEraser()
                    }
                    ))
                }
                defaultOnClick() {
                    this.input.value = "",
                    this.input.focus()
                }
                toggleEraser() {
                    this.elem.classList[this.input.value.length > 0 ? "add" : "remove"]("input-text__erase--visible")
                }
            }
        }
        ,
        923: t => {
            t.exports = class {
                constructor(t, e) {
                    this.config = t,
                    this.toolConfig = e,
                    this.form = document.querySelector(this.config.selectors.form),
                    this.form && this.toolConfig?.forms?.instant?.fields?.length && (this.instantConfig = this.toolConfig.forms.instant,
                    this.setupFields(),
                    this.form.addEventListener("submit", (t => this.validationOnSubmit(t, this.instantConfig.fields)), !0))
                }
                setupFields() {
                    this.instantConfig.fields.forEach((t => {
                        if (!t.elem)
                            return;
                        let e = {
                            allowed: t.allowed,
                            validation: t.validation,
                            trim: t.trim,
                            max_length: t.max_length,
                            max_words: t.max_words,
                            isTextInput: t.elem.matches(this.config.selectors.textInput)
                        }
                          , s = t.elem;
                        e.allowed && s.addEventListener("input", (t => this.checkAllowedOnInput(t, e))),
                        e.allowed && s.addEventListener("beforeinput", (t => this.checkAllowedBeforeInput(t, e))),
                        e.validation && s.addEventListener("input", (t => this.validationOnInput(t, e)))
                    }
                    ))
                }
                checkAllowedBeforeInput(t, e) {
                    let s = t.target.value
                      , i = t.data;
                    if (null === i)
                        return;
                    e.allowed && !e.allowed.test(i) && (i = i.split("").filter((t => e.allowed.test(t))).join(""),
                    i.length || t.preventDefault(),
                    t.data.length != i.length && this.showNotice(this.toolConfig.notices?.rules, "rules"));
                    let n = t.target.selectionEnd - t.target.selectionStart
                      , o = s.length - n + i.length;
                    (e.max_length && e.max_length < o || e.max_words && i.match(/\s/) && e.max_words <= s.split(" ").length) && (t.preventDefault(),
                    this.showNotice(this.toolConfig.notices?.max_length, "max_length"))
                }
                checkAllowedOnInput(t, e) {
                    let s = t.target;
                    if (!e.allowed.test(s.value)) {
                        let t = s.selectionStart
                          , i = 0;
                        s.value = s.value.split("").filter(( (s, n) => {
                            let o = e.allowed.test(s);
                            return n < t && !o && i++,
                            o
                        }
                        )).join(""),
                        s.selectionStart = t - i,
                        s.selectionEnd = s.selectionStart
                    }
                    e.max_length && e.max_length < s.value.length && (s.value = s.value.slice(0, e.max_length),
                    this.showNotice(this.toolConfig.notices?.max_length, "max_length")),
                    e.max_words && e.max_words < s.value.split(" ").length && (s.value = s.value.split(" ").slice(0, e.max_words).join(" "),
                    this.showNotice(this.toolConfig.notices?.max_length, "max_length"))
                }
                validationOnInput(t, e) {
                    let s = t.target.closest(this.config.selectors.label);
                    s && s.classList.remove(this.config.classes.invalid)
                }
                validationOnSubmit(t, e) {
                    let s = !0;
                    e.forEach((t => {
                        let e = t.elem
                          , i = e.value;
                        t.trim && (i = i.trim()),
                        t.validation && !t.validation.test(i) ? (e.dataset.invalid = !0,
                        s = !1) : s = s && !0
                    }
                    )),
                    s || (t.preventDefault(),
                    t.stopPropagation(),
                    this.setInvalidState(),
                    this.showNotice(this.toolConfig.notices?.input, "input"))
                }
                setInvalidState() {
                    this.form.querySelectorAll(this.config.selectors.input).forEach((t => {
                        let e = t.querySelector(this.config.selectors.textInput);
                        e && e.dataset.invalid && (delete e.dataset.invalid,
                        t.classList.add(this.config.classes.invalid))
                    }
                    )),
                    this.form.addEventListener("animationend", (t => {
                        t.animationName === this.config.animationName && this.form.classList.remove(this.config.classes.formAnimation)
                    }
                    )),
                    this.form.classList.contains(this.config.classes.formAnimation) || this.form.classList.add(this.config.classes.formAnimation)
                }
                showNotice(t, e) {
                    t && new Notice(t,e)
                }
            }
        }
        ,
        559: t => {
            t.exports = class {
                constructor(t) {
                    this.settings = t,
                    this.label = this.settings.label,
                    this.resizeSpan = this.settings.resizeSpan,
                    this.textarea = this.label.querySelector("textarea"),
                    this.textareaWasFocused = !1,
                    this.init()
                }
                init() {
                    this.resizeSpan.addEventListener("pointerdown", this.onPointerDown.bind(this))
                }
                onPointerDown(t) {
                    t.preventDefault(),
                    this.textareaWasFocused = this.textareaIsFocused(),
                    this.startY = t.clientY,
                    this.startHeight = parseInt(document.defaultView.getComputedStyle(this.label).height, 10),
                    this.resizeSpan.classList.add(this.settings.classes.active),
                    this.onPointerMoveBound = this.onPointerMove.bind(this),
                    this.onPointerUpBound = this.onPointerUp.bind(this),
                    this.settings?.onStart?.call(this),
                    document.documentElement.addEventListener("pointermove", this.onPointerMoveBound),
                    document.documentElement.addEventListener("pointerup", this.onPointerUpBound)
                }
                onPointerMove(t) {
                    const e = t.clientY - this.startY;
                    this.label.style.height = `${this.startHeight + e}px`
                }
                onPointerUp(t) {
                    t.stopPropagation(),
                    document.documentElement.removeEventListener("pointermove", this.onPointerMoveBound),
                    document.documentElement.removeEventListener("pointerup", this.onPointerUpBound),
                    this.resizeSpan.classList.remove(this.settings.classes.active),
                    this.settings?.onEnd?.call(this),
                    requestAnimationFrame(( () => {
                        if (this.textareaIsFocused() && !this.textareaWasFocused) {
                            const t = window.scrollY;
                            this.textarea.blur(),
                            window.scrollTo(window.scrollX, t)
                        }
                    }
                    ))
                }
                textareaIsFocused() {
                    return document.activeElement === this.textarea
                }
            }
        }
        ,
        390: t => {
            class e {
                constructor(t) {
                    this.config = t,
                    this.sample = e.getTemplate(t.templateId),
                    this.lifeTime = t.lifeTime || 10,
                    this.notices = {}
                }
                static getTemplate(t) {
                    let e = document.getElementById(t);
                    if (!e)
                        return;
                    let s = e.innerHTML;
                    e.parentNode.removeChild(e);
                    let i = document.createElement("div");
                    return i.innerHTML = s,
                    i.firstElementChild
                }
                createNoticeClass() {
                    const t = this;
                    return class {
                        constructor(e, s) {
                            this.visible = !1,
                            this.id = s,
                            this.elem = this.create(e, s),
                            this.ul = document.querySelector(t.config.selectors.noticeContainer) || this.createNoticeContainer(),
                            this.hideTimeout = null,
                            s && t.notices[s] ? t.notices[s].attract() : (this.append(),
                            this.startHideTimeout(),
                            s && (t.notices[s] = this))
                        }
                        create(e, s) {
                            let i = t.sample.cloneNode(!0)
                              , n = i.querySelector(t.config.selectors.text)
                              , o = i.querySelector(t.config.selectors.close);
                            return n.innerHTML = e,
                            o && o.addEventListener("click", ( () => this.hide())),
                            s && (i.dataset.id = s),
                            i
                        }
                        createNoticeContainer() {
                            let e = document.createElement("ul");
                            return e.classList.add(t.config.classes.noticeContainer),
                            document.body.appendChild(e),
                            e
                        }
                        append() {
                            const e = this.ul
                              , s = this.elem;
                            e.children.length ? e.insertBefore(s, e.children[0]) : e.appendChild(s),
                            requestAnimationFrame(( () => {
                                let e = s.firstElementChild;
                                s.style.height = e.offsetHeight + "px",
                                s.addEventListener("transitionend", this.transitionend.bind(this)),
                                s.classList.add(t.config.classes.visible)
                            }
                            ))
                        }
                        startHideTimeout() {
                            this.hideTimeout = setTimeout(( () => this.hide()), 1e3 * t.lifeTime)
                        }
                        attract() {
                            const e = this.elem;
                            e.addEventListener("animationend", (function(s) {
                                s.animationName === t.config.attractAnimationName && e.classList.remove(t.config.classes.attract)
                            }
                            )),
                            this.visible && e.classList.contains(t.config.classes.attract) || e.classList.add(t.config.classes.attract),
                            clearTimeout(this.hideTimeout),
                            this.startHideTimeout()
                        }
                        hide() {
                            const e = this.elem;
                            clearTimeout(this.hideTimeout),
                            e && document.body.contains(e) && (e.addEventListener("transitionend", (function(t) {
                                if ("height" !== t.propertyName || t.target !== this)
                                    return;
                                let e = this.parentNode;
                                e.removeChild(this),
                                e.children.length || e.parentNode.removeChild(e)
                            }
                            )),
                            delete e.dataset.id,
                            this.visible = !1,
                            e.classList.remove(t.config.classes.visible),
                            e.style.removeProperty("height"),
                            delete t.notices[this.id])
                        }
                        transitionend(t) {
                            "transform" === t.propertyName && (this.visible = !0,
                            this.elem.removeEventListener("transitionend", this.transitionend.bind(this)))
                        }
                    }
                }
            }
            t.exports = e
        }
        ,
        57: t => {
            t.exports = new class {
                _templates = {};
                constructor() {
                    document.body.querySelectorAll("script[data-template='script']").forEach((t => {
                        this._append(t),
                        t.remove()
                    }
                    ))
                }
                _append(t) {
                    this._templates[t.id] = this._getTemplateInfo(t)
                }
                _getTemplateInfo(t) {
                    const e = {
                        id: t.id,
                        scriptElement: t,
                        content: t.textContent
                    };
                    return e.element = this._getNodeFromString(e.content),
                    e.elements = this._decompose(e.element.cloneNode(!0)),
                    e
                }
                _decompose(t, e) {
                    e = e || {};
                    let s = t.dataset.tid || "root";
                    return t.querySelectorAll(":scope > [data-tid]").forEach((t => this._decompose(t, e))),
                    delete t.dataset.tid,
                    e[s] = t,
                    t.remove(),
                    e
                }
                _getNodeFromString(t) {
                    let e = document.createElement("div");
                    return e.innerHTML = t,
                    e.children[0]
                }
                get(t) {
                    return this._templates[t] || null
                }
            }
        }
        ,
        743: (t, e, s) => {
            const i = s(57).get("pagi-template");
            t.exports = class {
                page = 1;
                constructor(t) {
                    let e = document.querySelector(`[data-slot='${t.slot}']`);
                    e && (this.init = !0,
                    this.settings = t,
                    this.element = this._createElement("list"),
                    e.parentNode.insertBefore(this.element, e),
                    e.remove(),
                    this.pagesCount = Math.ceil(this.settings.data.length / this.settings.items_per_page),
                    this.prevButton = this._createElement("item", "prev-button"),
                    this.nextButton = this._createElement("item", "next-button"),
                    this.element.appendChild(this.prevButton),
                    this.element.appendChild(this.nextButton),
                    this._setPage({
                        index: this.pageIndex,
                        ignoreList: !0
                    }),
                    this._setClickListener())
                }
                _createElement() {
                    const t = i.elements
                      , e = arguments[0];
                    let s = t[e];
                    return s ? (s = s.cloneNode(!0),
                    arguments.length > 1 && s.appendChild(this._createElement.apply(this, Object.values(arguments).slice(1))),
                    s) : document.createTextNode(e || "")
                }
                _setClickListener() {
                    const t = this.settings.selectors.control;
                    this.element.addEventListener("click", (e => {
                        const s = e.target.closest(t.button);
                        if (!s)
                            return;
                        e.preventDefault();
                        let i = +s.innerText;
                        s.matches(t.prev) ? i = this.pageIndex - 1 : s.matches(t.next) && (i = this.pageIndex + 1),
                        this._setPage({
                            index: i
                        })
                    }
                    ))
                }
                _setPage(t) {
                    let e = t.index || 0
                      , s = t.ignoreList || !1
                      , i = t.updateColumnCount || !1;
                    this.pageIndex = e > this.pagesCount ? this.pagesCount : e < 1 ? 1 : e,
                    s ? this._rearrangeButtons() : this.settings.updater && (this.settings.updater.updateElements({
                        data: this.settings.data,
                        from: (this.pageIndex - 1) * this.settings.items_per_page,
                        length: this.settings.items_per_page,
                        noAnim: !0,
                        updateColumnCount: i
                    }),
                    this._rearrangeButtons(),
                    this.settings.onChange && this.settings.onChange(this.pageIndex))
                }
                update(t) {
                    Object.assign(this.settings, t),
                    this.settings.onBeforeInit && this.settings.onBeforeInit(),
                    this.pagesCount = Math.ceil(this.settings.data.length / this.settings.items_per_page),
                    this._setPage({
                        index: 1,
                        updateColumnCount: this.settings.updateColumnCount
                    }),
                    this._rearrangeButtons()
                }
                _rearrangeButtons() {
                    this.prevButton.firstElementChild.disabled = 1 == this.pageIndex,
                    this.nextButton.firstElementChild.disabled = this.pageIndex == this.pagesCount;
                    let t = this.element.querySelectorAll(this.settings.selectors.control.item)
                      , e = [1, this.pagesCount];
                    for (let e = 1, s = t.length - 1; e < s; e++)
                        t[e].remove();
                    if (1 == this.pagesCount)
                        return e.shift(),
                        void s.call(this);
                    if (this.pagesCount <= 7) {
                        for (let t = 2; t < this.pagesCount; t++)
                            i(t);
                        s.call(this)
                    } else {
                        if (this.pageIndex - 1 > 3)
                            i(0, !0);
                        else
                            for (let t = 2; t <= Math.min(5, this.pagesCount - 1); t++)
                                i(t);
                        if (this.pagesCount - this.pageIndex > 3)
                            1 != this.pageIndex && i(this.pageIndex - 1),
                            i(this.pageIndex),
                            i(this.pageIndex + 1),
                            i(0, !0);
                        else
                            for (let t = this.pagesCount - 4; t <= this.pagesCount - 1; t++)
                                i(t);
                        s.call(this)
                    }
                    function s() {
                        for (let t = 0, s = e.length; t < s; t++) {
                            let s = e[t]
                              , i = ["item", s ? "button" : "ellipsis", s]
                              , n = this._createElement.apply(this, i);
                            s == this.pageIndex && n.firstElementChild.classList.add(this.settings.classList.control.active),
                            this.element.insertBefore(n, this.nextButton)
                        }
                    }
                    function i(t, s) {
                        (-1 == e.indexOf(t) || s) && e.splice(-1, 0, t)
                    }
                }
            }
        }
        ,
        98: (t, e, s) => {
            const i = s(696)
              , n = new class {
                constructor() {
                    this.elem = document.body,
                    this.media = window.matchMedia("(max-width:834px)"),
                    this.disabled = !1,
                    this.media.addEventListener("change", ( () => {
                        this.media.matches || this.enable()
                    }
                    ))
                }
                disable(t) {
                    window.innerWidth > 834 && !t || (this.elem.style.overflow = "hidden",
                    this.elem.style.top = `-${window.pageYOffset}px`,
                    this.elem.style.position = "fixed",
                    this.elem.style.width = "100%",
                    this.disabled = !0)
                }
                enable(t) {
                    const e = +window.getComputedStyle(this.elem).getPropertyValue("top").slice(1, -2);
                    this.elem.style.removeProperty("overflow"),
                    this.elem.style.removeProperty("position"),
                    this.elem.style.removeProperty("top"),
                    this.elem.style.removeProperty("width"),
                    document.firstElementChild.style.scrollBehavior = "auto",
                    isNaN(e) || window.scrollTo(0, e),
                    document.firstElementChild.style.removeProperty("scroll-behavior"),
                    this.disabled = !1
                }
            }
            ;
            t.exports = class {
                constructor() {
                    this.templates = {
                        outer: this.getTemplateById("popup-template"),
                        fav: this.getTemplateById("saved-template")
                    },
                    this.lastFocused = document.body,
                    this.focusVisible = !1,
                    document.addEventListener("click", (t => this.handleDocumentClick(t))),
                    document.addEventListener("keydown", (t => this.handleDocumentKeydown(t)))
                }
                handleDocumentClick(t) {
                    const e = t.target
                      , s = e.closest(".popup")
                      , i = e.closest("button.popup__close")
                      , n = e.closest("[data-popup]");
                    if (e === s || i)
                        this.closePopup(s);
                    else if (n) {
                        t.preventDefault();
                        const e = n.dataset.popup && document.querySelector(".popup--" + n.dataset.popup);
                        "" === n.dataset.popup ? n.dataset.popupDisabled || this.loadPopup(n) : e ? this.closePopup(e) : this.openPopup({
                            mod: n.dataset.popup,
                            name: n.dataset.popupTitle,
                            content: "saved" === n.dataset.popup ? this.generateSavedContent() : document.createElement("div")
                        })
                    }
                }
                handleDocumentKeydown(t) {
                    27 === t.keyCode && document.querySelectorAll(".popup").forEach((t => {
                        t.getAttribute("data-esc-prevent") || this.closePopup(t)
                    }
                    ))
                }
                closePopup(t) {
                    t.addEventListener("transitionend", (e => this.onHide(e, t))),
                    t.classList.add("popup--hidden"),
                    document.querySelector(".page__header").classList.remove("header--opaque"),
                    n.disabled && n.enable(),
                    this.focusVisible && this.lastFocused ? this.lastFocused.focus() : document.activeElement.blur()
                }
                onHide(t, e) {
                    t.target.matches(".popup__inner") && "opacity" === t.propertyName && e.parentNode.removeChild(e)
                }
                generateSavedContent() {
                    const t = JSON.parse(localStorage.getItem("saved")) || {}
                      , e = document.createElement("div");
                    e.innerHTML = this.templates.fav;
                    for (const e in t)
                        t[e].values.length || delete t[e];
                    const s = e.querySelector("[data-slot='text-outer']")
                      , i = s.cloneNode(!0)
                      , n = e.querySelector("[data-slot='category']");
                    s.parentNode.removeChild(s);
                    const o = n.cloneNode(!0);
                    for (const e in t) {
                        const s = o.cloneNode(!0)
                          , r = t[e].values;
                        s.querySelector("[data-slot='title']").innerHTML = t[e].name || e,
                        r.forEach((t => {
                            const n = i.cloneNode(!0);
                            n.dataset.key = e,
                            n.dataset.value = t,
                            n.querySelector("[data-slot='text']").innerHTML = t,
                            s.querySelector("[data-slot='content']").appendChild(n)
                        }
                        )),
                        n.parentNode.insertBefore(s, n)
                    }
                    return n.parentNode.removeChild(n),
                    e.querySelectorAll("[data-slot]").forEach((t => {
                        delete t.dataset.slot
                    }
                    )),
                    e.firstElementChild
                }
                openPopup(t) {
                    this.lastFocused = document.activeElement;
                    try {
                        this.focusVisible = this.lastFocused.matches(":focus-visible")
                    } catch {
                        this.focusVisible = this.lastFocused.matches(".focus-visible")
                    }
                    let e = document.createElement("div");
                    e.innerHTML = this.templates.outer,
                    e = e.firstElementChild,
                    t.mod && e.classList.add("popup--" + t.mod),
                    e.querySelector(".popup__title").innerText = t.name,
                    t.template ? e.querySelector(".popup__content").innerHTML = t.template : t.content && e.querySelector(".popup__content").appendChild(t.content),
                    document.body.appendChild(e);
                    const s = e.querySelector("button,input,a");
                    if (s) {
                        s.focus();
                        try {
                            s.matches(":focus-visible") && document.activeElement.blur()
                        } catch {}
                    }
                    const o = e.querySelector("[ss-container]:not(.ss-container)");
                    n.disable(),
                    "undefined" != typeof SimpleScrollbar && o && o.children.length && SimpleScrollbar.initEl(o),
                    setTimeout(( () => {
                        e.classList.remove("popup--hidden"),
                        document.querySelector(".page__header").classList.add("header--opaque")
                    }
                    ), 50);
                    const r = document.querySelector(".menu")
                      , a = document.querySelector("#menu-button");
                    r && r.classList.contains("menu--visible") && a && a.click();
                    const l = new i("saved",e)
                      , c = new i("confirm",e);
                    l.hide(),
                    c.hide(),
                    "saved" === t.mod && (l.show(),
                    document.addEventListener("confirm:show", ( () => {
                        c.show()
                    }
                    )),
                    document.addEventListener("confirm:hide", ( () => {
                        c.hide()
                    }
                    )),
                    window.updateCounter?.call(window))
                }
                loadPopup(t) {
                    const e = t.href
                      , s = new XMLHttpRequest;
                    s.open("GET", e, !0),
                    t.dataset.popupDisabled = !0,
                    s.addEventListener("readystatechange", ( () => {
                        if (4 === s.readyState)
                            if (delete t.dataset.popupDisabled,
                            s.status >= 200 && s.status < 300) {
                                let e = s.responseText
                                  , i = e.indexOf("<body>")
                                  , n = e.indexOf("</body>");
                                i = -1 === i ? 0 : i + 6,
                                n = -1 === n ? e.length : n;
                                const o = document.createElement("div");
                                o.innerHTML = e.slice(i, n);
                                let r = "";
                                r = t.dataset.popupSelector ? o.querySelector(t.dataset.popupSelector).innerHTML || "" : o.innerHTML,
                                r && this.openPopup({
                                    mod: t.dataset.popupMod,
                                    name: t.dataset.popupTitle || t.innerText,
                                    template: r
                                })
                            } else
                                TOOL_CONFIG.notices?.error && new Notice(TOOL_CONFIG.notices.error,"error")
                    }
                    )),
                    s.send()
                }
                getTemplateById(t) {
                    const e = document.getElementById(t)
                      , s = e.innerText;
                    return e.parentNode.removeChild(e),
                    s
                }
            }
        }
        ,
        61: t => {
            t.exports = class {
                constructor(t) {
                    this.settings = t,
                    this.container = document.querySelector(this.settings.selectors.container),
                    this.eventShowConfirm = new Event("confirm:show"),
                    this.eventHideConfirm = new Event("confirm:hide"),
                    document.addEventListener("change", (t => this.onDocumentChange(t))),
                    document.addEventListener("click", (t => this.onDocumentClick(t))),
                    document.addEventListener("keydown", (t => {
                        27 === t.keyCode && this.toggleConfirm(!1)
                    }
                    ))
                }
                closestTarget(t, e) {
                    return t.closest(this.settings.selectors[e])
                }
                isSpecialBrowser() {
                    return /FxiOS|CriOS|OPT\//.test(navigator.userAgent)
                }
                onDocumentChange(t) {
                    const e = t.target;
                    if (e.matches(this.settings.selectors.resultInput)) {
                        e.checked ? this.saveItem(e.dataset.text) : this.removeItem(this.settings.storageKey, e.dataset.text);
                        try {
                            e.matches(":focus-visible") || e.blur()
                        } catch (t) {}
                        this.updateElements()
                    }
                }
                onDocumentClick(t) {
                    let e = e => this.closestTarget(t.target, e);
                    const s = e("eraseButton")
                      , i = e("restoreButton")
                      , n = e("downloadButton");
                    if (e("savedBlock")) {
                        if (t.preventDefault(),
                        s || i) {
                            const e = this.closestTarget(t.target, "result")
                              , n = e.dataset.key
                              , o = e.dataset.value;
                            s && this.removeItem(n, o),
                            i && this.restoreItem(n, o, this.getNextResult(e)),
                            this.updateElements()
                        }
                        n && (this.isSpecialBrowser() ? this.openInNewWindow() : this.downloadAll(n)),
                        e("deleteButton") && this.toggleConfirm(!0),
                        e("confirmNo") && this.toggleConfirm(!1),
                        e("confirmYes") && (this.deleteAll(),
                        this.toggleConfirm(!1))
                    }
                }
                updateElements() {
                    updateCounter()
                }
                getNextResult(t) {
                    let e = t.nextElementSibling;
                    return e ? e.classList.contains(this.settings.classes.resultRemoved) ? this.getNextResult(e) : e : null
                }
                toggleConfirm(t) {
                    const e = document.querySelector(this.settings.selectors.popupOverlaySaved);
                    if (!e)
                        return;
                    const s = e.closest(this.settings.selectors.popup);
                    e.classList.toggle(this.settings.classes.popupOverlayVisible, t),
                    e.querySelector(this.settings.selectors.savedConfirm)?.classList.toggle(this.settings.classes.savedConfirmVisible, t),
                    s.dataset.escPrevent = t,
                    document.dispatchEvent(t ? this.eventShowConfirm : this.eventHideConfirm)
                }
                downloadAll(t) {
                    const e = document.createElement("a")
                      , s = t && t.dataset.name;
                    e.setAttribute("download", (s || "saved") + ".txt"),
                    e.setAttribute("href", this.createContentsUrl()),
                    document.body.appendChild(e),
                    e.click(),
                    document.body.removeChild(e)
                }
                openInNewWindow() {
                    window.open(this.createContentsUrl(), "_blank")
                }
                createContentsUrl() {
                    const t = this.getStorage();
                    let e = "";
                    Object.keys(t).forEach((s => {
                        t[s].values.length && (e += "Tool:\n",
                        e += t[s].name || s,
                        e += "\n\n",
                        e += "Saved items:\n",
                        e += t[s].values.join("\n").replace(/(<([^>]+)>)/gi, ""),
                        e += "\n\n",
                        e += "-".repeat(20),
                        e += "\n\n")
                    }
                    ));
                    const s = new Blob([e],{
                        type: "text/plain;charset=utf-8"
                    });
                    return window.URL.createObjectURL(s)
                }
                saveItem(t) {
                    this.saveItemStorage(TOOL_CONFIG.saved_key, t)
                }
                restoreItem(t, e, s) {
                    let i = this.getStorage(t) || [];
                    if (i && Array.isArray(i)) {
                        const t = s && i.indexOf(s.dataset.value) || -1;
                        0 === t ? i.unshift(e) : -1 === t ? i.push(e) : i.splice(t, 0, e)
                    } else
                        i = [e];
                    this.updateContainerElements(`.result__input[data-text="${e}"]`, !0),
                    this.setStorage(t, i),
                    this.changeRemovedState(t, e, !1)
                }
                removeItem(t, e) {
                    this.removeItemStorage(t, e),
                    this.changeRemovedState(t, e, !0)
                }
                changeRemovedState(t, e, s) {
                    document.querySelectorAll(`.result[data-key='${t}'][data-value='${e}']`).forEach((t => {
                        t.classList.toggle(this.settings.classes.resultRemoved, s);
                        const e = t.querySelector(this.settings.selectors.eraseButton)
                          , i = t.querySelector(this.settings.selectors.restoreButton);
                        e.classList.toggle(this.settings.classes.hidden, s),
                        i.classList.toggle(this.settings.classes.hidden, !s)
                    }
                    ))
                }
                updateContainerElements(t, e) {
                    this.container && this.container.querySelectorAll(t).forEach((t => {
                        t.checked = e
                    }
                    ))
                }
                saveItemStorage(t, e) {
                    let s = this.getStorage(t)
                      , i = null;
                    s = Array.isArray(s) ? s : [],
                    s.includes(e) || s.push(e),
                    TOOL_CONFIG.saved_key == t && (i = TOOL_CONFIG.name),
                    this.setStorage(t, s, i),
                    this.updateContainerElements(`.result__input[data-text="${e}"]`, !0)
                }
                removeItemStorage(t, e) {
                    let s = this.getStorage(t);
                    s = s.filter((t => t !== e)),
                    this.setStorage(t, s),
                    this.updateContainerElements(`.result__input[data-text="${e}"]`, !1)
                }
                deleteAll() {
                    localStorage.setItem("saved", JSON.stringify({})),
                    this.updateContainerElements(".result__input:checked", !1);
                    const t = document.querySelector(this.settings.selectors.popup)
                      , e = t && t.querySelectorAll(this.settings.selectors.savedItem);
                    e && e.forEach((t => {
                        t.parentNode.removeChild(t)
                    }
                    )),
                    this.updateElements()
                }
                getStorage(t) {
                    const e = JSON.parse(localStorage.getItem("saved")) || {};
                    return t && e[t] ? e[t].values || [] : e || {}
                }
                setStorage(t, e, s) {
                    const i = this.getStorage()
                      , n = i[t] ? i[t].name : "";
                    i[t] = {
                        name: s || n,
                        values: e
                    },
                    localStorage.setItem("saved", JSON.stringify(i))
                }
            }
        }
        ,
        232: t => {
            t.exports = class {
                constructor(t, e) {
                    t && (this.elemSelector = e,
                    t.addEventListener("click", this.onClick.bind(this)))
                }
                onClick(t) {
                    let e = t.target.closest(this.elemSelector)
                      , s = e && e.dataset.href;
                    e && s && (t.preventDefault(),
                    this.openLink(s))
                }
                openLink(t) {
                    window.open(t, "_blank")
                }
            }
        }
        ,
        7: t => {
            const e = "{%#%}";
            t.exports = class {
                constructor(t) {
                    this.settings = t,
                    this.button = this.settings.element,
                    this.xhr = new XMLHttpRequest,
                    this.successValue = "",
                    this.button.dataset.page = 0,
                    this.forms = this.settings.forms;
                    for (let t in this.forms)
                        this.forms[t] || delete this.forms[t];
                    this.successValues = Array.prototype.map.call(Object.values(this.forms), (t => [t, t.dataset.successValue || ""])),
                    this._setListeners()
                }
                _setListeners() {
                    this.button.addEventListener("click", (t => this._onClick(t))),
                    this.xhr.addEventListener("readystatechange", (t => this._onStateChange(t)))
                }
                _getInitSuccessValue(t) {
                    let e = this.successValues.find((e => e[0] == t));
                    return e ? e[1] : ""
                }
                _onClick(t) {
                    if (t.preventDefault(),
                    -1 != [2, 3].indexOf(this.xhr.readyState))
                        return;
                    let s = this._getFormType()
                      , i = this._getForm();
                    if (this.successValue = i?.dataset.successValue ? i?.dataset.successValue.split(e) : "",
                    "undefined" == typeof TOOL_DATA)
                        return void this._loadMore();
                    this.button.dataset.page = +this.button.dataset.page + 1;
                    let n = TOOL_CONFIG.forms[s]
                      , o = this.button.dataset.page * n.items_per_page;
                    "smart" != s && (o >= TOOL_DATA.length && (this.button.dataset.page = 0,
                    o = 0,
                    TOOL_DATA = []),
                    o + n?.items_per_page <= TOOL_DATA.length) ? RESULTS_UPDATER.updateElements({
                        from: o,
                        aiHighlight: "smart" == s,
                        isSmartForm: "smart" == s
                    }) : this._loadMore((function() {
                        let t = [];
                        try {
                            t = n?.request?.parser(this.response, this.successValue)
                        } catch (t) {}
                        t && t.length && RESULTS_UPDATER.updateElements({
                            from: o,
                            aiHighlight: "smart" == s,
                            isSmartForm: "smart" == s
                        })
                    }
                    ))
                }
                _onStateChange() {
                    if (4 != this.xhr.readyState)
                        return;
                    let t = this._getFormType();
                    this.button.classList.remove("button--prevent"),
                    this.button.classList.remove("button--loading"),
                    (this.xhr.status < 200 || this.xhr.status >= 300) && (TOOL_CONFIG.notices && TOOL_CONFIG.notices.error && new Notice(TOOL_CONFIG.notices.error,"error"),
                    this.settings.afterLoading && this.settings.afterLoading.call(this));
                    let e = {};
                    try {
                        e = JSON.parse(this.xhr.response)
                    } catch (t) {}
                    if (e?.error)
                        new Notice(e.error,"error"),
                        this.settings.onStateChange && this.settings.onStateChange.call(this, "error");
                    else {
                        let e = null;
                        try {
                            e = TOOL_CONFIG.forms[t]?.request.parser(this.xhr.response, this.successValue)
                        } catch {}
                        if (!e || !e.length)
                            return TOOL_CONFIG.notices && TOOL_CONFIG.notices.error && new Notice(TOOL_CONFIG.notices.error,"error"),
                            void (this.settings.afterLoading && this.settings.afterLoading.call(this));
                        "undefined" != typeof TOOL_DATA ? ("smart" == t && TOOL_CONFIG.forms.smart?.showUniqueOnly && (e = [...new Set(e)],
                        e = e.filter((t => !TOOL_DATA.includes(t)))),
                        e = e.filter(Boolean),
                        TOOL_DATA = TOOL_DATA.concat(e)) : RESULTS_UPDATER.updateElements({
                            data: e,
                            isSmartForm: "smart" == t
                        }),
                        this.settings.onStateChange && this.settings.onStateChange.call(this, "end")
                    }
                }
                _getFormType() {
                    return this.button.dataset.formType || "instant"
                }
                _getForm() {
                    return this.forms[this._getFormType()] || null
                }
                _loadMore(t) {
                    let s = this._getFormType()
                      , i = this._getForm()
                      , n = i?.dataset.successValue || ""
                      , o = n;
                    if (o.includes(e) && (o = o.split(e)),
                    "smart" == s) {
                        let e = TOOL_CONFIG.forms[s]?.request;
                        this.xhr.open("POST", e.url, !0),
                        this.button.classList.add("button--loading"),
                        this.button.classList.add("button--prevent"),
                        t && this.xhr.addEventListener("load", t, {
                            once: !0
                        }),
                        this.settings.onStateChange && this.settings.onStateChange.call(this, "start"),
                        this.xhr.send(o)
                    } else {
                        let e = TOOL_CONFIG.forms[s]?.request;
                        if (e.action) {
                            let i = e.action(o);
                            return "smart" == s && TOOL_CONFIG.forms.smart?.showUniqueOnly && (i = [...new Set(i)],
                            i = i.filter((t => !TOOL_DATA.includes(t)))),
                            TOOL_DATA = TOOL_DATA.concat(i),
                            void (t && t())
                        }
                        let r = null
                          , a = this._getInitSuccessValue(i);
                        if (e.more_url && n == a ? r = e.more_url : e.url && e.composer && (r = e.composer(e.url, o)),
                        !r)
                            return;
                        this.xhr.open("GET", r, !0),
                        this.button.classList.add("button--loading"),
                        this.button.classList.add("button--prevent"),
                        t && this.xhr.addEventListener("load", t, {
                            once: !0
                        }),
                        this.settings.onStateChange && this.settings.onStateChange.call(this, "start"),
                        this.xhr.send(!0)
                    }
                }
            }
        }
        ,
        696: t => {
            t.exports = class {
                constructor(t, e) {
                    this.id = t,
                    this.parent = e
                }
                show() {
                    this.getElementsById().forEach((t => {
                        t.removeAttribute("tabindex")
                    }
                    ))
                }
                hide(t) {
                    this.getElementsById().forEach((e => {
                        t && void 0 !== e.dataset.tabindexKeep ? delete e.dataset.tabindexKeep : e.setAttribute("tabindex", "-1")
                    }
                    ))
                }
                getElementsById() {
                    let t = "[data-tabindex";
                    return this.id && (t += `='${this.id}'`),
                    t += "]",
                    (this.parent || document).querySelectorAll(t)
                }
                destroy() {
                    delete this.id,
                    delete this.parent,
                    delete this.show,
                    delete this.hide,
                    delete this.getElementsById,
                    delete this.destroy
                }
            }
        }
        ,
        667: t => {
            t.exports = class {
                constructor(t) {
                    this.settings = t,
                    this.element = this.settings.root,
                    this.slidesOuter = this.element.querySelector(this.settings.selectors.slidesOuter),
                    this.slides = this.element.querySelectorAll(this.settings.selectors.slide),
                    this.options = this.element.querySelectorAll(this.settings.selectors.option),
                    this.indicator = this.element.querySelector(this.settings.selectors.indicator),
                    this.init(),
                    this.setListeners()
                }
                setListeners() {
                    const t = new ResizeObserver(( () => this.setHeight()));
                    setTimeout(( () => this.slides.forEach((e => t.observe(e)))), 50),
                    "complete" == document.readyState ? this.onDocumentLoad() : window.addEventListener("load", ( () => this.onDocumentLoad())),
                    this.element.addEventListener("change", (t => {
                        t.target.matches(this.settings.selectors.optionChecked) && this.changeSlide()
                    }
                    ))
                }
                onDocumentLoad() {
                    const t = new ResizeObserver(( () => this.updateIndicator()));
                    setTimeout(( () => {
                        this.options.forEach((e => t.observe(e)))
                    }
                    ), 50)
                }
                init() {
                    this.changeSlide(!0),
                    this.slides.forEach((t => t.classList.remove(this.settings.classes.slideRelative))),
                    requestAnimationFrame(( () => {
                        this.element.classList.add(this.settings.classes.initialized)
                    }
                    ))
                }
                setHeight() {
                    let t = this.getSelected();
                    this.slidesOuter.style.height = t.slide.offsetHeight + "px"
                }
                changeSlide(t) {
                    let e = this.getSelected();
                    this.slides.forEach(( (t, s) => {
                        if (t != e.slide)
                            t.classList.add(this.settings.classes.slideHidden);
                        else {
                            t.classList.remove(this.settings.classes.slideHidden);
                            let e = t.classList.contains(this.settings.classes.slideNone);
                            this.slidesOuter.classList.toggle(this.settings.classes.outerHidden, e)
                        }
                    }
                    )),
                    this.setHeight(),
                    this.settings.beforeChange?.({
                        type: t ? null : e.input.value
                    }),
                    this.updateIndicator()
                }
                getSelected() {
                    let t = this.element.querySelector(this.settings.selectors.optionChecked)
                      , e = this.element.querySelector(this.settings.selectors.label + "[for=" + t.id + "]")
                      , s = this.element.querySelector(this.settings.selectors.slide + "[data-type=" + t.value + "]")
                      , i = [].findIndex.call(this.slides, (t => t == s));
                    return {
                        input: t,
                        label: e,
                        slide: s,
                        index: i
                    }
                }
                updateIndicator() {
                    let t = this.getSelected().label
                      , e = t.offsetLeft
                      , s = t.offsetWidth;
                    this.indicator.style.width = s + "px",
                    this.indicator.style.transform = "translateX(" + e + "px)"
                }
            }
        }
        ,
        946: t => {
            t.exports = class {
                constructor(t) {
                    this.settings = t,
                    this.container = this.settings.container,
                    this.items = this.settings.items,
                    this._updateColumnsInfo(!0),
                    this.resultInstant = this.getResultInstance()
                }
                getResultInstance() {
                    let t = this.items[0].cloneNode(!0);
                    t.querySelector(this.settings.selectors.item.textInner).innerText = "",
                    t.querySelector(this.settings.selectors.item.input).dataset.text = "";
                    let e = t.querySelector(this.settings.selectors.item.input).id;
                    return t.querySelector(`[for=${e}]`).removeAttribute("for"),
                    t.querySelector(this.settings.selectors.item.input).removeAttribute("id"),
                    t
                }
                updateElements(t) {
                    let e = t?.data || TOOL_DATA || []
                      , s = t?.from || 0
                      , i = t?.page || 0
                      , n = t?.noAnim || !1
                      , o = t?.aiHighlight || !1
                      , r = this.settings.classList.item
                      , a = this.settings.selectors.item
                      , l = this.settings.push_new
                      , c = t.length || this.settings.getCountPerPage?.() || 24
                      , d = this.items[0].cloneNode(!0);
                    if (i && !s && (s = i * c),
                    Array.isArray(t.data) && t.data.length && t.data.length < c && (c = t.data.length),
                    void 0 !== t.push_new && (l = t.push_new),
                    void 0 !== t.putAll && t.putAll && (l = !0),
                    this.settings.smart_push_new && t.isSmartForm && (l = !0),
                    e?.length && l) {
                        for (let t = s, i = e.length; t < i; t++) {
                            let s = d.cloneNode(!0)
                              , i = this._generateHash();
                            s.querySelector(a.textInner).title = e[t],
                            s.querySelector(a.textInner).innerHTML = e[t],
                            s.querySelectorAll("[id]").forEach((t => {
                                t.setAttribute("id", t.getAttribute("id") + "-" + i)
                            }
                            )),
                            s.querySelectorAll("[for]").forEach((t => {
                                t.setAttribute("for", t.getAttribute("for") + "-" + i)
                            }
                            ));
                            let n = s.querySelector(a.input);
                            n && (n.dataset.text = e[t]),
                            n && (n.checked = !1),
                            s.classList.toggle(r.aiHighlight, o),
                            s.classList.remove(r.picked),
                            s.classList.remove(r.hidden),
                            this.settings.container.appendChild(s)
                        }
                        this.settings.onUpdate && this.settings.onUpdate.call(this);
                        for (let t = 0; t < this.items.length; t++) {
                            let e = this.items[t];
                            !e.querySelector(a.input).dataset.text && e.remove()
                        }
                        return
                    }
                    this.container.classList.toggle(this.settings.classList.noAnim, n);
                    for (let t = 0; t < c; t++) {
                        let i = e[s + t]
                          , l = this.items[t];
                        if (l || (l = this.resultInstant.cloneNode(!0),
                        this.items[0].parentNode.appendChild(l)),
                        l?.classList.toggle(r.aiHighlight, o),
                        void 0 === i) {
                            l.classList.add(r.hidden);
                            continue
                        }
                        n ? (l.querySelector(a.textInner).title = i,
                        l.querySelector(a.textInner).innerHTML = i) : this._changeText(l, i);
                        let c = l.querySelector(a.input);
                        c && (c.dataset.text = i,
                        c.checked = !1),
                        l.classList.remove(r.picked),
                        l.classList.remove(r.hidden)
                    }
                    let h = this.settings.container.querySelectorAll(this.settings.selectors.item.elem);
                    for (let t = c, e = h.length; t < e; t++)
                        h[t].remove();
                    this.settings.onUpdate && this.settings.onUpdate.call(this)
                }
                _generateHash() {
                    const t = performance.now() + 1e6 * Math.random();
                    return Math.floor(t).toString(36).slice(-6)
                }
                highlightSpecial(t, e) {
                    this.items.forEach((s => {
                        const i = s.querySelector(this.settings.selectors.item.textInner).innerText;
                        t.includes(i) ? s.classList.add(e) : s.classList.remove(e)
                    }
                    ))
                }
                _updateColumnsInfo(t) {
                    let e = this.container.querySelector(this.settings.selectors.item.text)
                      , s = e.parentNode.offsetWidth
                      , i = this.container.offsetWidth
                      , n = this._getColumns()
                      , o = i - s * n;
                    !t && o > s && (n += Math.floor(o / s),
                    o = i - s * n),
                    this.columns_info = {
                        container_width: i,
                        width: s,
                        columns: n,
                        padding: s - e.offsetWidth,
                        margin: o
                    }
                }
                _getColumns() {
                    let t = 1
                      , e = this.items[0].offsetTop
                      , s = this.items.length;
                    for (let i = 1; i < s && this.items[i].offsetTop == e; i++)
                        t++;
                    return t
                }
                _changeText(t, e) {
                    const s = t.querySelector(this.settings.selectors.item.textInner)
                      , i = s.cloneNode()
                      , n = this.settings.classList.item;
                    function o() {
                        i.classList.remove(n.newText),
                        i.classList.remove(n.textAnim),
                        s.remove()
                    }
                    i.classList.remove(n.newText),
                    i.classList.remove(n.textAnim),
                    s.classList.add(n.oldText),
                    s.style.height = s.offsetHeight + "px",
                    i.title = e,
                    i.innerHTML = e,
                    i.classList.add(n.newText),
                    s.parentNode.insertBefore(i, s),
                    s.addEventListener("transitionend", o, {
                        once: !0
                    }),
                    i.addEventListener("transitionend", o, {
                        once: !0
                    }),
                    requestAnimationFrame(( () => {
                        s.style.height = i.offsetHeight + "px",
                        requestAnimationFrame(( () => {
                            i.classList.add(n.textAnim),
                            s.classList.add(n.textAnim)
                        }
                        ))
                    }
                    ))
                }
            }
        }
    }
      , e = {};
    function s(i) {
        var n = e[i];
        if (void 0 !== n)
            return n.exports;
        var o = e[i] = {
            exports: {}
        };
        return t[i](o, o.exports, s),
        o.exports
    }
    ( () => {
        const t = s(545)
          , e = s(301)
          , i = s(946)
          , n = s(743)
          , o = s(354)
          , r = s(232)
          , a = s(7)
          , l = s(667)
          , c = s(559)
          , d = s(696)
          , h = s(98)
          , u = s(600)
          , m = s(61)
          , p = s(923)
          , g = s(390)
          , f = s(123)
          , _ = "{%#%}";
        new r(document.querySelector(".share"),".share__link"),
        ( () => {
            const t = document.querySelector(".results")
              , s = document.querySelectorAll(".tool-form")
              , i = document.querySelector("#moreResults");
            t && s && "undefined" != typeof TOOL_CONFIG && s.forEach((s => {
                const n = s.dataset?.type || "instant"
                  , o = {
                    element: s,
                    resultsContainer: t,
                    array_divider: _,
                    selectors: {
                        field: ".tool-form__input select, .tool-form__input input",
                        label: ".tool-form__input",
                        button: ".tool-form__button"
                    },
                    classNames: {
                        invalid: "tool-form__input--invalid",
                        formAnimation: "tool-form--anim"
                    },
                    validation: {},
                    onSuccessLoad: function() {
                        i && (i.dataset.formType = n)
                    }
                }
                  , r = TOOL_CONFIG?.forms?.instant
                  , a = TOOL_CONFIG?.forms?.smart;
                r && "instant" == s.dataset?.type && (o.more_url = r.request?.more_url || null,
                o.url = r.request?.url || null,
                o.composer = r.request?.composer || null,
                o.parser = r.request?.parser || null,
                o.action = r.request?.action || null,
                o.fields = r.fields || null),
                a && "smart" == s.dataset?.type && (o.url = a.request?.url || null,
                o.composer = a.request?.composer || null,
                o.composer_type = a.request?.composer_type || null,
                o.parser = a.request?.parser || null,
                o.showUniqueOnly = a?.showUniqueOnly || !1,
                o.fields = a.fields || null),
                new e(o)
            }
            ))
        }
        )(),
        ( () => {
            const t = document.querySelector("#moreResults");
            t && new a({
                element: t,
                forms: {
                    smart: document.querySelector(".tool-form[data-type='smart']"),
                    instant: document.querySelector(".tool-form[data-type='instant']")
                },
                onStateChange: function(t) {
                    let e = this.button?.dataset?.formType;
                    if (!e)
                        return;
                    let s = this.forms[e]?.querySelector(".tool-form__button");
                    s?.classList.toggle("button--prevent", "start" == t)
                }
            })
        }
        )(),
        ( () => {
            if (!document.querySelector(".results"))
                return;
            const e = document.querySelector("#aiSelectButton")
              , s = document.querySelector(".results__list")
              , o = document.querySelector("#moreResults")
              , r = e && new t({
                button: e,
                form: document.querySelector(".tool-form[data-type='instant']"),
                resultsContainer: s,
                array_divider: _,
                classNames: {
                    loading: "button--state--processing",
                    success: "button--state--processed"
                },
                selectors: {
                    itemTextInner: ".results .result:not(.result--hidden) .result__text"
                },
                apiUrl: "/ai/select",
                loadingErrorNotice: "Something went wrong",
                onSelect: function(t) {
                    if (!window.RESULTS_UPDATER)
                        return;
                    if (window.RESULTS_UPDATER.highlightSpecial(t, window.RESULTS_UPDATER.settings.classList.item.picked),
                    !window.RESULTS_PAGINATOR?.init)
                        return;
                    let e = window.RESULTS_PAGINATOR.pageIndex - 1;
                    a[e] = t
                },
                onError: function(t) {
                    Notice && new Notice(t)
                }
            });
            window.RESULTS_UPDATER = new i({
                container: s,
                items: s.querySelectorAll(".result"),
                smart_push_new: !0 === TOOL_CONFIG?.forms.smart?.push_new,
                getCountPerPage: () => Math.min.apply(null, Object.values(TOOL_CONFIG.forms).map((t => t.items_per_page || 24))),
                selectors: {
                    item: {
                        elem: ".result",
                        text: ".result__text-outer",
                        textInner: ".result__text",
                        input: ".result__input"
                    }
                },
                classList: {
                    noAnim: "results--no-anim",
                    item: {
                        picked: "result--selected",
                        aiHighlight: "result--ai",
                        hidden: "result--hidden",
                        oldText: "result__text--out",
                        newText: "result__text--in",
                        textAnim: "result__text--anim"
                    }
                },
                onUpdate: function() {
                    if ("undefined" != typeof updateStars && updateStars(),
                    !r)
                        return;
                    r.restoreState();
                    let t = this.items[0]
                      , e = this?.settings?.classList?.item?.aiHighlight;
                    e && t?.classList?.contains(e) && r.restoreState()
                }
            });
            let a = {};
            document.querySelector("[data-slot='pagination']") && (window.RESULTS_PAGINATOR = new n({
                data: [],
                updater: window.RESULTS_UPDATER,
                items_per_page: TOOL_CONFIG.forms[Object.keys(TOOL_CONFIG.forms)[0]].items_per_page,
                slot: "pagination",
                selectors: {
                    control: {
                        item: ".pagi__item",
                        button: ".pagi__button",
                        prev: ".pagi__button--prev",
                        next: ".pagi__button--next"
                    }
                },
                classList: {
                    control: {
                        active: "pagi__button--active"
                    }
                },
                onChange: t => {
                    a[t -= 1] && r && r.setList(a[t])
                }
                ,
                onBeforeInit: () => {
                    a = {}
                }
            }));
            let c = document.querySelector(".tabs");
            if (!c)
                return;
            const d = document.querySelector(".results")
              , h = document.querySelector("#aiSelectButton")
              , u = "result--selected"
              , m = {
                instant: {
                    data: [],
                    selected: [],
                    index: 0
                },
                smart: {
                    data: [],
                    selected: [],
                    index: 0
                }
            };
            new l({
                root: c,
                selectors: {
                    slide: ".tabs__slide",
                    slidesOuter: ".tabs__content",
                    option: ".tabs-header__input[name='form-tabs']",
                    optionChecked: ".tabs-header__input[name='form-tabs']:checked",
                    label: ".tabs-header__label",
                    indicator: ".tabs-header__indicator"
                },
                classes: {
                    initialized: "tabs--init",
                    indicatorAnimEnabled: "tabs-header__indicator--anim",
                    indicatorVisible: "tabs-header__indicator--visible",
                    outerHidden: "tabs__content--hidden",
                    slideNone: "tabs__slide--none",
                    slideFreeze: "tabs__slide--freeze",
                    slideRelative: "tabs__slide--relative",
                    slideHidden: "tabs__slide--hidden",
                    slideLeft: "tabs__slide--left",
                    slideRight: "tabs__slide--right"
                },
                beforeChange: t => {
                    const e = Object.keys(m)
                      , s = t.type;
                    if (!e.includes(s))
                        return;
                    var i, n;
                    i = e.filter((t => t != s))[0],
                    n = function() {
                        const t = d.querySelectorAll(".results .results__item");
                        let e = +o?.dataset.page || 0
                          , s = Array.from(t).filter((t => t.classList.contains(u)));
                        return s = s.map((t => t.querySelector("input").dataset.text)),
                        s = s.filter(Boolean),
                        {
                            data: TOOL_DATA.slice(),
                            selected: s,
                            index: e
                        }
                    }(),
                    "string" == typeof i && (m[i] = n),
                    "smart" == s ? h && (h.style.display = "none") : h?.style.removeProperty("display"),
                    o && (o.dataset.formType = s);
                    const r = function(t) {
                        return "string" != typeof t ? [] : m[t]
                    }(s);
                    !function(t) {
                        const e = t.data || [];
                        TOOL_DATA.splice(0, TOOL_DATA.length, ...e)
                    }(r),
                    function(t, e) {
                        d.classList.toggle("results--hidden", !t?.length),
                        o && (o.dataset.page = "instant" == s ? e.index : 0),
                        RESULTS_UPDATER.updateElements({
                            data: t,
                            noAnim: !0,
                            push_new: !1,
                            page: +o?.dataset.page || 0,
                            length: "smart" == s ? t.length : null,
                            aiHighlight: "smart" == s
                        }),
                        o && "smart" == s && (o.dataset.page = e.index),
                        updateStars(),
                        RESULTS_UPDATER.highlightSpecial(e.selected, u)
                    }(TOOL_DATA, r)
                }
            })
        }
        )(),
        document.querySelectorAll("label.input-text .input-text__resizer").forEach((t => {
            let e = t.closest("label")
              , s = e.closest(".tabs__content");
            new c({
                label: e,
                resizeSpan: t,
                classes: {
                    active: "input-text__resizer--active"
                },
                onStart: () => {
                    s?.classList.add("tabs__content--transition--disabled")
                }
                ,
                onEnd: () => {
                    s?.classList.remove("tabs__content--transition--disabled")
                }
            })
        }
        )),
        ( () => {
            const t = new g({
                templateId: "notice-template",
                lifeTime: 10,
                selectors: {
                    noticeContainer: ".notice",
                    text: ".notice__text",
                    close: ".notice__close"
                },
                classes: {
                    noticeContainer: "notice",
                    visible: "notice__item--visible",
                    attract: "notice__item--attract"
                },
                attractAnimationName: "attract"
            });
            t.sample && (window.Notice = t.createNoticeClass())
        }
        )(),
        (new d).hide(!0),
        new h,
        new u({
            classes: {
                completed: "result__button--show-status"
            },
            selectors: {
                button: ".result__button--copy",
                textOuter: ".result",
                text: ".result__text:last-of-type"
            }
        }),
        new m({
            classes: {
                hidden: "result__button--hidden",
                resultRemoved: "result--removed",
                popupOverlayVisible: "popup__overlay--visible",
                savedConfirmVisible: "saved-confirm--visible"
            },
            selectors: {
                container: ".results",
                result: ".result",
                resultInput: ".result__input",
                eraseButton: ".result__button--erase",
                restoreButton: ".result__button--back",
                savedConfirm: ".saved-confirm",
                savedBlock: ".popup--saved",
                savedItem: ".saved__item",
                downloadButton: "#downloadAll",
                deleteButton: "#deleteAll",
                confirmNo: "#confirmNo",
                confirmYes: "#confirmYes",
                popupOverlaySaved: ".popup__overlay[data-type='saved']",
                popup: ".popup"
            },
            storageKey: "undefined" != typeof TOOL_CONFIG && TOOL_CONFIG?.saved_key
        }),
        "undefined" != typeof TOOL_CONFIG && (new p({
            selectors: {
                form: ".tool-form[data-type='instant']",
                input: ".tool-form__input",
                textInput: "input[type='text']",
                label: "label"
            },
            classes: {
                invalid: "input-text--invalid",
                formAnimation: "tool-form--anim"
            },
            animationName: "shake"
        },TOOL_CONFIG),
        document.querySelectorAll(".input-text").forEach((t => {
            const e = t.querySelector(".input-text__erase")
              , s = t.querySelector(".input-text__input, .input-text__textarea");
            s && e && new f(e,{
                input: s
            })
        }
        )),
        new o({
            selectors: {
                select: "select.input-select__element",
                outer: ".tool-form__input"
            },
            classes: {
                open: "input-select--open",
                openerActive: "custom-select__opener--active"
            },
            customSelectOptions: {
                containerClass: "custom-select",
                openerClass: "custom-select__opener",
                panelClass: "custom-select__panel",
                optionClass: "custom-select__option",
                optgroupClass: "custom-select__optgroup",
                isSelectedClass: "custom-select__option--selected",
                hasFocusClass: "custom-select__option--focus",
                isDisabledClass: "custom-select--disabled",
                isOpenClass: "custom-select--open",
                scrollerClass: "ss-content",
                openerPlaceholderClass: "custom-select__opener--placeholder"
            }
        }),
        document.querySelectorAll("[data-id=backToForm]").forEach((t => {
            t.addEventListener("click", (t => {
                t.preventDefault(),
                window.scroll({
                    top: 0,
                    left: window.pageXOffset,
                    behavior: "smooth"
                })
            }
            ))
        }
        )))
    }
    )()
}
)();
