( () => {
    var e = {
        432: e => {
            e.exports = class {
                constructor(e=[], t={}) {
                    this.functions = [],
                    this.functionMap = t,
                    this.isProcessing = !1,
                    e.forEach((e => this.push(e)))
                }
                push(e) {
                    if ("function" == typeof e)
                        this.functions.push(e),
                        this.executeNext();
                    else if ("string" == typeof e && this.functionMap[e])
                        this.functions.push(this.functionMap[e]),
                        this.executeNext();
                    else {
                        if (!Array.isArray(e) || !this.functionMap[e[0]])
                            throw new Error("Only functions, valid function keys, or arrays can be added to the queue");
                        {
                            const [t,...s] = e;
                            this.functions.push(( () => this.functionMap[t](...s))),
                            this.executeNext()
                        }
                    }
                }
                unshift(e) {
                    if ("function" == typeof e)
                        this.functions.unshift(e);
                    else if ("string" == typeof e && this.functionMap[e])
                        this.functions.unshift(this.functionMap[e]);
                    else {
                        if (!Array.isArray(e) || !this.functionMap[e[0]])
                            throw new Error("Only functions, valid function keys, or arrays can be added to the queue");
                        {
                            const [t,...s] = e;
                            this.functions.unshift(( () => this.functionMap[t](...s)))
                        }
                    }
                    this.executeNext()
                }
                async executeNext() {
                    if (!this.isProcessing) {
                        for (this.isProcessing = !0; this.functions.length; ) {
                            const e = this.functions.shift();
                            await e()
                        }
                        this.isProcessing = !1
                    }
                }
            }
        }
        ,
        661: e => {
            e.exports = class {
                constructor(e) {
                    this.settings = e,
                    this.menuButton = document.querySelector(this.settings.selectors.menuButton),
                    this.header = document.querySelector(this.settings.selectors.header),
                    this.menu = document.querySelector(this.settings.selectors.menu),
                    this.tabindexHandler = null,
                    this.menuButton.addEventListener("click", ( () => this.toggleMenu())),
                    document.addEventListener("keydown", (e => this.handleKeydown(e))),
                    this.menu.addEventListener("click", (e => this.handleMenuClick(e))),
                    new ResizeObserver(( () => this.setHeaderHeight())).observe(this.header),
                    this.setHeaderHeight()
                }
                toggleMenu() {
                    this.tabindexHandler || (this.tabindexHandler = "undefined" != typeof TabindexHandler && new TabindexHandler("menu",this.menu));
                    const e = this.menu.classList.contains(this.settings.classes.menuVisible);
                    this.setHeaderHeight(),
                    this.menuButton.classList.toggle(this.settings.classes.headerButtonActive, !e),
                    this.menu.classList.toggle(this.settings.classes.menuVisible, !e),
                    this.header.classList.toggle(this.settings.classes.headerOpaque, !e),
                    this.header.classList.toggle(this.settings.classes.headerNoShadow, !e),
                    this.tabindexHandler && this.tabindexHandler[e ? "hide" : "show"]()
                }
                handleKeydown(e) {
                    27 === e.keyCode && this.menu.classList.contains(this.settings.classes.menuVisible) && (e.preventDefault(),
                    this.toggleMenu())
                }
                handleMenuClick(e) {
                    e.target === this.menu && this.toggleMenu()
                }
                setHeaderHeight() {
                    document.body.style.setProperty("--header-height", `${this.header.offsetHeight}px`)
                }
            }
        }
        ,
        587: e => {
            e.exports = class {
                constructor(e, t) {
                    this.scriptPath = e,
                    this.spritePath = t,
                    this.init()
                }
                init() {
                    "serviceWorker"in navigator && navigator.serviceWorker.getRegistration(this.scriptPath).then((e => {
                        e ? this.setupServiceWorkerMessaging(e) : navigator.serviceWorker.register(this.scriptPath, {
                            scope: "/"
                        }).then((e => this.setupServiceWorkerMessaging(e)))
                    }
                    ))
                }
                setupServiceWorkerMessaging(e) {
                    e.active?.postMessage({
                        type: "UPDATE_SPRITE",
                        spriteUrl: this.spritePath
                    }),
                    window.addEventListener("load", ( () => {
                        e.active?.postMessage({
                            type: "PARSE_SPRITE"
                        })
                    }
                    )),
                    navigator.serviceWorker.addEventListener("message", (t => {
                        "SPRITE_UPDATED" === t.data.type && e.active?.postMessage({
                            type: "PARSE_SPRITE"
                        })
                    }
                    ))
                }
            }
        }
        ,
        280: e => {
            e.exports = class {
                constructor(e) {
                    this.settings = e,
                    this.element = this.settings.element,
                    this.list = this.settings.list,
                    this.saveKey = this.settings.saveKey || "AppListSort",
                    this.elements = this.list.querySelectorAll(this.settings.selectors.element),
                    this.toggler = this.element.querySelector(this.settings.selectors.toggler),
                    this.startOrder = this.getStartOrder(),
                    this.setListeners(),
                    this.setTogglerId(null, this.element.querySelector('[type="radio"][checked]')?.id)
                }
                setListeners() {
                    this.element.addEventListener("change", (e => this.onChange.call(this, e)))
                }
                onChange(e) {
                    let t = e.target
                      , s = t.value
                      , i = t.id
                      , n = this.getSortedIndicies(s);
                    this.rearrangeElements(n),
                    this.setTogglerId(null, i),
                    this.saveState(i)
                }
                setTogglerId(e, t) {
                    if (!e) {
                        let s = this.element.querySelector(`#${t}`)
                          , i = s?.name
                          , n = i && this.element.querySelector(`[name='${i}']:not(#${t})`);
                        e = n?.id
                    }
                    e && this.toggler.setAttribute("for", e)
                }
                saveState(e) {
                    localStorage.setItem(this.saveKey, e || "")
                }
                readState() {
                    return localStorage.getItem(this.saveKey)
                }
                getSortedIndicies(e) {
                    return "az" == e ? this.sortIndiciesAlphabetically() : "pop" == e ? this.sortIndiciesByPopularity() : this.startOrder.slice()
                }
                sortIndiciesAlphabetically() {
                    return this.startOrder.slice().sort(( (e, t) => {
                        let s = this.list.querySelector(`[${this.settings.attributeName}="${e}"]`)
                          , i = this.list.querySelector(`[${this.settings.attributeName}="${t}"]`)
                          , n = s.querySelector(this.settings.selectors.text)?.innerText || ""
                          , r = i.querySelector(this.settings.selectors.text)?.innerText || "";
                        return n.localeCompare(r)
                    }
                    ))
                }
                sortIndiciesByPopularity() {
                    return this.startOrder.slice().sort(( (e, t) => e - t))
                }
                getStartOrder() {
                    return [].map.call(this.elements, (e => +e.dataset.index || 0))
                }
                rearrangeElements(e) {
                    let t = this.list.querySelector(this.settings.selectors.element);
                    e.reverse().forEach((e => {
                        let s = this.list.querySelector(`[${this.settings.attributeName}="${e}"]`);
                        t != s && (t.parentNode.insertBefore(s, t),
                        t = s)
                    }
                    ))
                }
            }
        }
    }
      , t = {};
    function s(i) {
        var n = t[i];
        if (void 0 !== n)
            return n.exports;
        var r = t[i] = {
            exports: {}
        };
        return e[i](r, r.exports, s),
        r.exports
    }
    ( () => {
        const e = s(280)
          , t = s(432)
          , i = s(587)
          , n = s(661);
        window.initialScripts = new t(window.initialScripts,{
            sort: async function() {
                const t = document.querySelector(".sorting");
                if (!t)
                    return;
                const s = new e({
                    element: t,
                    list: t.parentNode.querySelector(".tools"),
                    selectors: {
                        element: ".tools-item",
                        text: ".tools-item__title",
                        toggler: ".sorting__toggler"
                    },
                    attributeName: "data-index"
                })
                  , i = s.readState()
                  , n = i && document.getElementById(i);
                return n?.click(),
                t.classList.add("sorting--init"),
                requestAnimationFrame(( () => {
                    t.classList.add("sorting--smooth")
                }
                )),
                n ? s : void 0
            },
            vh: async function() {
                function e() {
                    document.documentElement.style.setProperty("--vh", .01 * window.innerHeight + "px")
                }
                window.addEventListener("resize", e),
                e()
            },
            icons: (e, t) => new i(e,t),
            menu: async function() {
                new n({
                    selectors: {
                        menuButton: "#menu-button",
                        header: ".page__header",
                        menu: ".page__menu"
                    },
                    classes: {
                        menuVisible: "menu--visible",
                        headerButtonActive: "header-button--active",
                        headerOpaque: "header--opaque",
                        headerNoShadow: "header--no-shadow"
                    }
                })
            },
            counter: async function() {
                function e(e) {
                    const t = JSON.parse(localStorage.getItem("saved")) || {}
                      , s = Object.keys(t).map((e => (t[e].values || []).length)).reduce(( (e, t) => e + t), 0)
                      , i = document.querySelector(".header-button__counter")
                      , n = document.querySelector(".header-button__catchy-icon")
                      , r = document.querySelector("#downloadAll")
                      , o = document.querySelector("#deleteAll");
                    n?.addEventListener("animationend", ( () => n?.remove())),
                    s && e && n?.remove(),
                    s && !e && n?.classList.add("header-button__catchy-icon--anim"),
                    i.classList.toggle("header-button__counter--visible", s),
                    r && (r.disabled = !s),
                    o && (o.disabled = !s),
                    i.innerText = s
                }
                function t() {
                    document.querySelector(".header-button__counter").classList.add("header-button__counter--smooth")
                }
                e(!0),
                "complete" === document.readyState ? t() : window.addEventListener("load", t),
                window.updateCounter = e
            },
            fieldsCount: async function(e) {
                const t = e.dataset.type
                  , s = TOOL_CONFIG.forms[t]?.fields;
                if (!s)
                    return;
                const i = e.querySelectorAll("input, select, textarea");
                if (s.length === i.length)
                    for (let e in s)
                        s[e].elem = i[e];
                else
                    console.error("Count of fields in settings doesn't match the count of interactive DOM elements.")
            },
            stars: async function() {
                function e() {
                    const e = (JSON.parse(localStorage.getItem("saved")) || {})[TOOL_CONFIG.saved_key]
                      , t = e ? e.values : [];
                    if (t.length)
                        for (let e = 0, s = t.length; e < s; e++) {
                            const s = document.querySelectorAll(`.result__input[data-text="${t[e]}"]`);
                            for (let e = 0, t = s.length; e < t; e++)
                                s[e].checked = !0
                        }
                }
                window.updateStars = e,
                e()
            }
        })
    }
    )()
}
)();
