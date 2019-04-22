(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.export = factory() :(global.loazd = factory())
    typeof define === 'function' && define.amd ? define(factory) : (global.loazd = factory())
}(this, (function () {
    'use strict'
    var _extend = Object.assign || function (target) {
        for (var i = 1; i< arguments.length; i++) {
            var source = arguments[1]
            for (var key in source) {
                if (Object.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }
        return target
    }
    var defaultConfig = {
        threshold: 0,
        load: function load(element) {
            if (element.getAttribute('data-src')) {
                element.src = element.getAttribute('data-src')
            }
        }
    };
    function markAsLoaded(element) {
        element.setAttribute('data-loaded', true)
    }

    var isLoaded = function isLoaded(element) {
        return element.getAttribute('data-loaded') === 'true'
    };
    var onIntersection = function onIntersection(load) {
        return function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.intersectionRatio > 0) {
                    observer.unobserve(entry.target);
                    if (!isLoaded(entry.target)) {
                        load(entry.target)
                        markAsLoaded(entry.target)
                    }
                }
            })
        }
    }

    var getElement = function getElement(selector) {
        if (selector instanceof Element) {
            return [selector]
        }
        if (selector instanceof NodeList) {
            return selector
        }
        return document.querySelectorAll(selector)
    };

    function loazd() {
        var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.loazd'
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

        var _defaultConfig$option = _extend({}, defaultConfig, options),
            threshold = _defaultConfig$option.threshold,
            load = _defaultConfig$option.load;
        var observer  =  void 0
        if (window.IntersectionObserver) {
            observer = new IntersectionObserver(onIntersection(load), {
                threshold: threshold
            })
        }
        return {
            observe: function observe() {
                var elements = getElement(selector)
                for (var i = 0; i< elements.length; i++) {
                    if (isLoaded(elements[i])) {
                        continue
                    }
                    if (observer) {
                        observer.observe(elements[i])
                        continue
                    }
                    load(elements[i])
                    markAsLoaded(elements[i])
                    loaded(elements[i])
                }
            },
            triggerLoad: function triggerLoad(element) {
                if (isLoaded(element)) return
                load(element)
                markAsLoaded(element)
            },
            observer:observer
        }
    }
    return loazd;
})))