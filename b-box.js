(function(global) {
    "use strict";

    function BBox(element) {
        this._element = element;
        this._element.addEventListener("resize", function() {
            this.update();
        }.bind(this));
        this.update();
    }

    BBox.LengthKeys = [
        "top",
        "left",
        "right",
        "bottom",
        "width",
        "height",
        "margin-top",
        "margin-left",
        "margin-right",
        "margin-bottom",
        "padding-top",
        "padding-left",
        "padding-right",
        "padding-bottom",
        "border-top-width",
        "border-left-width",
        "border-right-width",
        "border-bottom-width",
    ];

    BBox.prototype.update = function() {
        this._style = getComputedStyle(this._element, "");
        BBox.LengthKeys.forEach(function(key) {
            if(key in this._style) {
                this[key] = this._style[key];
            } else {
                throw new Error(["The key", key,
                    "is not exist in computedStyle"
                    ].join(" "))
            }
        }, this);
        /*
        console.log(JSON.stringify(this, function(key, value) {
            if(typeof(value) === "object"
                && value.constructor.name.substr(-7) === "Element"
                && "id" in value && "classList" in value)
            {
                return value.tagName +
                    (value.id !== "" ? "#" + value.id : "") +
                    (value.classList.length == 0 ? "" : "." +
                     Array.prototype.join.call(value.classList, "."));
            }
            if(key.charAt(0) == "_") {
                return "";
            }
            return value;
        }));
        */
    };

    BBox.prototype.px = function(key) {
        if(!(key in this)) {
            throw new Error([key, "is not exists in",
                    JSON.stringify(this)
                    ].join(" "));
        }
        return parseInt(this[key]);
    };

    BBox.prototype.marginTopNc = function() {
        return this.px("margin-top") +
            this.px("padding-top");
    };

    BBox.prototype.marginLeftNc = function() {
        return this.px("margin-left") +
            this.px("padding-left");
    };

    BBox.prototype.marginRightNc = function() {
        return this.px("margin-right") +
            this.px("padding-right");
    };

    BBox.prototype.marginBottomNc = function() {
        return this.px("margin-bottom") +
            this.px("padding-bottom");
    };

    BBox.prototype.marginVerticalNc = function() {
        return this.marginTopNc() +
            this.marginBottomNc();
    };

    BBox.prototype.marginHorizontalNc = function() {
        return this.marginLeftNc() +
            this.marginRightNc();
    };

    BBox.Rect = function(top, left, right, bottom) {
        this.top = top || 0;
        this.left = left || 0;
        this.right = right || 0;
        this.bottom = bottom || 0;
    };
    BBox.Rect.clone = function (that) {
        return new BBox.Rect(that.top, that.left, that.right, that.bottom);
    };
    BBox.Rect.fromBBox = function(bbox) {
        return new BBox.Rect(
            bbox.marginTopNc(),
            bbox.marginLeftNc(),
            bbox.marginLeftNc() + bbox.px("width") - bbox.marginRightNc(),
            bbox.marginTopNc() + bbox.px("height") - bbox.marginBottomNc());
    };

    BBox.prototype.setBound = function(rect) {
        this._element.style.top = rect.top + "px";
        this._element.style.left = rect.left + "px";
        this._element.style.right = rect.right + "px";
        this._element.style.bottom = rect.bottom + "px";
    };

    try {
        module.exports = BBox;
    } catch (err) {
        global.BBox = BBox;
    }
}(Function("return this;")()));


