'use strict';

var containsFn
	, node = window.Node
;

if (node && node.prototype) {
	if (node.prototype.contains) {
		containsFn = node.prototype.contains;
	} else if (node.prototype.compareDocumentPosition) {
		containsFn = function (arg) {
			return !!(node.prototype.compareDocumentPosition.call(this, arg) & 16);
		};
	}
}

if (!containsFn) {
	containsFn = function (arg) {
		if (arg) {
			while ((arg = arg.parentNode)) {
				if (arg === this) {
					return true;
				}
			}
		}
		return false;
	};
}

module.exports = function (a, b) {
	var adown = a.nodeType === 9 ? a.documentElement : a
		, bup = b && b.parentNode
	;

	return a === bup || !!(bup && bup.nodeType === 1 && containsFn.call(adown, bup));
};
