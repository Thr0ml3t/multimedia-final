/**
 * Created by thr0m on 09/10/2016.
 */

/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

/**
 * @returns The number truncated to the nearest integer of less than or equal value.
 *
 * (4.9).floor(); // => 4
 * (4.2).floor(); // => 4
 * (-1.2).floor(); // => -2
 */
Number.prototype.floor = function() {
    return Math.floor(this);
};

/**
 * @returns The number truncated to the nearest integer of greater than or equal value.
 *
 * (4.9).ceil(); // => 5
 * (4.2).ceir(); // => 5
 * (-1.2).ceil(); // => -1
 */
Number.prototype.ceil = function() {
    return Math.ceil(this);
};

/**
 * Returns the the nearest grid resolution less than or equal to the number.
 *
 *   EX:
 *    (7).snap(8) => 0
 *    (4).snap(8) => 0
 *    (12).snap(8) => 8
 *
 * @param {Number} resolution The grid resolution to snap to.
 * @returns The nearest multiple of resolution lower than the number.
 * @type Number
 */
Number.prototype.snap = function(resolution) {
    return (this / resolution).floor() * resolution;
};



function dispose3(obj) {
    /**
     *  @author Marco Sulla (marcosullaroma@gmail.com)
     *  @date Mar 12, 2016
     */

    "use strict";

    var children = obj.children;
    var child;

    if (children) {
        for (var i=0; i<children.length; i+=1) {
            child = children[i];

            dispose3(child);
        }
    }

    var geometry = obj.geometry;
    var material = obj.material;

    if (geometry) {
        geometry.dispose();
    }

    if (material) {
        var texture = material.map;

        if (texture) {
            texture.dispose();
        }

        material.dispose();
    }
}