###
Cambio.js v0.1
Release: 04/01/2014
Author: John Rees <john@bitsushi.com>

http://github.com/johnrees/cambio

Licensed under the WTFPL license: http://www.wtfpl.net/txt/copying/
###

# Reference jQuery
$ = jQuery

Array::unique = ->
  output = {}
  output[@[key]] = @[key] for key in [0...@length]
  value for key, value of output

# Adds plugin object to jQuery
$.fn.extend
  # Change cambio to your plugin's name.
  cambio: (options) ->

    # Default settings
    settings =
      floor: true
      debug: false

    # Merge default settings with options.
    settings = $.extend settings, options

    currencies = []

    # Simple logger.
    log = (msg) ->
      console?.log msg if settings.debug

    @each ()->
      currencies.push $(this).data('cambio').match(/[A-Z]{3}/g).join("")

    root = "https://query.yahooapis.com/v1/public/yql?q="
    query = "select * from yahoo.finance.xchange where pair in (#{(currencies.map (c)-> "'#{c}'").unique().join(',')})"
    options = "&format=json&diagnostics=#{settings.debug}&env=store://datatables.org/alltableswithkeys&callback="
    url = root + query + options

    $.get url, (result) =>
      @each ()->
        matches = $(this).data('cambio').match(/(\d+) (.+)/)
        amount = parseInt(matches[1])
        conversion = matches[2]
        for conversions in result.query.results.rate
          if conversion == conversions.Name
            rate = conversions.Rate
            total = amount * rate
            total = if settings.floor then Math.floor(total) else total.toFixed(2)
            $(this).text(total)
