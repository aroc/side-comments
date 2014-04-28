module.exports = function(el) {
  var attrs = el.attributes,
      ret = {},
      attr,
      i;

  for (i = attrs.length - 1; i >= 0; i--) {
    attr = attrs.item(i);
    ret[attr.nodeName] = attr.nodeValue;
  }

  return ret;
};