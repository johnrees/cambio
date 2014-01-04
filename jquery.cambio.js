/*
Cambio.js v0.1
Release: 04/01/2014
Author: John Rees <john@bitsushi.com>

http://github.com/johnrees/cambio

Licensed under the WTFPL license: http://www.wtfpl.net/txt/copying/
*/

var $;

$ = jQuery;

Array.prototype.unique = function() {
  var key, output, value, _i, _ref, _results;
  output = {};
  for (key = _i = 0, _ref = this.length; 0 <= _ref ? _i < _ref : _i > _ref; key = 0 <= _ref ? ++_i : --_i) {
    output[this[key]] = this[key];
  }
  _results = [];
  for (key in output) {
    value = output[key];
    _results.push(value);
  }
  return _results;
};

$.fn.extend({
  cambio: function(options) {
    var currencies, log, query, root, settings, url,
      _this = this;
    settings = {
      floor: true,
      debug: false
    };
    settings = $.extend(settings, options);
    currencies = [];
    log = function(msg) {
      if (settings.debug) {
        return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
      }
    };
    this.each(function() {
      return currencies.push($(this).data('cambio').match(/[A-Z]{3}/g).join(""));
    });
    root = "https://query.yahooapis.com/v1/public/yql?q=";
    query = "select * from yahoo.finance.xchange where pair in (" + ((currencies.map(function(c) {
      return "'" + c + "'";
    })).unique().join(',')) + ")";
    options = "&format=json&diagnostics=" + settings.debug + "&env=store://datatables.org/alltableswithkeys&callback=";
    url = root + query + options;
    return $.get(url, function(result) {
      return _this.each(function() {
        var amount, conversion, conversions, matches, rate, total, _i, _len, _ref, _results;
        matches = $(this).data('cambio').match(/(\d+) (.+)/);
        amount = parseInt(matches[1]);
        conversion = matches[2];
        _ref = result.query.results.rate;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          conversions = _ref[_i];
          if (conversion === conversions.Name) {
            rate = conversions.Rate;
            total = amount * rate;
            total = settings.floor ? Math.floor(total) : total.toFixed(2);
            _results.push($(this).text(total));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    });
  }
});
