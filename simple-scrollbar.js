!function(t, e) {
    "object" == typeof exports ? module.exports = e(window, document) : t.SimpleScrollbar = e(window, document)
}(this, (function(t, e) {
    var s = t.requestAnimationFrame || t.setImmediate || function(t) {
        return setTimeout(t, 0)
    }
    ;
    function i(t) {
        Object.defineProperty(t, "data-simple-scrollbar", {
            value: new n(t),
            configurable: !0
        })
    }
    function r(t) {
        Object.prototype.hasOwnProperty.call(t, "data-simple-scrollbar") && (t["data-simple-scrollbar"].unBind(),
        delete t["data-simple-scrollbar"])
    }
    function o(i) {
        for (this.target = i,
        this.content = i.firstElementChild,
        this.mod = this.target.getAttribute("ss-container"),
        this.mod && this.target.classList.add("ss-" + this.mod),
        this.direction = t.getComputedStyle(this.target).direction,
        this.track = '<div class="ss-track">',
        this.thumb = '<div class="ss-thumb">',
        this.mB = this.moveBar.bind(this),
        this.wrapper = e.createElement("div"),
        this.wrapper.setAttribute("class", "ss-wrapper"),
        this.el = e.createElement("div"),
        this.el.setAttribute("class", "ss-content"),
        "rtl" === this.direction && this.el.classList.add("rtl"),
        this.wrapper.appendChild(this.el); this.target.firstChild; )
            this.el.appendChild(this.target.firstChild);
        this.target.appendChild(this.wrapper),
        this.target.insertAdjacentHTML("beforeend", this.track),
        this.track = this.target.lastChild,
        this.track.insertAdjacentHTML("beforeend", this.thumb),
        this.thumb = this.track.lastChild,
        this.observer = new ResizeObserver(this.mB),
        this.observer.observe(this.target),
        this.observer.observe(this.el.firstElementChild),
        function(t, i) {
            var r;
            function o(t) {
                var e = t.pageY - r;
                r = t.pageY,
                s((function() {
                    i.el.scrollTop += e / i.scrollRatio
                }
                ))
            }
            function a() {
                t.classList.remove("ss-grabbed"),
                e.body.classList.remove("ss-grabbed"),
                e.removeEventListener("mousemove", o),
                e.removeEventListener("mouseup", a)
            }
            t.addEventListener("mousedown", (function(s) {
                return r = s.pageY,
                t.classList.add("ss-grabbed"),
                e.body.classList.add("ss-grabbed"),
                e.addEventListener("mousemove", o),
                e.addEventListener("mouseup", a),
                !1
            }
            ))
        }(this.thumb, this),
        this.moveBar(),
        t.addEventListener("resize", this.mB),
        this.el.addEventListener("scroll", this.mB),
        this.el.addEventListener("mouseenter", this.mB),
        this.target.classList.add("ss-container");
        var r = t.getComputedStyle(i);
        "0px" === r.height && "0px" !== r["max-height"] && (i.style.height = r["max-height"]),
        this.unBind = function() {
            t.removeEventListener("resize", this.mB),
            this.el.removeEventListener("scroll", this.mB),
            this.el.removeEventListener("mouseenter", this.mB),
            this.target.classList.remove("ss-container"),
            this.mod && this.target.classList.remove("ss-" + this.mod),
            this.target.insertBefore(this.content, this.wrapper),
            this.target.removeChild(this.wrapper),
            this.target.removeChild(this.track),
            this.track = null,
            this.thumb = null
        }
    }
    function a() {
        for (var t = e.querySelectorAll("*[ss-container]"), s = 0; s < t.length; s++)
            i(t[s])
    }
    o.prototype = {
        moveBar: function(t) {
            var e = this.el.scrollHeight
              , i = this.el.clientHeight
              , r = this;
            this.scrollRatio = i / e,
            this.fade = {
                top: this.el.scrollTop >= 3,
                bottom: this.el.scrollTop + i < e - 3
            },
            s((function() {
                if (r.fade.top,
                r.fade.bottom,
                r.scrollRatio >= 1)
                    return r.target.classList.add("ss-no-scroll"),
                    r.target.classList.remove("ss-fade-top"),
                    void r.target.classList.remove("ss-fade-bottom");
                r.target.classList[r.fade.top ? "add" : "remove"]("ss-fade-top"),
                r.target.classList[r.fade.bottom ? "add" : "remove"]("ss-fade-bottom"),
                r.target.classList.remove("ss-no-scroll"),
                r.thumb.style.cssText = "height:" + Math.max(100 * r.scrollRatio, 10) + "%; top:" + r.el.scrollTop / e * 100 + "%;"
            }
            ))
        }
    },
    e.addEventListener("DOMContentLoaded", a),
    o.initEl = i,
    o.initAll = a,
    o.unbindEl = r,
    o.unbindAll = function() {
        for (var t = e.querySelectorAll(".ss-container"), s = 0; s < t.length; s++)
            r(t[s])
    }
    ;
    var n = o;
    return n
}
));
