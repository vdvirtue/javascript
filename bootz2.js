
window.theme = window.theme || {};
/* ================ SLATE ================ */
theme.CurrencyPicker = function() {
        /**
         * @return {undefined}
         */
        function init() {
            var rule = $(data.currency).first().closest(".currency-wrapper");
            opts.currency_format = rule.find(".currency_format").val();
            opts.shop_currency = rule.find(".shop_currency").val();
            opts.default_currency = rule.find(".default_currency").val();
            opts.money_with_currency_format = rule.find(".money_with_currency_format").val();
            opts.money_format = rule.find(".money_format").val();
            Currency.format = opts.currency_format;
            var l = opts.shop_currency;
            Currency.moneyFormats[l].money_with_currency_format = opts.money_with_currency_format;
            Currency.moneyFormats[l].money_format = opts.money_format;
            var r = opts.default_currency;
            try {
                var next = Currency.cookie.read();
                $("span.money span.money").each(function() {
                    $(this).parents("span.money").removeClass("money");
                });
                $("span.money").each(function() {
                    $(this).attr("data-currency-" + opts.shop_currency, $(this).html());
                });
                if (null == next) {
                    if (l === r) {
                        Currency.currentCurrency = r;
                    } else {
                        Currency.convertAll(l, r);
                    }
                    Currency.cookie.write(r);
                } else {
                    if ($(data.currency).length && 0 === $(data.currency + " .currency[data-code=" + next + "]").size()) {
                        Currency.currentCurrency = l;
                        Currency.cookie.write(l);
                    } else {
                        if (next === l) {
                            Currency.currentCurrency = l;
                        } else {
                            Currency.convertAll(l, next);
                        }
                    }
                }
                $(data.currency).on("click", ".currency:not(.active)", function() {
                    var r20 = $(this).attr("data-code");
                    Currency.convertAll(Currency.currentCurrency, r20);
                    $(data.currencyPicker).removeClass("active");
                    $(data.currencyPicker).closest("li").removeClass("actived");
                    $(this).addClass("active");
                    $(this).closest("li").addClass("actived");
                    $(".menu-item-currency.currency-wrapper").find("span.current").html($(this).html() + '<span class="toggle-children i-icon arrow_carrot-down"></span>');
                });
                var _jQuery = window.selectCallback;
                $("body").on("ajaxCart.afterCartLoad", function() {
                    Currency.convertAll(l, $(data.currencyActive).attr("data-code"));
                    $(data.currencyPicker).removeClass("active");
                    $(data.currencyPicker).closest("li").removeClass("actived");
                    $(data.currency + " .currency[data-code=" + Currency.currentCurrency + "]").addClass("active");
                    $(data.currency + " .currency[data-code=" + Currency.currentCurrency + "]").closest("li").addClass("actived");
                    $(".menu-item-currency.currency-wrapper").find("span.current").html(Currency.currentCurrency + '<span class="toggle-children i-icon arrow_carrot-down"></span>');
                });
                $(data.currencyPicker).removeClass("active");
                $(data.currencyPicker).closest("li").removeClass("actived");
                $(data.currency + " .currency[data-code=" + Currency.currentCurrency + "]").addClass("active");
                $(data.currency + " .currency[data-code=" + Currency.currentCurrency + "]").closest("li").addClass("actived");
                $(".menu-item-currency.currency-wrapper").find("span.current").html(Currency.currentCurrency + '<span class="toggle-children i-icon arrow_carrot-down"></span>');
            } catch (ex) {
                console.log(ex.message);
            }
        }
        var data = {
            currency: ".currency_switcher",
            currencyPicker: ".currency_switcher .currency",
            currencyActive: ".currency_switcher .currency.active"
        };
        var opts = {
            currency_format: "",
            shop_currency: "",
            default_currency: "",
            money_with_currency_format: "",
            money_format: ""
        };
        return {
            /**
             * @return {undefined}
             */
            init: function() {
                if ($(data.currency).length) {
                    init();
                }
            },
            /**
             * @param {string} node
             * @return {undefined}
             */
            convert: function(node) {
                if ($(data.currency).length) {
                    try {
                        $(node).each(function() {
                            $(this).attr("data-currency-" + opts.shop_currency, $(this).html());
                        });
                        Currency.convertAll(opts.shop_currency, Currency.cookie.read(), node, opts.currency_format);
                    } catch (ex) {
                        console.log(ex.message);
                    }
                }
            }
        };
    }(),
theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};
theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },
  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },
  _onSectionUnload: function(evt) {
    this.instances = _.filter(this.instances, function(instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },
  _onSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },
  _onDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },
  _onBlockSelect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },
  _onBlockDeselect: function(evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },
  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(
      function(index, container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  }
});
window.slate = window.slate || {};
/**
 * iFrames
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace iframes
 */
slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    options.$tables.wrap(
      '<div class="' + options.tableWrapperClass + '"></div>'
    );
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + options.iframeWrapperClass + '"></div>');

      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};
window.slate = window.slate || {};
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */
slate.a11y = {
  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element
      .first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element
        .first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on(
      'click',
      function(evt) {
        this.pageLinkFocus($(evt.currentTarget.hash));
      }.bind(this)
    );
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).off('focusin');

    $(document).on(eventName, function(evt) {
      if (
        options.$container[0] !== evt.target &&
        !options.$container.has(evt.target).length
      ) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

$(document).ready(function() {
  var sections = new theme.Sections();
  sections.register('slideshow-section', theme.SlideshowSection);
  sections.register('collection-list-section', theme.Collectionlists)
  sections.register('productlists', theme.Productlists); 
  sections.register('producttabs', theme.Producttabs);
  sections.register('quotes', theme.Quotes);
  sections.register('product-template', theme.Product);
  sections.register('productfeature', theme.productFeature); 
  sections.register('blogs', theme.Blogs);
  sections.register('instagrams', theme.Instagrams);
  sections.register('footerinstagrams', theme.Instagramsfooter);
  sections.register('lookbooks', theme.Lookbooks);
  sections.register('imagebars', theme.Imagebars);
  sections.register('imagelogos', theme.Logobars);
  sections.register('blogmasonry', theme.Blogmasonry); 
  sections.register('map', theme.Maps);
  sections.register('product', theme.Productrelated);
  sections.register('header-section', theme.HeaderSection);
  sections.register('blogpost', theme.Blogloadajax); 
  if ($('#block--newsletter_popup').length) {
    sections.register('popupnewletter', theme.PopupNewletter);
  }
});

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */
theme.Images = (function() {
  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Swaps the src of an image for another OR returns the imageURL to the callback function
   * @param image
   * @param element
   * @param callback
   */
  function switchImage(image, element, callback) {
    var size = this.imageSize(element.src);
    var imageUrl = this.getSizedImageUrl(image.src, size);

    if (callback) {
      callback(imageUrl, image, element); // eslint-disable-line callback-return
    } else {
      element.src = imageUrl;
    }
  }

  /**
   * +++ Useful
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(
      /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/
    );

    if (match !== null) {
      if (match[2] !== undefined) {
        return match[1] + match[2];
      } else {
        return match[1];
      }
    } else {
      return null;
    }
  }

  /**
   * +++ Useful
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(
      /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
    );

    if (match !== null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    }

    return null;
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    switchImage: switchImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();
/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */
theme.Currency = (function() {
  var moneyFormat = '${{amount}}'; // eslint-disable-line camelcase

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        '$1' + thousands
      );
      var centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();
/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist.  Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */
/* ================ GLOBAL ================ */
/*============================================================================
  Drawer modules
==============================================================================*/
theme.Drawers = (function() {
  function Drawer(id, position, options) {
    var defaults = {
      close: '.js-drawer-close',
      open: '.js-drawer-open-' + position,
      openClass: 'js-drawer-open',
      dirOpenClass: 'js-drawer-open-' + position
    };

    this.nodes = {
      $parent: $('html').add('body'),
      $page: $('#PageContainer')
    };

    this.config = $.extend(defaults, options);
    this.position = position;

    this.$drawer = $('#' + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  }

  Drawer.prototype.init = function() {
    $(this.config.open).on('click', $.proxy(this.open, this));
    this.$drawer.on('click', this.config.close, $.proxy(this.close, this));
  };

  Drawer.prototype.open = function(evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to nodes.$page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    this.$drawer.prepareTransition();

    this.nodes.$parent.addClass(
      this.config.openClass + ' ' + this.config.dirOpenClass
    );
    this.drawerIsOpen = true;

    // Set focus on drawer
    slate.a11y.trapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    // Run function when draw opens if set
    if (
      this.config.onDrawerOpen &&
      typeof this.config.onDrawerOpen === 'function'
    ) {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
      this.$activeSource.attr('aria-expanded', 'true');
    }

    this.bindEvents();

    return this;
  };

  Drawer.prototype.close = function() {
    if (!this.drawerIsOpen) {
      // don't close a closed drawer
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger('blur');

    // Ensure closing transition is applied to moved elements, like the nav
    this.$drawer.prepareTransition();

    this.nodes.$parent.removeClass(
      this.config.dirOpenClass + ' ' + this.config.openClass
    );

    this.drawerIsOpen = false;

    // Remove focus on drawer
    slate.a11y.removeTrapFocus({
      $container: this.$drawer,
      namespace: 'drawer_focus'
    });

    this.unbindEvents();
  };

  Drawer.prototype.bindEvents = function() {
    this.nodes.$parent.on(
      'keyup.drawer',
      $.proxy(function(evt) {
        // close on 'esc' keypress
        if (evt.keyCode === 27) {
          this.close();
          return false;
        } else {
          return true;
        }
      }, this)
    );

    // Lock scrolling on mobile
    this.nodes.$page.on('touchmove.drawer', function() {
      return false;
    });

    this.nodes.$page.on(
      'click.drawer',
      $.proxy(function() {
        this.close();
        return false;
      }, this)
    );
  };

  Drawer.prototype.unbindEvents = function() {
    this.nodes.$page.off('.drawer');
    this.nodes.$parent.off('.drawer');
  };

  return Drawer;
})();
/* ================ MODULES ================ */
theme.Header = (function() {
  var selectors = {
    body: 'body',
    navigation: '#AccessibleNav',
    siteNavHasDropdown: '.site-nav--has-dropdown',
    siteNavChildLinks: '.site-nav__child-link',
    siteNavActiveDropdown: '.site-nav--active-dropdown',
    siteNavLinkMain: '.site-nav__link--main',
    siteNavChildLink: '.site-nav__link--last'
  };

  var config = {
    activeClass: 'site-nav--active-dropdown',
    childLinkClass: 'site-nav__child-link'
  };

  var cache = {};

  function init() {
    cacheSelectors();

    cache.$parents.on('click.siteNav', function(evt) {
      var $el = $(this);

      if (!$el.hasClass(config.activeClass)) {
        // force stop the click from happening
        evt.preventDefault();
        evt.stopImmediatePropagation();
      }

      showDropdown($el);
    });

    // check when we're leaving a dropdown and close the active dropdown
    $(selectors.siteNavChildLink).on('focusout.siteNav', function() {
      setTimeout(function() {
        if (
          $(document.activeElement).hasClass(config.childLinkClass) ||
          !cache.$activeDropdown.length
        ) {
          return;
        }

        hideDropdown(cache.$activeDropdown);
      });
    });

    // close dropdowns when on top level nav
    cache.$topLevel.on('focus.siteNav', function() {
      if (cache.$activeDropdown.length) {
        hideDropdown(cache.$activeDropdown);
      }
    });

    cache.$subMenuLinks.on('click.siteNav', function(evt) {
      // Prevent click on body from firing instead of link
      evt.stopImmediatePropagation();
    });
  }

  function cacheSelectors() {
    cache = {
      $nav: $(selectors.navigation),
      $topLevel: $(selectors.siteNavLinkMain),
      $parents: $(selectors.navigation).find(selectors.siteNavHasDropdown),
      $subMenuLinks: $(selectors.siteNavChildLinks),
      $activeDropdown: $(selectors.siteNavActiveDropdown)
    };
  }

  function showDropdown($el) {
    $el.addClass(config.activeClass);

    // close open dropdowns
    if (cache.$activeDropdown.length) {
      hideDropdown(cache.$activeDropdown);
    }

    cache.$activeDropdown = $el;

    // set expanded on open dropdown
    $el.find(selectors.siteNavLinkMain).attr('aria-expanded', 'true');

    setTimeout(function() {
      $(window).on('keyup.siteNav', function(evt) {
        if (evt.keyCode === 27) {
          hideDropdown($el);
        }
      });

      $(selectors.body).on('click.siteNav', function() {
        hideDropdown($el);
      });
    }, 250);
  }

  function hideDropdown($el) {
    // remove aria on open dropdown
    $el.find(selectors.siteNavLinkMain).attr('aria-expanded', 'false');
    $el.removeClass(config.activeClass);

    // reset active dropdown
    cache.$activeDropdown = $(selectors.siteNavActiveDropdown);

    $(selectors.body).off('click.siteNav');
    $(window).off('keyup.siteNav');
  }

  function unload() {
    $(window).off('.siteNav');
    cache.$parents.off('.siteNav');
    cache.$subMenuLinks.off('.siteNav');
    cache.$topLevel.off('.siteNav');
    $(selectors.siteNavChildLink).off('.siteNav');
    $(selectors.body).off('.siteNav');
  }

  return {
    init: init,
    unload: unload
  };
})();
//menu mobile vs type menu
theme.MobileNav = (function() {
  var classes = {
    mobileNavOpenIcon: 'mobile-nav--open',
    mobileNavCloseIcon: 'mobile-nav--close',
    navLinkWrapper: 'mobile-nav__item',
    navLink: 'mobile-nav__link',
    subNavLink: 'mobile-nav__sublist-link',
    return: 'mobile-nav__return-btn',
    subNavActive: 'is-active',
    subNavClosing: 'is-closing',
    navOpen: 'js-menu--is-open',
    subNavShowing: 'sub-nav--is-open',
    thirdNavShowing: 'third-nav--is-open',
    subNavToggleBtn: 'js-toggle-submenu'
  };
  var cache = {};
  var isTransitioning;
  var $activeSubNav;
  var $activeTrigger;
  var menuLevel = 1;
  // Breakpoints from src/stylesheets/global/variables.scss.liquid
  var mediaQuerySmall = 'screen and (max-width: 749px)';
  function menuCanvas(){
//       enquire.register(mediaQuerySmall, {
//       match:  function (){
        //menucanvas
        $('li.mobile--canvas-nav__item').children('.mobile--canvas-nav__icon').next().slideUp(350);
        $('li.mobile--canvas-nav__item').each(function(){          
          if($('li.mobile--canvas-nav__item').hasClass('is-has-submenu')){
            var t = $(this);                                                        
            t.children('.mobile--canvas-nav__icon').click(function(e){
              e.preventDefault();
              var no = $(this);
              no.toggleClass('open');
              no.next().toggleClass('open');				
              no.next().slideToggle('slow'); 
            });
          }
        });
//       },
//     });
    cacheSelectors();
    cache.$mobileNavToggle.on('click', function(){
      if (cache.$mobileNavToggle.hasClass(classes.mobileNavCloseIcon)) {
       	cache.$mobileCanvasNavContainer.prepareTransition().removeClass(classes.navOpen);
        cache.$mobileNavToggle
        .addClass(classes.mobileNavOpenIcon)
        .removeClass(classes.mobileNavCloseIcon);
        cache.$body.removeClass('menu_canvas_open');
      } else {
        cache.$mobileCanvasNavContainer.prepareTransition().addClass(classes.navOpen);
        cache.$mobileNavToggle
        .addClass(classes.mobileNavCloseIcon)
        .removeClass(classes.mobileNavOpenIcon);
        cache.$body.addClass('menu_canvas_open');
        
      }
    });
    cache.$pageContainer.on('click', function(){
      cache.$body.removeClass('menu_canvas_open');
      if (cache.$mobileNavToggle.hasClass(classes.mobileNavCloseIcon)) {
        cache.$mobileCanvasNavContainer.prepareTransition().removeClass(classes.navOpen);
        cache.$mobileNavToggle
        .addClass(classes.mobileNavOpenIcon)
        .removeClass(classes.mobileNavCloseIcon);
      }
    });    
  }
  function init() {
    cacheSelectors();

    cache.$mobileNavToggle.on('click', toggleMobileNav);
    cache.$subNavToggleBtn.on('click.subNav', toggleSubNav);

    // Close mobile nav when unmatching mobile breakpoint
    enquire.register(mediaQuerySmall, {
      unmatch: function() {
        closeMobileNav();
      }
    });
  }

  function toggleMobileNav() {
    if (cache.$mobileNavToggle.hasClass(classes.mobileNavCloseIcon)) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  function cacheSelectors() {
    var classSectionHeader = '#' + $('body').data('styleheader');
    cache = {
      $pageContainer: $('#PageContainer'),
      $siteHeader: $('.site-header'),
      $topbar : $('.topbar '),
      $mobileNavToggle: $('.js-mobile-nav-toggle'),
      $mobileNavContainer: $('.mobile-nav-wrapper'),
      $mobileNav: $('#MobileNav'),
      $sectionHeader: $(classSectionHeader),
      $subNavToggleBtn: $('.' + classes.subNavToggleBtn),
      $mobileCanvasNavContainer: $('.mobile-nav-canvas-wrapper'),
      $MobileNavCanvas: $('#MobileNavCanvas'),
      $body: $('body')
    };
  }

  function openMobileNav() {
    var translateHeaderHeight =
      cache.$siteHeader.outerHeight() +
      cache.$topbar.outerHeight() +
      cache.$siteHeader.offset().top -
      cache.$sectionHeader.offset().top;
    cache.$mobileNavContainer.prepareTransition().addClass(classes.navOpen);

    cache.$mobileNavContainer.css({
      transform: 'translateY(' + translateHeaderHeight + 'px)'
    });

    cache.$pageContainer.css({
      transform:
        'translate3d(0, ' + cache.$mobileNavContainer[0].scrollHeight + 'px, 0)'
    });

    slate.a11y.trapFocus({
      $container: cache.$sectionHeader,
      $elementToFocus: cache.$mobileNav
        .find('.' + classes.navLinkWrapper + ':first')
        .find('.' + classes.navLink),
      namespace: 'navFocus'
    });

    cache.$mobileNavToggle
      .addClass(classes.mobileNavCloseIcon)
      .removeClass(classes.mobileNavOpenIcon);

    // close on escape
    $(window).on('keyup.mobileNav', function(evt) {
      if (evt.which === 27) {
        closeMobileNav();
      }
    });
  }

  function closeMobileNav() {
    cache.$mobileNavContainer.prepareTransition().removeClass(classes.navOpen);

    cache.$mobileNavContainer.css({
      transform: 'translateY(-100%)'
    });

    cache.$pageContainer.removeAttr('style');

    cache.$mobileNavContainer.one(
      'TransitionEnd.navToggle webkitTransitionEnd.navToggle transitionend.navToggle oTransitionEnd.navToggle',
      function() {
        slate.a11y.removeTrapFocus({
          $container: cache.$mobileNav,
          namespace: 'navFocus'
        });
      }
    );

    cache.$mobileNavToggle
      .addClass(classes.mobileNavOpenIcon)
      .removeClass(classes.mobileNavCloseIcon);

    $(window).off('keyup.mobileNav');
  }

  function toggleSubNav(evt) {
    if (isTransitioning) {
      return;
    }

    var $toggleBtn = $(evt.currentTarget);
    var isReturn = $toggleBtn.hasClass(classes.return);
    isTransitioning = true;

    if (isReturn) {
      // Close all subnavs by removing active class on buttons
      $(
        '.' + classes.subNavToggleBtn + '[data-level="' + (menuLevel - 1) + '"]'
      ).removeClass(classes.subNavActive);

      if ($activeTrigger && $activeTrigger.length) {
        $activeTrigger.removeClass(classes.subNavActive);
      }
    } else {
      $toggleBtn.addClass(classes.subNavActive);
    }

    $activeTrigger = $toggleBtn;

    goToSubnav($toggleBtn.data('target'));
  }

  function goToSubnav(target) {
    /*eslint-disable shopify/jquery-dollar-sign-reference */

    var $targetMenu = target
      ? $('.mobile-nav__dropdown[data-parent="' + target + '"]')
      : cache.$mobileNav;

    menuLevel = $targetMenu.data('level') ? $targetMenu.data('level') : 1;

    if ($activeSubNav && $activeSubNav.length) {
      $activeSubNav.prepareTransition().addClass(classes.subNavClosing);
    }

    $activeSubNav = $targetMenu;

    var $elementToFocus = target
      ? $targetMenu.find('.' + classes.subNavLink + ':first')
      : $activeTrigger;

    /*eslint-enable shopify/jquery-dollar-sign-reference */

    var translateMenuHeight = $targetMenu.outerHeight();

    var openNavClass =
      menuLevel > 2 ? classes.thirdNavShowing : classes.subNavShowing;

    cache.$mobileNavContainer
      .css('height', translateMenuHeight)
      .removeClass(classes.thirdNavShowing)
      .addClass(openNavClass);

    if (!target) {
      // Show top level nav
      cache.$mobileNavContainer
        .removeClass(classes.thirdNavShowing)
        .removeClass(classes.subNavShowing);
    }

    // Focusing an item in the subnav early forces element into view and breaks the animation.
    cache.$mobileNavContainer.one(
      'TransitionEnd.subnavToggle webkitTransitionEnd.subnavToggle transitionend.subnavToggle oTransitionEnd.subnavToggle',
      function() {
        slate.a11y.trapFocus({
          $container: $targetMenu,
          $elementToFocus: $elementToFocus,
          namespace: 'subNavFocus'
        });

        cache.$mobileNavContainer.off('.subnavToggle');
        isTransitioning = false;
      }
    );

    
    // Match height of subnav
    cache.$pageContainer.css({
      transform: 'translateY(' + translateMenuHeight + 'px)'
    });

    $activeSubNav.removeClass(classes.subNavClosing);
  }
  
  if ( $('#header-data').attr('data-mobile-style') == 'slide_menu' ) {
    return {
      init: init,
      closeMobileNav: closeMobileNav

    };
  }
    else if( $('#header-data').attr('data-mobile-style') == 'canvas_menu' ){
      return {
        menuCanvas : menuCanvas,
      };   
  }
})(jQuery);

theme.Search = (function() {
  var selectors = {
    search: '.search',
    searchSubmit: '.search__submit',
    searchInput: '.search__input',

    siteHeader: '.site-header',
    siteHeaderSearchToggle: '.site-header__search-toggle',
    siteHeaderSearch: '.site-header__search',
    
    searchBycate: '.searchBycate',
    searchCate: '.listCategorySearch',
    searchListCate: '.contentListCategory',
    searchCurrentCate: '.currentCategory',

    searchDrawer: '.search-bar',
    searchDrawerInput: '.search-bar__input',

    searchHeader: '.search-header',
    searchHeaderInput: '.search-header__input',
    searchHeaderSubmit: '.search-header__submit',

    mobileNavWrapper: '.mobile-nav-wrapper'
  };

  var classes = {
    focus: 'search--focus',
    mobileNavIsOpen: 'js-menu--is-open'
  };

  function init() {

    if (!$(selectors.siteHeader).length) {
      return;
    }
	searchByCategory();
    initDrawer();
    searchSubmit();
    //thanhvn init ajax search
    searchKeyupAction();
    
    var search_parameter = getSearchParameter('search?');

    if(search_parameter.type =="article"){
      $('.page_search_article').show(); 
      $('.loadding.search').hide();
    }else{
      $('.page_search_product').show();
    }
    if(search_parameter.type =="product" && template_page == 'search'){
      $(document).ready(function(){
      	setContentPageSearch(search_parameter);
      });
    }
  }

  function initDrawer() {
    // Add required classes to HTML
    $('#PageContainer').addClass('drawer-page-content');
    $('.js-drawer-open-top')
      .attr('aria-controls', 'SearchDrawer')
      .attr('aria-expanded', 'false');

    theme.SearchDrawer = new theme.Drawers('SearchDrawer', 'top', {
      onDrawerOpen: searchDrawerFocus
    });
  }
  function getSearchParameter(param){
    var location_path = location.pathname;
    var location_search = location.search;
    var path_search = location_path.split('/');
    path_search.length > 3 ? path_search = param + path_search.pop().replace(/&/g, "") : path_search = location_search.split('?').pop();
    if (path_search == '' || location_path.search(param) < 0 ) return {};
    else return JSON.parse( '{"' + decodeURI(path_search.replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}' );
  }
  
  
  function setContentPageSearch(search_parameter){
    if(search_parameter.type == 'product'){
      $.ajax({
          type: "GET",
          url: '/collections/all?view=allproductjson',
          async: !1,
          beforeSend: function() {
            //showLoading()
          },
          complete: function(data) {
            var arr_collection_product = JSON.parse( $("#json-collections", data.responseText).html());
                   
            $('#top-ajax-search').val(search_parameter.s.split("+").join(' '));
            $('#search-category').val(search_parameter.category);
            $('.currentCategory').attr('data-current',search_parameter.category);
            $( ".contentListCategory li a" ).each(function( index ) {
              if($(this).data("current") == search_parameter.category)
                $('.currentCategory').html($(this).html()); 
            });

            var arr_product = [];
            if(search_parameter.category == 'all' || !search_parameter.category){

              for(var collection in arr_collection_product){
                for(var key in arr_collection_product[collection]){
                  var s1 = arr_collection_product[collection][key].title.toLowerCase();
                  var s2 = search_parameter.s.split("+").join(' ');
                  if(s1.indexOf(s2.toLowerCase()) >= 0 && arr_product.indexOf(key) < 0 ){
                    arr_product.push(key);
                  }
                }
              }
            }else{
              for(var key in arr_collection_product[search_parameter.category]){
                var s1 = arr_collection_product[search_parameter.category][key].title.toLowerCase();
                var s2 = search_parameter.s.split("+").join(' ');
                if(s1.indexOf(s2.toLowerCase()) >= 0 && arr_product.indexOf(key) < 0 ){
                  arr_product.push(key);
                }
              }
            }
            var status_display = false;
            $(".product-search-item").each(function() {
              var status = false;
              for(i=0;i<arr_product.length;i++){
                if($(this).data('product-id') == arr_product[i]){
                  status=true;
                  status_display = true;
                  break;
                }
              }
              if(status == true) {
                $(this).css("display",'block');
              }else{
                $(this).remove(); 
              }
            });
            $('.template-search .main-content .loadding').hide();
            $(".page_search_product").css("display",'block');
            if(status_display){
              $(".product-page-search .product-search-item").show();
              $(".error-display").remove();
            }else{
              $(".error-display").css("display",'block');
            }
          },
          error: function(a, b) {
            //hideLoading()
          }
      });

      
    }
  }
  
  

  function searchDrawerFocus() {
    searchFocus($(selectors.searchDrawerInput));

    if ($(selectors.mobileNavWrapper).hasClass(classes.mobileNavIsOpen)) {
      theme.MobileNav.closeMobileNav();
    }
  }

  function searchFocus($el) {
    $el.focus();
    // set selection range hack for iOS
    $el[0].setSelectionRange(0, $el[0].value.length);
  }
  
  function searchByCategory(){    
    $(selectors.searchCurrentCate).click(function(){
    	$(selectors.searchListCate).slideToggle('slow');
    });
    $(selectors.searchListCate).find('li a').each(function(){      
      $(this).click(function(){
      	$(this).closest($(selectors.searchListCate)).prev().html($(this).attr('title'));
        $(this).closest($(selectors.searchListCate)).prev().attr('data-current',$(this).attr('data-current'));
        $(this).closest($(selectors.searchListCate)).prev().prev().attr('value',$(this).attr('data-current'));
        $(selectors.searchListCate).slideUp('slow');
        $(".listCategorySearch input").val($(this).arrt('title'));
      });
    });
    $(document).mouseup(function(e){
      var container = $(selectors.searchHeader);

      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) 
      {
        container.find('#ajax-search-content').slideUp();
        container.find('.contentListCategory').slideUp();
      }
    });
  }

  function searchSubmit() {
    $(selectors.searchSubmit).on('click', function(evt) {
      var $el = $(evt.target);
      var $input = $el.parents(selectors.search).find(selectors.searchInput);
      if ($input.val().length === 0) {
        evt.preventDefault();
        searchFocus($input);
      }
    });
  }

  //THANHN custom ajax search
  function getSearchParameter(param){
    var location_path = location.pathname;
    var location_search = location.search;
    var path_search = location_path.split('/');
    path_search.length > 3 ? path_search = param + path_search.pop().replace(/&/g, "") : path_search = location_search.split('?').pop();
    if (path_search == '' || location_path.search(param) < 0 ) return {};
    else return JSON.parse( '{"' + decodeURI(path_search.replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}' );
  }
  function initAjaxSearchAreaDisplay(){
   	var search_parameter = getSearchParameter('search?');
    if(search_parameter.type =="article"){
      $('.page_search_article').show(); 
      $('.loadding.search').hide();
    }else{
      $('.page_search_product').show();
    } 
  }
  
  function createAjaxSearch(){
    var cat_handle = $("#search-category").val();
    var ajaxsearchcontent = '<ul>';
    if(cat_handle == 'all' || !cat_handle){
      var arr_product = [];
      for(var collection in arr_collection_product){
        for(var key in arr_collection_product[collection]){
          var s1 = arr_collection_product[collection][key].title.toLowerCase();
          var s2 = $("#top-ajax-search").val();
          if(s1.indexOf(s2.toLowerCase()) >= 0 && arr_product.indexOf(key) < 0 ){
            arr_product.push(key);
            ajaxsearchcontent += '<li><a href="'+ arr_collection_product[collection][key].url +'" data-title="'+ arr_collection_product[collection][key].title +'" class="ajaxsearchcontent-item">';
            ajaxsearchcontent += '<img src="'+ arr_collection_product[collection][key].image +'" alt="'+ arr_collection_product[collection][key].title +'">';
            ajaxsearchcontent += '<span>'+ arr_collection_product[collection][key].title +'</span>';
            ajaxsearchcontent += '</a></li>';
          }
        }
      }
    }else{
      for(var key in arr_collection_product[cat_handle]){
        var s1 = arr_collection_product[cat_handle][key].title.toLowerCase();
        var s2 = $("#top-ajax-search").val();
        s2 = s2.toLowerCase();
        if(s1.indexOf(s2) >= 0){
          ajaxsearchcontent += '<li><a href="'+ arr_collection_product[cat_handle][key].url +'" data-title="'+ arr_collection_product[cat_handle][key].title +'" class="ajaxsearchcontent-item">';
          ajaxsearchcontent += '<img src="'+ arr_collection_product[cat_handle][key].image +'" alt="'+ arr_collection_product[cat_handle][key].title +'">';
          ajaxsearchcontent += '<span>'+ arr_collection_product[cat_handle][key].title +'</span>';
          ajaxsearchcontent += '</a></li>';
        }
      }
    }
    ajaxsearchcontent += '</ul>';
    $("#ajax-search-content").html(ajaxsearchcontent);
    $("#ajax-search-content").addClass('active');
  }
  
  function initAllProduct(){
    $.ajax({
        type: "GET",
        url: '/collections/all?view=allproductjson',
        async: !1,
        beforeSend: function() {
          //showLoading()
        },
        complete: function(data) {
          arr_collection_product = JSON.parse( $("#json-collections", data.responseText).html());
          createAjaxSearch();
        },
        error: function(a, b) {
          //hideLoading()
        }
    });
  }
  function doneTypingAjaxSearch(){
    if(arr_collection_product == null){
      initAllProduct();
    }else{
      createAjaxSearch();
    }
  }
  function searchKeyupAction(){
    initAjaxSearchAreaDisplay();
    var typingTimer;                //timer identifier
    var doneTypingInterval = 500;  //time in ms (5 seconds)
    //on keyup, start the countdown
    $('#top-ajax-search').keyup(function(){
      clearTimeout(typingTimer);
      if ($('#top-ajax-search').val() && $('#top-ajax-search').val().length >=3) {
        typingTimer = setTimeout(doneTypingAjaxSearch, doneTypingInterval);
        $("#ajax-search-content").show();
        $("#ajax-search-content").css('border','1px solid #e4e4e4');
      }else{
        $("#ajax-search-content").hide();
      }
    });
  }
  
  
  // end ajax search
  
  return {
    init: init
  };
})();
//menu
theme.Menus = (function() {
   function init() {
     var mediaQueryMobile = 'screen and (max-width: 991px)';
     
     var mediaQueryMedium = 'screen and (min-width: 992px)';
    
     var heightHeader =  $('.announcement-bar').height() + 30;
     var attrShow = $('#SiteNavVertical').attr('data-showindex');
        
     function StickyHeaderScroll(){
       $(window).scroll(function(){
         var winTop = $(window).scrollTop();
         if(winTop >= heightHeader){
           $('[data-sticky="true"]').closest('body').addClass('sticky-header');
           enquire.register(mediaQueryMedium, {
             match: function(){
               if($('body').hasClass('template-index') &&  $('.site-header').data('sticky') == true ){
                 $('#SiteNavVertical').slideUp('slow');
               }else if( $('body').hasClass('template-index') &&  $('.site-header').data('sticky') == false  ){
                 if (typeof attrShow !== typeof undefined && attrShow !== false) {
                   $('#SiteNavVertical').slideDown('slow');
                 }else{
                   $('#SiteNavVertical').slideUp('slow');
                 }
               }
             },
           }); 
         }else{
           $('[data-sticky="true"]').closest('body').removeClass('sticky-header');
           enquire.register(mediaQueryMedium, {
             match: function(){
               if($('body').hasClass('template-index')){
                 if (typeof attrShow !== typeof undefined && attrShow !== false) {
                   $('#SiteNavVertical').slideDown('slow');
                 }else{
                   $('#SiteNavVertical').slideUp('slow');
                 }
               }
             },
           }); 
         }
       });
     }
     function StickyHeader(){
       
       enquire.register(mediaQueryMobile, {
         match: function(){
           if( $('.site-header').data('stickymobile') == false ){

               $('[data-sticky="true"]').closest('body').removeClass('sticky-header');
           }else{
				StickyHeaderScroll();
           }
         },
       });                    
       enquire.register(mediaQueryMedium, {
         
         match:  function (){
			StickyHeaderScroll();
         },
       });
     }   
     function breacrumbCategory(){
       if($('.catebreacumb').find('li a.active').hasClass('leve2')){
       		var taglink = $('.catebreacumb').find('li a.active').closest('.parent1').children('a').first().attr('href'); 
         	var str = $('.catebreacumb').find('li a.active').closest('.parent1').children('a').first().text();
            $('.linkparent').append('<a href ="' + taglink + '">' + str + '</a> <span class="breadcrumb-nav__separator" aria-hidden="true">›</span>');
       }else if ($('.catebreacumb').find('li a.active').hasClass('leve3')) {
           var taglink = $('.catebreacumb').find('li a.active').closest('.parent1').children('a').first().attr('href'); 
           var str = $('.catebreacumb').find('li a.active').closest('.parent1').children('a').first().text();
           var taglinksecon = $('.catebreacumb').find('li a.active').closest('.parent2').children('a').first().attr('href'); 
           var strsecon = $('.catebreacumb').find('li a.active').closest('.parent2').children('a').first().text();
           $('.linkparent').append('<a href ="' + taglink + '">' + str + '</a> <span class="breadcrumb-nav__separator" aria-hidden="true">›</span>').append('<a href ="' + taglinksecon + '">' + strsecon + '</a> <span class="breadcrumb-nav__separator" aria-hidden="true">›</span>');
       }
     }
     function ScrollTab(){    
       // Add smooth scrolling to all links
       $("#left_column_shortcode a").on('click', function(event) {

         // Make sure this.hash has a value before overriding default behavior
         if (this.hash !== "") {
           // Prevent default anchor click behavior
           event.preventDefault();

           // Store hash
           var hash = this.hash;

           // Using jQuery's animate() method to add smooth page scroll
           // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
           $('html, body').animate({
             scrollTop: $(hash).offset().top
           }, 800, function(){

             // Add hash (#) to URL when done scrolling (default click behavior)
             window.location.hash = hash;
           });
         } // End if
       });
     }
  	 function Horizontalmenus() {
    $('.mega-menu').each(function(i){
      var i = i + 1;
      var contentPop = $('#mega-menu-' + i).html();
      var url = $('#mega-menu-' + i).attr('data-url');
      var checkIcon = $('#mega-menu-' + i).attr('data-check');
      var urlImage = $('#mega-menu-' + i).attr('data-url-image');
      var htmlIcon = $('#mega-menu-' + i).attr('data-icon'); 
      $('#content-mega-menu-' + i).attr('href', url)
      $('#content-mega-menu-' + i).parent().append(contentPop);
      if(checkIcon === "true"){
        if(urlImage != ''){
          $('#content-mega-menu-' + i).prepend("<img src= " + "'" + urlImage + "'" + "alt='icon'" + "/>");
        }
      }else{
        if(htmlIcon != ''){
          $('#content-mega-menu-' + i).prepend(htmlIcon);
        }
      }
    });
    
  }
  	 function Verticalmenus() {
    $('.vertical-mega-menu').each(function(i){
      var i = i + 1;
      var contentVer = $('#vertical-mega-menu-' + i).html();
      var urlVer = $('#vertical-mega-menu-' + i).attr('data-url');
      var desVer = $('#vertical-mega-menu-' + i).attr('data-shortdes');
      var checkIcon = $('#vertical-mega-menu-' + i).attr('data-check');
      var urlImage = $('#vertical-mega-menu-' + i).attr('data-url-image');
      var htmlIcon = $('#vertical-mega-menu-' + i).attr('data-icon');      
      if (typeof desVer !== typeof undefined && desVer !== false) {
        if(desVer != ''){
          $('#content-vertical-mega-menu-' + i).append("<p><em>"+ desVer +"</em></p");
        }
      } 
      if(checkIcon === "true"){
        if(urlImage != ''){
          $('#content-vertical-mega-menu-' + i).prepend("<img src= " + "'" + urlImage + "'" + "alt='icon'" + "/>");
        }
      }else{
        if(htmlIcon != ''){
          $('#content-vertical-mega-menu-' + i).prepend(htmlIcon);
        }
      }

      $('#content-vertical-mega-menu-' + i).attr('href', urlVer);
      $('#content-vertical-mega-menu-' + i).parent().append(contentVer);
    });
    
    $(".navbar-vertical--apollo .dropdown-toggle").click(function(e) {
      $(this).closest("li").toggleClass("menu-open");
      e.stopPropagation();
    });
    $(".mega-col-inner .vertical-toggle").click(function(e) {
      $(this).parent().next().toggleClass("menu-open");
      e.stopPropagation();
    });
       
       if($('body').hasClass('template-index')){
         enquire.register(mediaQueryMedium, {
           match: function(){
             if (typeof attrShow !== typeof undefined && attrShow !== false) {
               $('#SiteNavVertical').slideDown('slow');
             }else{
               $('#SiteNavVertical').slideUp('slow');
             }
           },
         }); 
         enquire.register(mediaQueryMobile, {
           match: function(){
             $('#SiteNavVertical').slideUp('slow');
           },
         }); 
       }else{
         $('#SiteNavVertical').slideUp('slow');
       }

       $('#verticalapollomenu .title_vertical').click(function(){
         $('#SiteNavVertical').slideToggle('slow');
       })
  }
     function ResponsiveMenu(){
       enquire.register(mediaQueryMedium, {
         match: function(){
           $('.block-megamenu').each(function(){
             if ($(this).hasClass("block-megamenu--customwidth")) {
               if($(this).width() > $( window ).width()){
               	  $(this).css('width', $( window ).width() - 30);
               }
             }
           });
           
           $('.block-megamenu-vertical').each(function(){
             if ($(this).hasClass("block-megamenu--customwidth")) {   
               var widthMega = $( window ).width() - 337 - 30;
               if(widthMega < $( this ).width()){
                 $(this).css('width', widthMega);
               }
             }
           });
         }
       });
     }
   
     Horizontalmenus();
     breacrumbCategory();
     Verticalmenus();
     ResponsiveMenu();
     StickyHeader();
     ScrollTab();
   }
  return {
    init: init
  };
})();
//accordion
theme.Accordion = (function(){
  var mediaQueryMobile = 'screen and (max-width: 767px)';
   var mediaQueryMedium = 'screen and (min-width: 768px)';
  function Accordion(){
    enquire.register(mediaQueryMobile, {
      match: function(){
          $('.block.acccordion .block__title, .block.acccordion  .block_heading').on('click',function(e) {
            e.preventDefault();
            var $this = $(this);
            if ($this.next().hasClass('show')) {
              $this.addClass('show');
              $this.next().slideUp(350);
            } else {
              $this.toggleClass('show');
              $this.next().slideToggle(350);
            }
          });        
      },
    });
    enquire.register(mediaQueryMedium, {
      match:  function (){
        $('.block.acccordion .block__title, .block.acccordion  .block_heading').off( "click");
        $('.block.acccordion .block__title, .block.acccordion  .block_heading').next().show();
        $('.block.acccordion .block__title, .block.acccordion  .block_heading').removeClass('show');
      },
    });
  }
  return {init: Accordion()};
})();
//back to top
theme.BackToTop = (function(){
function backtotop(){
  $("#back-top").hide();
  $(function () {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $('#back-top').fadeIn();
      } else {
        $('#back-top').fadeOut();
      }});
    $('#back-top a').click(function () {
      $('body,html').animate({scrollTop: 0}, 800);
      return false;
    });
  });
}
  return {init: backtotop()};
})();
(function() {
  var selectors = {
    backButton: '.return-link'
  };

  var $backButton = $(selectors.backButton);

  if (!document.referrer || !$backButton.length || !window.history.length) {
    return;
  }

  $backButton.one('click', function(evt) {
    evt.preventDefault();

    var referrerDomain = urlDomain(document.referrer);
    var shopDomain = urlDomain(window.location.href);

    if (shopDomain === referrerDomain) {
      history.back();
    }

    return false;
  });

  function urlDomain(url) {
    var anchor = document.createElement('a');
    anchor.ref = url;

    return anchor.hostname;
  }
})();
theme.Slideshow = (function() {
  this.$slideshow = null;
  var classes = {
    wrapper: 'slideshow-wrapper',
    slideshow: 'slideshow',
    currentSlide: 'slick-current',
    video: 'slideshow__video',
    videoBackground: 'slideshow__video--background',
    closeVideoBtn: 'slideshow__video-control--close',
    pauseButton: 'slideshow__pause',
    isPaused: 'is-paused'
  };

  function slideshow(el) {
    this.$slideshow = $(el);
    this.$wrapper = this.$slideshow.closest('.' + classes.wrapper);
    this.$pause = this.$wrapper.find('.' + classes.pauseButton);

    this.settings = {
      accessibility: true,
      arrows: this.$slideshow.data('arrow'),
      dots: this.$slideshow.data('dot'),
      fade: true,
      draggable: true,
      touchThreshold: 20,
      rtl: checkrtl, 
      autoplay: this.$slideshow.data('autoplay'),
      autoplaySpeed: this.$slideshow.data('speed')
    };
    if($('.' + classes.slideshow).data('animation') === true){
      this.$slideshow.on('init', initDataAnimation.bind(this));
    }
    this.$slideshow.on('beforeChange', beforeChange.bind(this));   

    this.$slideshow.on('init', slideshowA11y.bind(this));
    this.$slideshow.slick(this.settings);
    this.$pause.on('click', this.togglePause.bind(this));
  }

  //ticking machine
  var time =2;
  var $bar,
      $slick,
      isPause,
      tick,
      percentTime;
  
  $slick = $('.slideshow');

  $bar = $('.slider-progress .progressshow');
  
  $('.slideshow-wrapper').on({
    mouseenter: function() {
      isPause = true;
    },
    mouseleave: function() {
      isPause = false;
    }
  })
  
  function startProgressbar() {
    resetProgressbar();
    percentTime = 0;
    isPause = false;
    tick = setInterval(interval, 10);
  }
  
  function interval() {
    if(isPause === false) {
      percentTime += 1 / (time + 5);
      $bar.css({
        width: percentTime+"%"
      });
      if(percentTime >= 100)
        {
          $slick.slick('slickNext');
          startProgressbar();
        }
    }
  }
  
  
  function resetProgressbar() {
    $bar.css({
     width: 0+'%' 
    });
    clearTimeout(tick);
  }
  
  
  function initDataAnimation(e,slick){
  	 var $firstAnimatingElements = $('.slideshow__slide:first-child').find('[data-animation]');
        doAnimations($firstAnimatingElements);    
    }
  function slideshowA11y(event, obj) {
    var $slider = obj.$slider;
    var $list = obj.$list;
    var $wrapper = this.$wrapper;
    var autoplay = this.settings.autoplay;

    // Remove default Slick aria-live attr until slider is focused
    $list.removeAttr('aria-live');

    // When an element in the slider is focused
    // pause slideshow and set aria-live.
    $wrapper.on('focusin', function(evt) {
      if (!$wrapper.has(evt.target).length) {
        return;
      }

      $list.attr('aria-live', 'polite');

      if (autoplay) {
        $slider.slick('slickPause');
      }
    });

    // Resume autoplay
    $wrapper.on('focusout', function(evt) {
      if (!$wrapper.has(evt.target).length) {
        return;
      }

      $list.removeAttr('aria-live');

      if (autoplay) {
        // Manual check if the focused element was the video close button
        // to ensure autoplay does not resume when focus goes inside YouTube iframe
        if ($(evt.target).hasClass(classes.closeVideoBtn)) {
          return;
        }

        $slider.slick('slickPlay');
      }
    });

    // Add arrow key support when focused
    if (obj.$dots) {
      obj.$dots.on('keydown', function(evt) {
        if (evt.which === 37) {
          $slider.slick('slickPrev');
        }

        if (evt.which === 39) {
          $slider.slick('slickNext');
        }

        // Update focus on newly selected tab
        if (evt.which === 37 || evt.which === 39) {
          obj.$dots.find('.slick-active button').focus();
        }
      });
    }
  }

 function beforeChange(event, slick, currentSlide, nextSlide) {
    var $slider = slick.$slider;
    var $currentSlide = $slider.find('.' + classes.currentSlide);
    var $nextSlide = $slider.find(
      '.slideshow__slide[data-slick-index="' + nextSlide + '"]'
    );
    if($('.' + classes.slideshow).data('animation') === true){
      var $animatingElements = $('.slideshow__slide[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
      doAnimations($animatingElements);  
    }
    if (isVideoInSlide($currentSlide)) {
      var $currentVideo = $currentSlide.find('.' + classes.video);
      var currentVideoId = $currentVideo.attr('id');
      theme.SlideshowVideo.pauseVideo(currentVideoId);
      $currentVideo.attr('tabindex', '-1');
    }

    if (isVideoInSlide($nextSlide)) {
      var $video = $nextSlide.find('.' + classes.video);
      var videoId = $video.attr('id');
      var isBackground = $video.hasClass(classes.videoBackground);
      if (isBackground) {
        theme.SlideshowVideo.playVideo(videoId);
      } else {
        $video.attr('tabindex', '0');
      }
    }
    if( $('.' + classes.slideshow).data('process') === true  && $('.' + classes.slideshow).data('autoplay') === true ) {
      startProgressbar();
    }
  }
  function afterChange(event, slick, currentSlide) {
    if( $('.' + classes.slideshow).data('process') === true  && $('.' + classes.slideshow).data('autoplay') === true ){
      startProgressbar();
    }
  }

  function doAnimations(elements) {
    var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    elements.each(function() {
      var $this = $(this);
      var $animationDelay = $this.data('delay');
      var $animationType = 'animated ' + $this.data('animation');
      $this.css({
        'animation-delay': $animationDelay,
        '-webkit-animation-delay': $animationDelay
      });
      $this.addClass($animationType).one(animationEndEvents, function() {
        $this.removeClass($animationType);
      });
    });
  }

  function isVideoInSlide($slide) {
    return $slide.find('.' + classes.video).length;
  }  

  slideshow.prototype.togglePause = function() {
    var slideshowSelector = getSlideshowId(this.$pause);
    if (this.$pause.hasClass(classes.isPaused)) {
      this.$pause.removeClass(classes.isPaused);
      $(slideshowSelector).slick('slickPlay');
    } else {
      this.$pause.addClass(classes.isPaused);
      $(slideshowSelector).slick('slickPause');
    }
  };

  function getSlideshowId($el) {
    return '#Slideshow-' + $el.data('id');
  }

  return slideshow;
})();
// Youtube API callback
// eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
  theme.SlideshowVideo.loadVideos();
}
theme.SlideshowVideo = (function() {
  var autoplayCheckComplete = false;
  var autoplayAvailable = false;
  var playOnClickChecked = false;
  var playOnClick = false;
  var youtubeLoaded = false;
  var videos = {};
  var videoPlayers = [];
  var videoOptions = {
    ratio: 16 / 9,
    playerVars: {
      // eslint-disable-next-line camelcase
      iv_load_policy: 3,
      modestbranding: 1,
      autoplay: 0,
      controls: 0,
      showinfo: 0,
      wmode: 'opaque',
      branding: 0,
      autohide: 0,
      rel: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerChange
    }
  };
  var classes = {
    playing: 'video-is-playing',
    paused: 'video-is-paused',
    loading: 'video-is-loading',
    loaded: 'video-is-loaded',
    slideshowWrapper: 'slideshow-wrapper',
    slide: 'slideshow__slide',
    slideBackgroundVideo: 'slideshow__slide--background-video',
    slideDots: 'slick-dots',
    videoChrome: 'slideshow__video--chrome',
    videoBackground: 'slideshow__video--background',
    playVideoBtn: 'slideshow__video-control--play',
    closeVideoBtn: 'slideshow__video-control--close',
    currentSlide: 'slick-current',
    slickClone: 'slick-cloned',
    supportsAutoplay: 'autoplay',
    supportsNoAutoplay: 'no-autoplay'
  };

  /**
    * Public functions
   */
  function init($video) {
    if (!$video.length) {
      return;
    }

    videos[$video.attr('id')] = {
      id: $video.attr('id'),
      videoId: $video.data('id'),
      type: $video.data('type'),
      status: $video.data('type') === 'chrome' ? 'closed' : 'background', // closed, open, background
      videoSelector: $video.attr('id'),
      $parentSlide: $video.closest('.' + classes.slide),
      $parentSlideshowWrapper: $video.closest('.' + classes.slideshowWrapper),
      controls: $video.data('type') === 'background' ? 0 : 1,
      slideshow: $video.data('slideshow')
    };

    if (!youtubeLoaded) {
      // This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  function customPlayVideo(playerId) {
    // Do not autoplay just because the slideshow asked you to.
    // If the slideshow asks to play a video, make sure
    // we have done the playOnClick check first
    if (!playOnClickChecked && !playOnClick) {
      return;
    }

    if (playerId && typeof videoPlayers[playerId].playVideo === 'function') {
      privatePlayVideo(playerId);
    }
  }

  function pauseVideo(playerId) {
    if (
      videoPlayers[playerId] &&
      typeof videoPlayers[playerId].pauseVideo === 'function'
    ) {
      videoPlayers[playerId].pauseVideo();
    }
  }

  function loadVideos() {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var args = $.extend({}, videoOptions, videos[key]);
        args.playerVars.controls = args.controls;
        videoPlayers[key] = new YT.Player(key, args);
      }
    }

    initEvents();
    youtubeLoaded = true;
  }

  function loadVideo(key) {
    if (!youtubeLoaded) {
      return;
    }
    var args = $.extend({}, videoOptions, videos[key]);
    args.playerVars.controls = args.controls;
    videoPlayers[key] = new YT.Player(key, args);

    initEvents();
  }

  /**
    * Private functions
   */

  function privatePlayVideo(id, clicked) {
    var videoData = videos[id];
    var player = videoPlayers[id];
    var $slide = videos[id].$parentSlide;

    if (playOnClick) {
      // playOnClick means we are probably on mobile (no autoplay).
      // setAsPlaying will show the iframe, requiring another click
      // to play the video.
      setAsPlaying(videoData);
    } else if (clicked || (autoplayCheckComplete && autoplayAvailable)) {
      // Play if autoplay is available or clicked to play
      $slide.removeClass(classes.loading);
      setAsPlaying(videoData);
      player.playVideo();
      return;
    }

    // Check for autoplay if not already done
    if (!autoplayCheckComplete) {
      autoplayCheckFunction(player, $slide);
    }
  }

  function setAutoplaySupport(supported) {
    var supportClass = supported
      ? classes.supportsAutoplay
      : classes.supportsNoAutoplay;
    $(document.documentElement).addClass(supportClass);

    if (!supported) {
      playOnClick = true;
    }

    autoplayCheckComplete = true;
  }

  function autoplayCheckFunction(player, $slide) {
    // attempt to play video
    player.playVideo();

    autoplayTest(player)
      .then(function() {
        setAutoplaySupport(true);
      })
      .fail(function() {
        // No autoplay available (or took too long to start playing).
        // Show fallback image. Stop video for safety.
        setAutoplaySupport(false);
        player.stopVideo();
      })
      .always(function() {
        autoplayCheckComplete = true;
        $slide.removeClass(classes.loading);
      });
  }

  function autoplayTest(player) {
    var deferred = $.Deferred();
    var wait;
    var timeout;

    wait = setInterval(function() {
      if (player.getCurrentTime() <= 0) {
        return;
      }

      autoplayAvailable = true;
      clearInterval(wait);
      clearTimeout(timeout);
      deferred.resolve();
    }, 500);

    timeout = setTimeout(function() {
      clearInterval(wait);
      deferred.reject();
    }, 4000); // subjective. test up to 8 times over 4 seconds

    return deferred;
  }

  function playOnClickCheck() {
    // Bail early for a few instances:
    // - small screen
    // - device sniff mobile browser

    if (playOnClickChecked) {
      return;
    }

    if ($(window).width() < 750) {
      playOnClick = true;
    } else if (window.mobileCheck()) {
      playOnClick = true;
    }

    if (playOnClick) {
      // No need to also do the autoplay check
      setAutoplaySupport(false);
    }

    playOnClickChecked = true;
  }

  // The API will call this function when each video player is ready
  function onPlayerReady(evt) {
    evt.target.setPlaybackQuality('hd1080');
    var videoData = getVideoOptions(evt);

    playOnClickCheck();

    // Prevent tabbing through YouTube player controls until visible
    $('#' + videoData.id).attr('tabindex', '-1');

    sizeBackgroundVideos();

    // Customize based on options from the video ID
    switch (videoData.type) {
      case 'background-chrome':
      case 'background':
        evt.target.mute();
        // Only play the video if it is in the active slide
        if (videoData.$parentSlide.hasClass(classes.currentSlide)) {
          privatePlayVideo(videoData.id);
        }
        break;
    }

    videoData.$parentSlide.addClass(classes.loaded);
  }

  function onPlayerChange(evt) {
    var videoData = getVideoOptions(evt);

    switch (evt.data) {
      case 0: // ended
        setAsFinished(videoData);
        break;
      case 1: // playing
        setAsPlaying(videoData);
        break;
      case 2: // paused
        setAsPaused(videoData);
        break;
    }
  }

  function setAsFinished(videoData) {
    switch (videoData.type) {
      case 'background':
        videoPlayers[videoData.id].seekTo(0);
        break;
      case 'background-chrome':
        videoPlayers[videoData.id].seekTo(0);
        closeVideo(videoData.id);
        break;
      case 'chrome':
        closeVideo(videoData.id);
        break;
    }
  }

  function setAsPlaying(videoData) {
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;

    $slide.removeClass(classes.loading);

    // Do not change element visibility if it is a background video
    if (videoData.status === 'background') {
      return;
    }

    $('#' + videoData.id).attr('tabindex', '0');

    switch (videoData.type) {
      case 'chrome':
      case 'background-chrome':
        $slideshow.removeClass(classes.paused).addClass(classes.playing);
        $slide.removeClass(classes.paused).addClass(classes.playing);
        break;
    }

    // Update focus to the close button so we stay within the slide
    $slide.find('.' + classes.closeVideoBtn).focus();
  }

  function setAsPaused(videoData) {
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;

    if (videoData.type === 'background-chrome') {
      closeVideo(videoData.id);
      return;
    }

    // YT's events fire after our click event. This status flag ensures
    // we don't interact with a closed or background video.
    if (videoData.status !== 'closed' && videoData.type !== 'background') {
      $slideshow.addClass(classes.paused);
      $slide.addClass(classes.paused);
    }

    if (videoData.type === 'chrome' && videoData.status === 'closed') {
      $slideshow.removeClass(classes.paused);
      $slide.removeClass(classes.paused);
    }

    $slideshow.removeClass(classes.playing);
    $slide.removeClass(classes.playing);
  }

  function closeVideo(playerId) {
    var videoData = videos[playerId];
    var $slideshow = videoData.$parentSlideshowWrapper;
    var $slide = videoData.$parentSlide;
    var classesToRemove = [classes.pause, classes.playing].join(' ');

    $('#' + videoData.id).attr('tabindex', '-1');

    videoData.status = 'closed';

    switch (videoData.type) {
      case 'background-chrome':
        videoPlayers[playerId].mute();
        setBackgroundVideo(playerId);
        break;
      case 'chrome':
        videoPlayers[playerId].stopVideo();
        setAsPaused(videoData); // in case the video is already paused
        break;
    }

    $slideshow.removeClass(classesToRemove);
    $slide.removeClass(classesToRemove);
  }

  function getVideoOptions(evt) {
    return videos[evt.target.h.id];
  }

  function startVideoOnClick(playerId) {
    var videoData = videos[playerId];
    // add loading class to slide
    videoData.$parentSlide.addClass(classes.loading);

    videoData.status = 'open';

    switch (videoData.type) {
      case 'background-chrome':
        unsetBackgroundVideo(playerId, videoData);
        videoPlayers[playerId].unMute();
        privatePlayVideo(playerId, true);
        break;
      case 'chrome':
        privatePlayVideo(playerId, true);
        break;
    }

    // esc to close video player
    $(document).on('keydown.videoPlayer', function(evt) {
      if (evt.keyCode === 27) {
        closeVideo(playerId);
      }
    });
  }

  function sizeBackgroundVideos() {
    $('.' + classes.videoBackground).each(function(index, el) {
      sizeBackgroundVideo($(el));
    });
  }

  function sizeBackgroundVideo($player) {
    var $slide = $player.closest('.' + classes.slide);
    // Ignore cloned slides
    if ($slide.hasClass(classes.slickClone)) {
      return;
    }
    var slideWidth = $slide.width();
    var playerWidth = $player.width();
    var playerHeight = $player.height();

    // when screen aspect ratio differs from video, video must center and underlay one dimension
    if (slideWidth / videoOptions.ratio < playerHeight) {
      playerWidth = Math.ceil(playerHeight * videoOptions.ratio); // get new player width
      $player
        .width(playerWidth)
        .height(playerHeight)
        .css({
          left: (slideWidth - playerWidth) / 2,
          top: 0
        }); // player width is greater, offset left; reset top
    } else {
      // new video width < window width (gap to right)
      playerHeight = Math.ceil(slideWidth / videoOptions.ratio); // get new player height
      $player
        .width(slideWidth)
        .height(playerHeight)
        .css({
          left: 0,
          top: (playerHeight - playerHeight) / 2
        }); // player height is greater, offset top; reset left
    }

    $player.prepareTransition().addClass(classes.loaded);
  }

  function unsetBackgroundVideo(playerId) {
    // Switch the background-chrome to a chrome-only player once played
    $('#' + playerId)
      .removeAttr('style')
      .removeClass(classes.videoBackground)
      .addClass(classes.videoChrome);

    videos[playerId].$parentSlideshowWrapper
      .removeClass(classes.slideBackgroundVideo)
      .addClass(classes.playing);

    videos[playerId].$parentSlide
      .removeClass(classes.slideBackgroundVideo)
      .addClass(classes.playing);

    videos[playerId].status = 'open';
  }

  function setBackgroundVideo(playerId) {
    // Switch back to background-chrome when closed
    var $player = $('#' + playerId)
      .addClass(classes.videoBackground)
      .removeClass(classes.videoChrome);

    videos[playerId].$parentSlide.addClass(classes.slideBackgroundVideo);

    videos[playerId].status = 'background';
    sizeBackgroundVideo($player);
  }

  function initEvents() {
    $(document).on('click.videoPlayer', '.' + classes.playVideoBtn, function(
      evt
    ) {
      var playerId = $(evt.currentTarget).data('controls');
      startVideoOnClick(playerId);
    });

    $(document).on('click.videoPlayer', '.' + classes.closeVideoBtn, function(
      evt
    ) {
      var playerId = $(evt.currentTarget).data('controls');
      closeVideo(playerId);
    });

    // Listen to resize to keep a background-size:cover-like layout
    $(window).on(
      'resize.videoPlayer',
      $.debounce(250, function() {
        if (youtubeLoaded) {
          sizeBackgroundVideos();
        }
      })
    );
  }

  function removeEvents() {
    $(document).off('.videoPlayer');
    $(window).off('.videoPlayer');
  }

  return {
    init: init,
    loadVideos: loadVideos,
    loadVideo: loadVideo,
    playVideo: customPlayVideo,
    pauseVideo: pauseVideo,
    removeEvents: removeEvents
  };
})();
/* ================ TEMPLATES ================ */
(function() {
  var $filterBy = $('#BlogTagFilter');

  if (!$filterBy.length) {
    return;
  }

  $filterBy.on('change', function() {
    location.href = $(this).val();
  });
})();

// cart popup
theme.GridOption = (function() {
    function clickEvent() {
        $('body').on('click', '.productitem-option1-js a', function(e) {
            var $this = $(this);
            optionsHandler(e, $this);
            var val = '.' + $this.attr("data-tag") + '-js';
            var _parent = $this.closest('.option-block');
            val = _parent.optionsSetParams(val, '.productitem-option2-js');
            _parent.optionsSetParams(val, '.productitem-option3-js');
        })
        $("body").on("click", ".productitem-option1-js a", function(e) {
                var t = $(this);
                optionsHandler(e, t);
                var n = "." + t.attr("data-tag") + "-js";
                t.closest(".option-block").optionsSetParams(n, ".productitem-option2-js")
            }),
            $("body").on("click", ".productitem-option2-js a", function(e) {
                optionsHandler(e, $(this))
            })

        $('body').on('click', '.productitem-option3-js a', function(e) {
            optionsHandler(e, $(this));
        });
    }

    function optionsHandler(e, $this) {
        e.preventDefault();
        if ($this.parent().hasClass('active')) return false;
        ChangeInfo($this);
    }

    function ChangeInfo($this) {
        $this.parent().parent().find(".active").removeClass('active');
        $this.parent().addClass('active');

        var $pr_parent = $this.closest('.product-js');

        var img_src = $this.attr('data-img');
        $pr_parent.find('img').first().removeAttr('srcset');
        if (img_src != '') $pr_parent.find('img').first().attr('src', img_src);

        $pr_parent.find('.addtocart-item-js').attr('href', '/cart/add.js?quantity=1&id=' + $this.attr('data-var_id'));

        var mainprice = $pr_parent.find('.price span:first-child');
        var oldprice = $pr_parent.find('.old-price');
        mainprice.html(Shopify.formatMoney($this.attr('data-price'), money_format));
        var compprice = String($this.attr('data-compprice'));
        oldprice.html(Shopify.formatMoney(compprice, money_format));
        if (!compprice) {
            !oldprice.hasClass('hide') && oldprice.addClass('hide');
            mainprice.hasClass('new-price') && mainprice.removeClass('new-price');
        } else {
            oldprice.hasClass('hide') && oldprice.removeClass('hide');
            !mainprice.hasClass('new-price') && mainprice.addClass('new-price');
        }
    }

    $.fn.optionsSetParams = function(val, str) {
        var _opt = this.find(str);
        if (_opt.length == 0) return false;
        _opt.show().find('li').each(function() {
            $(this).hide().removeClass('active')
        });
        if (_opt.find(val).length == 0) return false;
        _opt.find(val).show().first().addClass('active');
        return '.' + _opt.find('.active').find('a').attr("data-tag") + '-js';
    }

    return {

        init: function() {
            clickEvent();

        }

    }
})();
theme.SwatchStructor = function(Jsondata, StructorFunction) {
        var Parent = this;
        Parent.viewDesign = window[StructorFunction['viewDesign']];
        Parent.productavailable = Jsondata.available && Jsondata.options != 'Title';
        Parent.product_fulldata = Jsondata;
        Parent.options_name = '';
        Parent.options = '';
        Parent.contentParent = StructorFunction['contentParent'];
        Parent.enableHistoryState = Boolean(StructorFunction['enableHistoryState']) || false;
        Parent.callback = StructorFunction['callback'] || false;
        Parent.texture_obj = StructorFunction['externalImagesObject'] || {};
        Parent.colors_obj = StructorFunction['externalColors'] || {};
        Parent.productavailable && $(Parent.contentParent).length ? Parent.initSwatches() : Parent.callExternalVariantHandler(Parent.callback, Jsondata.variants[0], Parent.getJsonObject());
    },
theme.SwatchStructor.prototype.delete = function() {
    var $parent = $(this.contentParent);
    $parent.find('a').unbind();
    $parent.find('select').unbind();
    $parent.empty();

},
theme.SwatchStructor.prototype.SlideSwatchQuickview = function(){
	alert(1);
}
theme.SwatchStructor.prototype.initSwatches = function() {
    var Parent = this;
    var arr = [];
    var options_object = false;

    options_object = Parent.getJsonObject().options;
    for (var i = 0; i < options_object.length; i++) {
        arr[i] = Object(options_object[i]).name;
    }
    Parent.options_name = arr;

    Parent.options = getAllOptions(Parent.getJsonObject().variants);
    var variant_id = Parent.enableHistoryState && getVariantIdUrl();
    Parent.createSwatches(variant_id);
},
theme.SwatchStructor.prototype.createSwatches = function(variant_id) {
    var Parent = this;
    var fn = Parent.viewDesign;

    if (isEmpty(Parent.options)) return false;
    var variant = getCurrentVariantById(Parent.getJsonObject().variants, variant_id);
    var selected_variant_array = String(variant.title).replace(/\/ /g, '/').split('/');
    Parent.createOptionsView(Parent.contentParent, Parent.options, Parent.options_name, selected_variant_array);
    Parent[fn('getFunctionClickHandler')]();
    Parent.callExternalVariantHandler(Parent.callback, variant, Parent.getJsonObject());
},
theme.SwatchStructor.prototype.buttonHandler = function(){
if(this.type == 'quickview'){
  return false;}
    var Parent = this;
    var fn = Parent.viewDesign;
    var $_parent = $(Parent.contentParent);
    var group_parent_name = fn('getGroupElementName');
    var $_group_parent = $_parent.find(group_parent_name);
    $_group_parent.find('a').click(function(e) {
        e.preventDefault();
        if ($(this).hasClass('active')) return false;
        $_group_parent.find('a').unbind();
        $(this).closest(group_parent_name).find('.active').removeClass('active');
        $(this).parent().addClass('active');
      
    
     if(Parent.location !== 'quickview'){
         var str = '';
          $_parent.find('.active').find('[data-value]').each(function() {
            str += $(this).attr('data-value') + ' / ';
        }); 
        Parent.endOfTheClickHandler(str);
     }else{
        e.preventDefault();
        alert(1);
     	Parent.SlideSwatchQuickview();
     }
      //thanhvn swatch detail
      	var variant_id = Parent.enableHistoryState && getVariantIdUrl(); 
      
        $('.image-quickview-thumbnail .slick-slider').each(function(){
			if($(this).data('variantid') == variant_id){
              $(this).trigger( "click" );
              return;
          }
		})
        $("#product-thumbnails-product-template .slick-slide").each(function(){
          if($(this).data('variantid') == variant_id){
              $(this).trigger( "click" );
              return;
          }
        })
    });
},
theme.SwatchStructor.prototype.selectHandler = function() {
    var Parent = this;
    var fn = Parent.viewDesign;

    var $_parent = $(Parent.contentParent);
    var group_parent_name = fn('getGroupElementName');
    var $_group_parent = $_parent.find(group_parent_name);

    $_group_parent.find('select').change(function() {
        var str = '';
        $_parent.find('select option:selected').each(function() {
            str += $(this).text() + ' / ';
        });
        Parent.endOfTheClickHandler(str);
    })
},
theme.SwatchStructor.prototype.endOfTheClickHandler = function(str) {
    var Parent = this;
    str = str.substring(0, str.length - 3);
    var variant = getCurrentVariantByTitle(Parent.getJsonObject().variants, str);
    Parent.enableHistoryState && history.pushState(null, null, location.pathname + '?variant=' + variant.id);
    Parent.createSwatches(variant.id);
}
theme.SwatchStructor.prototype.createOptionsView = function(contentParent, value, names, selected) {
var _ = this;
var fn = _.viewDesign;

var $_parent = $(contentParent).empty(),
    texture = _.texture_obj,
    colors = _.colors_obj,
    c_border = _.color_with_border,
    opt1 = '',
    opt2 = '',
    opt3 = '',
    title_key = 'getTitleHtml',
    button_key = 'getButtonHtml',
    wrapperView = '';

$.each(value, function(key) {
    if (key == selected[0] && typeof value[key] === 'object' && key != 'Default Title') {
        var array_options2 = value[key];
        $.each(array_options2, function(key) {
            if (key == selected[1] && typeof array_options2[key] === 'object') {
                $.each(array_options2[key], function(key) {
                    opt3 += fn(button_key, {
                        value: key,
                        selected: selected[2],
                        title: names[2],
                        texture: texture,
                        colors: colors,
                        c_border: c_border
                    });
                });
            }
            opt2 += fn(button_key, {
                value: key,
                selected: selected[1],
                title: names[1],
                texture: texture,
                colors: colors,
                c_border: c_border
            });
        });
    }
    if (key != 'Default Title') opt1 += fn(button_key, {
        value: key,
        selected: selected[0],
        title: names[0],
        texture: texture,
        colors: colors,
        c_border: c_border
    });
});

var titles = [names[0], names[1], names[2]];
var values = [opt1, opt2, opt3];
for (var i = 0; i < values.length; i++) {
    values[i] != '' && $_parent.append(fn('getGroupHtml', {
        title: titles[i],
        html: values[i]
    }));
}
}
theme.SwatchStructor.prototype.getJsonObject = function() {
return this.product_fulldata;
}
theme.SwatchStructor.prototype.callExternalVariantHandler = function(fn, param1, param2) {
    fn && typeof(fn) === "function" && fn(param1, param2);
}
theme.SwatchStructor.prototype.destroy = function() {
  var $parent = $(this.contentParent);
  $parent.find('a').unbind();
  $parent.find('select').unbind();
  $parent.empty();
}
theme.cartStructor = (function() {
        var ModalObject = {
            $modal_Selector: $('#modalAddToCartProduct'),
            initSingleItem: function(line_item) {
                var price_str = getItemFormatedPrice(line_item.price * line_item.quantity);
                var _ = this.$modal_Selector;
              var _img = _.find('.image-box').find('a');
              _img.attr('href', line_item.url).empty();
            $('<img src=' + line_item.image + ' alt="Cart Image">').appendTo(_img);
                _.find('.title').html(line_item.product_title);
              _.find('.price').html(price_str);
              _.find('.qty').find('input').val(line_item.quantity);
                var _details = _.find('.description');
                if (line_item.variant_title == null) {
                    _details.hide();
                } else {
                    _details.show().html(line_item.variant_title.replace(/ \//g, ', '));
                }
            },
            initGeneralInfo: function(cart) {
                var price_str = getItemFormatedPrice(cart.total_price);
                var _ = this.$modal_Selector;
                _.find('.modal-total-quantity').text(cart.item_count);
                _.find('.full-total-js').html(price_str);
            },
            showModal: function() {
                if (typeof modal_qv_open !== 'undefined') {
                    if (modal_qv_open) return false;
                }

                var $this = this.$modal_Selector;
                $this.modal('show');
                var _ = this.$modal_Selector;
                _.find('.close-modal-added-js').click(function(e) {
                    e.preventDefault();
                    $(this).unbind();
                    $this.modal('hide');
                })

            }
        }
        var removeFromCartHandler = function() {
            $('body').on('click', '.header_delete_cartitem_js', function(e) {
                e.preventDefault();
                $(this).closest('li').addClass('removeAfterCompleteAjax');
                var variant_id = regexUrl($(this).attr("href"));
                Shopify.removeItem(variant_id, onCartUpdateCustom);
            });
        }

        function onCartUpdateCustom(cart) {
            cart.item_count == 0 && $('.empty-cart-js').removeClass('hide');
            $('.removeAfterCompleteAjax').remove();
            updateGeneralInfo(cart);
            $('body').trigger('refreshCurrency');
        }

        function updateGeneralInfo(cart) {
            var price_str = getItemFormatedPrice(cart.total_price);
            var _parent = $('header').find('.cart');
            _parent.find('.badge-cart').text(cart.item_count);
            cart.item_count == 0 ? _parent.find('.badge-cart').addClass('empty') : _parent.find('.badge-cart').removeClass('empty');
            _parent.find('.cart-total').find('span:first-child').empty().html(price_str);
            $('#dropdown-cart').find('.price').html(price_str);
        }

        function ClickButtonAddToCart() {
            $('body').on('click', '.addtocart-item-js', function(event) {
                event.preventDefault();
              if($(this).attr("href") != '#'){
                var id_variant = regexUrl($(this).attr("href"));
              }
              Shopify.addItem(id_variant, 1);
            })
        }

        function regexUrl(url) {
            url = url.match(/id=\d+/g);
            return url[0].match(/\d+/g);
        }

        function getItemFormatedPrice(value) {
            return Shopify.formatMoney(value, money_format);
        }

        function addItem(line_item) {
            var getsettingCarttype = $('.cart').data('cart-type');
            if (getsettingCarttype == 'top_major') {
                var _parent = $('.site-header').find('.cart_top_dropdown_style_js');
                var _empty_cart = $('.empty-cart-js');
                var _ul = _parent.find('ul:not(.item-html-js)');

            } else if (getsettingCarttype == 'dropdown') {
                var _parent = $('.site-header').find('.cart_dropdown_style_js');
                var _empty_cart = $('.empty-cart-js');
                var _ul = _parent.find('ul:not(.item-html-js)');
            }
            var price_str = getItemFormatedPrice(line_item.price);
            var _ = $('.item-html-js').children().clone();
            _.find('.title').find('a').attr('href', line_item.url).html(line_item.product_title);
            _.find('.price').html(price_str);
            _.find('.qty').find('input').val(line_item.quantity);

            var _img = _.find('.img').find('a');
            _img.attr('href', line_item.url).empty();
            $('<img src=' + line_item.image + ' alt="Cart Image">').appendTo(_img);

            var _details = _.find('.details');
            line_item.variant_title == null ? _details.remove() : _details.html(line_item.variant_title.replace(/ \//g, ', '));

            var delete_btn = _.find('.delete').find('a');
            var delete_url = String(delete_btn.attr('href')).replace('id=0', 'id=' + line_item.id);
            delete_btn.attr('href', delete_url);
            _.find('.edit').find('a').attr('href', line_item.url);

            _ul.find('[href="' + delete_url + '"]').length && _ul.find('[href="' + delete_url + '"]').closest('li').remove();
            $(_).appendTo(_ul);
            !_empty_cart.hasClass('hide') && _empty_cart.addClass('hide');

        }

        function checkCartStatus() {
            $("#dropdown-cart .list-js-add").children().length > 0 ? ($("#dropdown-cart .no-items").hide(), $("#dropdown-cart .has-items").show()) : ($("#dropdown-cart .has-items").hide(), $("#dropdown-cart .no-items").show())
        }

        function OpenCartSection() {
            checkCartStatus();
            if (theme.cart_icon_type == 'dropdown') {
                $("#cartToggle").hover(function() {
                    $("#dropdown-cart").is(":visible") || $("#dropdown-cart").slideDown("fast");
                });
                $(".cart").mouseleave(function() {
                    $("#dropdown-cart").slideUp("fast");
                });
            } else if (theme.cart_icon_type == 'top_major') {
                $('#cartToggle').find('.btn-toggle').click(function() {
                    $('.dropdown-menu.cart-content').toggleClass('down');
                });
                $('.cart-close').click(function() {
                    $('.cart .btn-toggle').trigger('click');
                });
            }
        }
		Shopify.addItem = function(t, r, e) {
            var r = r || 1,
                a = {
                    type: "POST",
                    url: "/cart/add.js",
                    data: "quantity=" + r + "&id=" + t,
                    dataType: "json",
                    success: function(line_item) {
                      	
                        "function" == typeof e ? e(line_item) : Shopify.onItemAdded(line_item)
                    },
                    error: function(t, r) {
                        Shopify.onError(t, r)
                    }
                };
            jQuery.ajax(a)
        }
        // rewrite and add more function to basic function of Shopify Api
        Shopify.onItemAdded = function(line_item) {
            Shopify.getCart();
            addItem(line_item);
            ModalObject.initSingleItem(line_item);

        };
        Shopify.onCartUpdate = function(cart) {
            updateGeneralInfo(cart);
            ModalObject.initGeneralInfo(cart);
            ModalObject.showModal();
            $('body').trigger('refreshCurrency');
            checkCartStatus();
        };
        Shopify.onError = function(XMLHttpRequest, textStatus) {
            if (typeof modal_qv_open !== 'undefined') {
                if (modal_qv_open) {
                    return false;
                }
            }
        }
        return {
            init: function() {
                ClickButtonAddToCart();
                OpenCartSection();
                removeFromCartHandler();
            }
        };

    })(),
theme.customerTemplates = (function() {
        function initEventListeners() {
            // Show reset password form
            $('#RecoverPassword').on('click', function(evt) {
                evt.preventDefault();
                toggleRecoverPasswordForm();
            });

            // Hide reset password form
            $('#HideRecoverPasswordLink').on('click', function(evt) {
                evt.preventDefault();
                toggleRecoverPasswordForm();
            });
        }
        /**
         *
         *  Show/Hide recover password form
         *
         */
        function toggleRecoverPasswordForm() {
            $('#RecoverPasswordForm').toggleClass('hide');
            $('#CustomerLoginForm').toggleClass('hide');
        }

        /**
         *
         *  Show reset password success message
         *
         */
        function resetPasswordSuccess() {
            var $formState = $('.reset-password-success');

            // check if reset password form was successfully submited.
            if (!$formState.length) {
                return;
            }

            // show success message
            $('#ResetSuccess').removeClass('hide');
        }

        /**
         *
         *  Show/hide customer address forms
         *
         */
        function customerAddressForm() {
            var $newAddressForm = $('#AddressNewForm');

            if (!$newAddressForm.length) {
                return;
            }

            // Initialize observers on address selectors, defined in shopify_common.js
            if (Shopify) {
                // eslint-disable-next-line no-new
                new Shopify.CountryProvinceSelector(
                    'AddressCountryNew',
                    'AddressProvinceNew', {
                        hideElement: 'AddressProvinceContainerNew'
                    }
                );
            }

            // Initialize each edit form's country/province selector
            $('.address-country-option').each(function() {
                var formId = $(this).data('form-id');
                var countrySelector = 'AddressCountry_' + formId;
                var provinceSelector = 'AddressProvince_' + formId;
                var containerSelector = 'AddressProvinceContainer_' + formId;

                // eslint-disable-next-line no-new
                new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
                    hideElement: containerSelector
                });
            });

            // Toggle new/edit address forms
            $('.address-new-toggle').on('click', function() {
                $newAddressForm.toggleClass('hide');
            });

            $('.address-edit-toggle').on('click', function() {
                var formId = $(this).data('form-id');
                $('#EditAddress_' + formId).toggleClass('hide');
            });

            $('.address-delete').on('click', function() {
                var $el = $(this);
                var formId = $el.data('form-id');
                var confirmMessage = $el.data('confirm-message');

                // eslint-disable-next-line no-alert
                if (
                    confirm(
                        confirmMessage || 'Are you sure you wish to delete this address?'
                    )
                ) {
                    Shopify.postLink('/account/addresses/' + formId, {
                        parameters: {
                            _method: 'delete'
                        }
                    });
                }
            });
        }

        /**
         *
         *  Check URL for reset password hash
         *
         */
        function checkUrlHash() {
            var hash = window.location.hash;

            // Allow deep linking to recover password form
            if (hash === '#recover') {
                toggleRecoverPasswordForm();
            }
        }

        return {
            init: function() {
                checkUrlHash();
                initEventListeners();
                resetPasswordSuccess();
                customerAddressForm();
            }
        };
    })();
/*================ SECTIONS ================*/
var checkrtl = false;
var checkfade = true;
if ($("html").hasClass("rtl")) {
  var checkrtl = true;
  var checkfade = false;
}
theme.HeaderSection = (function() {
  function Header() {
    theme.Header.init();
    if ( $('#header-data').attr('data-mobile-style') == 'slide_menu' ) {
    	theme.MobileNav.init();
    }else if($('#header-data').attr('data-mobile-style') == 'canvas_menu' ){
    	theme.MobileNav.menuCanvas();
    }
    theme.Search.init();
    theme.Menus.init();
  }

  Header.prototype = _.assignIn({}, Header.prototype, {
    onUnload: function() {
      theme.Header.unload();
    }
  });

  return Header;
})();
theme.Maps = (function() {
  var config = {
    zoom: 14
  };
  var apiStatus = null;
  var mapsToLoad = [];

  var errors = {
    addressNoResults: theme.strings.addressNoResults,
    addressQueryLimit: theme.strings.addressQueryLimit,
    addressError: theme.strings.addressError,
    authError: theme.strings.authError
  };

  var selectors = {
    section: '[data-section-type="map"]',
    map: '[data-map]',
    mapOverlay: '[data-map-overlay]'
  };

  var classes = {
    mapError: 'map-section--load-error',
    errorMsg: 'map-section__error errors text-center'
  };

  // Global function called by Google on auth errors.
  // Show an auto error message on all map instances.
  // eslint-disable-next-line camelcase, no-unused-vars
  window.gm_authFailure = function() {
    if (!Shopify.designMode) {
      return;
    }

    $(selectors.section).addClass(classes.mapError);
    $(selectors.map).remove();
    $(selectors.mapOverlay).after(
      '<div class="' +
        classes.errorMsg +
        '">' +
        theme.strings.authError +
        '</div>'
    );
  };

  function Map(container) {
    this.$container = $(container);
    this.$map = this.$container.find(selectors.map);
    this.key = this.$map.data('api-key');

    if (typeof this.key === 'undefined') {
      return;
    }

    if (apiStatus === 'loaded') {
      this.createMap();
    } else {
      mapsToLoad.push(this);

      if (apiStatus !== 'loading') {
        apiStatus = 'loading';
        if (typeof window.google === 'undefined') {
          $.getScript(
            'https://maps.googleapis.com/maps/api/js?key=' + this.key
          ).then(function() {
            apiStatus = 'loaded';
            initAllMaps();
          });
        }
      }
    }
  }

  function initAllMaps() {
    // API has loaded, load all Map instances in queue
    $.each(mapsToLoad, function(index, instance) {
      instance.createMap();
    });
  }

  function geolocate($map) {
    var deferred = $.Deferred();
    var geocoder = new google.maps.Geocoder();
    var address = $map.data('address-setting');

    geocoder.geocode({ address: address }, function(results, status) {
      if (status !== google.maps.GeocoderStatus.OK) {
        deferred.reject(status);
      }

      deferred.resolve(results);
    });

    return deferred;
  }

  Map.prototype = _.assignIn({}, Map.prototype, {
    createMap: function() {
      var $map = this.$map;

      return geolocate($map)
        .then(
          function(results) {
            var mapOptions = {
              zoom: config.zoom,
              center: results[0].geometry.location,
              draggable: true,
              clickableIcons: true,
              scrollwheel: true,
              disableDoubleClickZoom: false,
              disableDefaultUI: false,
              styles: [
                {
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#ebe3cd"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#523735"
                    }
                  ]
                },
                {
                  "elementType": "labels.text.stroke",
                  "stylers": [
                    {
                      "color": "#f5f1e6"
                    }
                  ]
                },
                {
                  "featureType": "administrative",
                  "elementType": "geometry.stroke",
                  "stylers": [
                    {
                      "color": "#c9b2a6"
                    }
                  ]
                },
                {
                  "featureType": "administrative.land_parcel",
                  "elementType": "geometry.stroke",
                  "stylers": [
                    {
                      "color": "#dcd2be"
                    }
                  ]
                },
                {
                  "featureType": "administrative.land_parcel",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#ae9e90"
                    }
                  ]
                },
                {
                  "featureType": "landscape.natural",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#dfd2ae"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#dfd2ae"
                    }
                  ]
                },
                {
                  "featureType": "poi",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#93817c"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "geometry.fill",
                  "stylers": [
                    {
                      "color": "#a5b076"
                    }
                  ]
                },
                {
                  "featureType": "poi.park",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#447530"
                    }
                  ]
                },
                {
                  "featureType": "road",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#f5f1e6"
                    }
                  ]
                },
                {
                  "featureType": "road.arterial",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#fdfcf8"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#f8c967"
                    }
                  ]
                },
                {
                  "featureType": "road.highway",
                  "elementType": "geometry.stroke",
                  "stylers": [
                    {
                      "color": "#e9bc62"
                    }
                  ]
                },
                {
                  "featureType": "road.highway.controlled_access",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#e98d58"
                    }
                  ]
                },
                {
                  "featureType": "road.highway.controlled_access",
                  "elementType": "geometry.stroke",
                  "stylers": [
                    {
                      "color": "#db8555"
                    }
                  ]
                },
                {
                  "featureType": "road.local",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#806b63"
                    }
                  ]
                },
                {
                  "featureType": "transit.line",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#dfd2ae"
                    }
                  ]
                },
                {
                  "featureType": "transit.line",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#8f7d77"
                    }
                  ]
                },
                {
                  "featureType": "transit.line",
                  "elementType": "labels.text.stroke",
                  "stylers": [
                    {
                      "color": "#ebe3cd"
                    }
                  ]
                },
                {
                  "featureType": "transit.station",
                  "elementType": "geometry",
                  "stylers": [
                    {
                      "color": "#dfd2ae"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "geometry.fill",
                  "stylers": [
                    {
                      "color": "#b9d3c2"
                    }
                  ]
                },
                {
                  "featureType": "water",
                  "elementType": "labels.text.fill",
                  "stylers": [
                    {
                      "color": "#92998d"
                    }
                  ]
                }
              ]
            };

            var map = (this.map = new google.maps.Map($map[0], mapOptions));
            var center = (this.center = map.getCenter());

            //eslint-disable-next-line no-unused-vars
            var marker = new google.maps.Marker({
              map: map,
              position: map.getCenter()
            });

            google.maps.event.addDomListener(
              window,
              'resize',
              $.debounce(250, function() {
                google.maps.event.trigger(map, 'resize');
                map.setCenter(center);
                $map.removeAttr('style');
              })
            );
          }.bind(this)
        )
        .fail(function() {
          var errorMessage;

          switch (status) {
            case 'ZERO_RESULTS':
              errorMessage = errors.addressNoResults;
              break;
            case 'OVER_QUERY_LIMIT':
              errorMessage = errors.addressQueryLimit;
              break;
            case 'REQUEST_DENIED':
              errorMessage = errors.authError;
              break;
            default:
              errorMessage = errors.addressError;
              break;
          }

          // Show errors only to merchant in the editor.
          if (Shopify.designMode) {
            $map
              .parent()
              .addClass(classes.mapError)
              .html(
                '<div class="' +
                  classes.errorMsg +
                  '">' +
                  errorMessage +
                  '</div>'
              );
          }
        });
    },

    onUnload: function() {
      if (this.$map.length === 0) {
        return;
      }
      google.maps.event.clearListeners(this.map, 'resize');
    }
  });

  return Map;
})();
/* eslint-disable no-new */
theme.Product = function() {
    function run(el) {
        var $container = this.$container = $(el);
        var id = this.sectionId = $container.attr("data-section-id");
        var data_section_type = $container.attr("data-section-type");
        this.settings = {
            mediaQueryMediumUp: "screen and (min-width: 750px)",
            mediaQuerySmall: "screen and (max-width: 749px)",
            bpSmall: false,
            enableHistoryState: $container.data("enable-history-state") || false,
            imageSize: null,
            namespace: ".slideshow-" + id,
            sectionId: id,
            sliderActive: false,
            swatch_color: $container.attr("data-product_swatch_color"),
            swatch_size: $container.attr("data-product_swatch_size"),
            product_design: $container.attr("data-product_design"),
            product_mobile_variant: $container.attr("data-product_mobile_variant")
        };
        this.selectors = {
            product: "#ProductSection-" + id,
            addToCart: "#AddToCart-" + id,
            addToCartText: "#AddToCartText-" + id,
            stockText: ".stock-" + id,
            comparePrice: "#ComparePrice-" + id,
            originalPrice: "#ProductPrice-" + id,
            SKU: ".variant-sku",
            CouponSelector:".coupon-code",
            originalPriceWrapper: ".product-price__price-" + id,
            originalSelectorId: "#ProductSelect-" + id,
            productFeaturedImage: ".FeaturedImage-" + id,
            productImageWrap: "#FeaturedImageZoom-" + id,
            productPrices: ".product-single__price-" + id,
            productThumbImages: "#product-thumbnails-" + id,
            productMainImages: "#product-images-" + id,
            productPreviewMainImages: ".product-preview-images-" + id,
            saleLabel: ".product-price__sale-label-" + id,
            singleOptionSelector: ".single-option-selector-" + id,
            singleOptionSelectorId: "#single-option-selector-" + id,
            singleOptionSwatches: "tawcvs-swatches-" + id,
            instagramProduct: "#product-instagram-" + id,
            instagramProductNameSpace: "product-instagram-" + id,
            variationsSelector: "#variations-" + id,
            variationSelector: ".variation-select-" + id,
            qtyVariant: ".qty-variant-" + id,
            threedId: ".threed-id-" + id,
            countDownId: ".countdown-" + id,
          	UpSellContent: ".upsell-wrapper",

        };
        if ($("#ProductJson-" + id).html()) {
            /** @type {*} */
            this.productSingleObject = JSON.parse(document.getElementById("ProductJson-" + id).innerHTML);
            this.ProductCountdown();
            this._initSwatchesAndUpSell();
            this._initFeature();
            this._initCompact();
            this._initThumbnailsGallery();
            this._initImages();
            this._initZoom();
            this._initGallery();
            this._stickySumary();
          	this._initCoupon();
          	this.changeQuantityProduct();
        }
    }
    return run.prototype = _.assignIn({}, run.prototype, {

        _initBreakpoints: function() {
            this;
            enquire.register(this.settings.mediaQuerySmall, {
                /**
                 * @return {undefined}
                 */
                match: function() {},
                /**
                 * @return {undefined}
                 */
                unmatch: function() {}
            });
            enquire.register(this.settings.mediaQueryMediumUp, {
                /**
                 * @return {undefined}
                 */
                match: function() {}
            });
        },
      
      _initCoupon: function(){
        $('.coupon-btn').unbind().click(function(){
        	var Input = $("<input>");
            $("body").append(Input);
            Input.val($(this).data('coupon')).select();
            document.execCommand("copy");
            Input.remove();
        })
      },
      changeQuantityProduct: function() {
        $(".quantityiput .plus-btn").click(function(){
          if(parseInt($(".quantityiput input").val()) + 1 < 10)
              $(".quantityiput input").val(parseInt($(".quantityiput input").val()) + 1 );
        });
        $(".quantityiput .minus-btn").click(function(){
          if(parseInt($(".quantityiput input").val()) - 1 > 0)
          $(".quantityiput input").val(parseInt($(".quantityiput input").val()) - 1 );
        });
        $(".quantityiput input").keydown(function (e) {
          // Allow: backspace, delete, tab, escape, enter and .
          if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
              // Allow: Ctrl/cmd+A
              (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
              // Allow: Ctrl/cmd+C
              (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
              // Allow: Ctrl/cmd+X
              (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
              // Allow: home, end, left, right
              (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
          }
          // Ensure that it is a number and stop the keypress
          if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
          }
        });
      },
      ProductCountdown: function() {
            if (!(0 >= $(this.selectors.countDownId).length) && ($().countdown && 0 < $(this.selectors.countDownId).length)) {
               
                var endDate = new Date;
                var startDate = $(this.selectors.countDownId).data("countdown").split("-");
                startDate = new Date(startDate[2], parseInt(startDate[0]) - 1, startDate[1]);
                if (endDate < startDate) {
                    $(this.selectors.countDownId).countdown({
                      until: startDate,
                      layout: '<span class="countdown-day">{dn}<span>days</span></span><span class="countdown-hour">{hn}<span>hours</span></span><span class="countdown-minute">{mn}<span>minutes</span></span><span class="countdown-second">{sn}<span>seconds</span></span>'
                    });
                }
            }
        },     
        _stickySumary: function(){
          $('.sticky-product').stick_in_parent();
        },
        _initFeature: function() {
            if (0 < $(this.selectors.product + " .product-video-button a").length && $(this.selectors.product + " .product-video-button a").magnificPopup({
                    type: "iframe",
                    mainClass: "mfp-fade",
                    removalDelay: 160,
                    preloader: false,
                    disableOn: false,
                    fixedContentPos: false
                }), 0 < $(this.selectors.product + " .product-360-button a").length) {
                var value;
                var byteout = [];
                var clt = JSON.parse(document.getElementById("threed-id-" + this.sectionId).innerHTML);
                var px = 1;
                for (; 72 >= px; px++) {
                    /** @type {string} */
                    value = "f" + px;
                    if (clt[value]) {
                        byteout.push(clt[value]);
                    }
                }
                if (0 < byteout.length) {
                    /** @type {number} */
                    var cnl = byteout.length;
                    $(this.selectors.threedId).ThreeSixty({
                        totalFrames: cnl,
                        endFrame: cnl,
                        currentFrame: 1,
                        imgList: ".threed-view-images",
                        progress: ".spinner",
                        imgArray: byteout,
                        height: null,
                        width: null,
                        responsive: true,
                        navigation: true,
                        /**
                         * @return {undefined}
                         */
                        onReady: function() {
                            $(".product-360-button a").magnificPopup({
                                type: "inline",
                                mainClass: "mfp-fade",
                                removalDelay: 160,
                                disableOn: false,
                                preloader: false,
                                fixedContentPos: false,
                                callbacks: {
                                    /**
                                     * @return {undefined}
                                     */
                                    open: function() {
                                        $(window).resize();
                                    }
                                }
                            });
                        }
                    });
                }
            }
        },
        /**
         * @return {undefined}
         */
        _initCompact: function() {
            if (0 < $(".product-accordion").length) {
                var cancel = $(".product-accordion");
                var $el = $(".accordion-item");
                $el.each(function() {
                    var $el = $(this);
                    var div = $el.find(".title");
                    var val = div.innerHeight();
                    var i = $el.find(".content").outerHeight();
                    var I = div.parent(".accordion-item");
                    div.data("height", val);
                    $el.data("height", val + i);
                });
                $el.each(function() {
                    var elem = $(this);
                    var node = elem.find(".title");
                    var value = node.innerHeight();
                    var arg = elem.find(".content").outerHeight();
                    var test = node.parent(".accordion-item");
                    node.data("height", value);
                    elem.data("height", value + arg);
                    if (test.hasClass("active")) {
                        test.height(test.data("height"));
                    }
                });
                cancel.on("click", ".accordion-item > .title", function() {
                    var topbar = $(this);
                    var test = topbar.parent(".accordion-item");
                    if (!test.hasClass("active")) {
                        $el.closest(".active").removeClass("active").height(topbar.data("height"));
                    }
                    test.toggleClass("active");
                    if (test.hasClass("active")) {
                        test.height(test.data("height"));
                    } else {
                        test.height(topbar.data("height"));
                    }
                });
            }
        },
        _initThumbnailsGallery: function() {
            var self = $(this.selectors.productMainImages);
            if ("gallery" == this.settings.product_design) {
                $(".thumbnail-gallery-item").on("click", function() {
                    var $slide = $(this);
                    if (!$slide.hasClass("active")) {
                        $(".thumbnail-gallery-item").removeClass("active");
                        $slide.addClass("active");
                        $(".thumbnail-gallery-item").each(function(funcToCall) {
                            if ($(this).attr("id") == $slide.attr("id")) {
                                return void self.slick("slickGoTo", funcToCall, true);
                            }
                        });
                    }
                });
            }

        },
        _initGallery: function() {
            (function(selector) {
                function done(errors, total) {
                    return -1 < (" " + errors.className + " ").indexOf(" " + total + " ");
                }
                var render = function(context) {
                    var el;
                    var a;
                    var p;
                    var item;
                    var codeSegments = $(context).find(".photoswipe-item").get();
                    var valuesLen = codeSegments.length;
                    var _results = [];
                    var i = 0;
                    for (; i < valuesLen; i++) {
                        if (el = codeSegments[i], 1 === el.nodeType) {
                            if (a = el.children[0], p = a.getAttribute("data-size").split("x"), "video" == $(a).data("type")) {
                                var blockHTML = $($(a).data("id")).html();
                                _results.push({
                                    html: blockHTML
                                });
                            } else {
                                item = {
                                    src: a.getAttribute("href"),
                                    w: parseInt(p[0], 10),
                                    h: parseInt(p[1], 10)
                                };
                                if (1 < el.children.length) {
                                    item.title = $(el).find(".caption").html();
                                }
                                if (0 < a.children.length) {
                                    item.msrc = a.children[0].getAttribute("src");
                                }
                                item.el = el;
                                _results.push(item);
                            }
                        }
                    }
                    return _results;
                };
                var on = function traverseNode(el, fun) {
                    return el && (fun(el) ? el : traverseNode(el.parentNode, fun));
                };
                var handler = function(event) {
                    event = event || window.event;
                    if (event.preventDefault) {
                        event.preventDefault();
                    } else {
                        /** @type {boolean} */
                        event.returnValue = false;
                    }
                    var failuresLink = event.target || event.srcElement;
                    var el = on(failuresLink, function(errors) {
                        return done(errors, "photoswipe-item");
                    });
                    if (el) {
                        var data;
                        var doc = el.closest(".photoswipe-wrapper");
                        var arr = $(el.closest(".photoswipe-wrapper")).find(".photoswipe-item").get();
                        var e = arr.length;
                        var tmp = 0;
                        var i = 0;
                        for (; i < e; i++) {
                            if (1 === arr[i].nodeType) {
                                if (arr[i] === el) {
                                    data = tmp;
                                    break;
                                }
                                tmp++;
                            }
                        }
                        return 0 <= data && init(data, doc), false;
                    }
                };
                var get = function() {
                    var oldClasses = window.location.hash.substring(1);
                    var obj = {};
                    if (5 > oldClasses.length) {
                        return obj;
                    }
                    var codeSegments = oldClasses.split("&");
                    var i = 0;
                    for (; i < codeSegments.length; i++) {
                        if (codeSegments[i]) {
                            /** @type {Array.<string>} */
                            var parts = codeSegments[i].split("=");
                            if (!(2 > parts.length)) {
                                /** @type {string} */
                                obj[parts[0]] = parts[1];
                            }
                        }
                    }
                    return obj.gid && (obj.gid = parseInt(obj.gid, 10)), obj;
                };
                var init = function(data, root, dataAndEvents, deepDataAndEvents) {
                    var event;
                    var o;
                    var codeSegments;
                    var originalEvent = document.querySelectorAll(".pswp")[0];
                    if (codeSegments = render(root), o = {

                            closeOnScroll: false,
                            galleryUID: root.getAttribute("data-pswp-uid")
                        }, !deepDataAndEvents) {
                        /** @type {number} */
                        o.index = parseInt(data, 10);
                    } else {
                        if (o.galleryPIDs) {
                            /** @type {number} */
                            var i = 0;
                            for (; i < codeSegments.length; i++) {
                                if (codeSegments[i].pid == data) {
                                    /** @type {number} */
                                    o.index = i;
                                    break;
                                }
                            }
                        } else {
                            /** @type {number} */
                            o.index = parseInt(data, 10) - 1;
                        }
                    }
                    if (!isNaN(o.index)) {
                        if (dataAndEvents) {
                            /** @type {number} */
                            o.showAnimationDuration = 0;
                        }
                        event = new PhotoSwipe(originalEvent, PhotoSwipeUI_Default, codeSegments, o);
                        event.init();
                        event.listen("beforeChange", function() {

                            var $e = $(event.currItem.container);

                            $(".pswp__video").removeClass("active");
                            $e.find(".pswp__video").addClass("active");
                            $(".pswp__video").each(function() {
                                if (!$(this).hasClass("active")) {
                                    $(this).attr("src", $(this).attr("src"));
                                }
                            });
                        });
                        event.listen("close", function() {
                            $(".pswp__video").each(function() {
                                $(this).attr("src", $(this).attr("src"));
                            });
                        });
                    }
                };
                /** @type {NodeList} */
                var elms = document.querySelectorAll(selector);
                /** @type {number} */
                var i = 0;
                /** @type {number} */
                var len = elms.length;
                for (; i < len; i++) {
                    elms[i].setAttribute("data-pswp-uid", i + 1);
                    /** @type {function (Object): ?} */
                    elms[i].onclick = handler;
                }
                var data = get();

                if (data.pid) {

                    if (data.gid) {

                        init(data.pid, elms[data.gid - 1], true, true);
                    }
                }
            })(this.selectors.product + " .photoswipe-wrapper");
        },

        _initZoom: function() {
            if ($(".easyzoom").length) {
                if (1024 < $(window).width()) {
                    var browserEvent = $(".easyzoom:not(.feature-video)").easyZoom({
                        loadingNotice: "",
                        errorNotice: "",
                        preventClicks: false
                    });
                    var easyZoom = browserEvent.data("easyZoom");
                } else {
                    $(".easyzoom a").click(function(types) {
                        types.preventDefault();
                    });
                }
            }
        },
      _initImages: function() {
            var event = this;
            var $this = $(event.selectors.productMainImages);
            if ("left" != this.settings.product_design && "right" != this.settings.product_design && ("bottom" != this.settings.product_design && ("sidebar" != this.settings.product_design && "full-screen" != this.settings.product_design))) {
                if ("carousel" == this.settings.product_design) {
                    $this.not(".slick-initialized").slick({
                        centerMode: true,
                        centerPadding: "20px",
                        slidesToShow: 4,
                        infinite: true,
                        slidesToScroll: 1,
                        prevArrow: '<button type="button" class="slick-prev">Previous</button>',
                        nextArrow: '<button type="button" class="slick-next">Next</button>',
                        responsive: [{
                            breakpoint: 1680,
                            settings: {
                                centerMode: true,
                                centerPadding: "10px",
                                slidesToShow: 4
                            }
                        }, {
                            breakpoint: 1440,
                            settings: {
                                centerMode: true,
                                centerPadding: "10px",
                                slidesToShow: 4
                            }
                        }, {
                            breakpoint: 1200,
                            settings: {
                                centerMode: true,
                                centerPadding: "10px",
                                slidesToShow: 4
                            }
                        }, {
                            breakpoint: 1024,
                            settings: {
                                arrows: false,
                                centerMode: true,
                                centerPadding: "10px",
                                slidesToShow: 1
                            }
                        }, {
                            breakpoint: 992,
                            settings: {
                                centerMode: true,
                                centerPadding: "10px",
                                slidesToShow: 1
                            }
                        }, {
                            breakpoint: 768,
                            settings: {
                                arrows: false,
                                centerMode: true,
                                centerPadding: "10px",
                                slidesToShow: 1
                            }
                        }, {
                            breakpoint: 480,
                            settings: {
                                arrows: false,
                                centerMode: true,
                                centerPadding: "10px",
                                slidesToShow: 1
                            }
                        }]
                    });
                } else {
                    $this.not(".slick-initialized").slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        variableWidth:true,
                        infinite: true,
                        asNavFor: thumb,
                        prevArrow: '<button type="button" class="slick-prev">Previous</button>',
                        nextArrow: '<button type="button" class="slick-next">Next</button>',
                    });
                }
            } else {
                if (0 < $(event.selectors.productThumbImages).length) {
                    var thumb = $(event.selectors.productThumbImages).find(".thumbnails");
                  if(this.settings.product_design == "bottom"){
                  	var verticalThum = false;
                    var arrowsThum = true;
                    
                  }else if(this.settings.product_design == "left" || this.settings.product_design == "right" ){
                  	var verticalThum = true;
                    var arrowsThum = false;
                  }
                    $this.not(".slick-initialized").slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        asNavFor: thumb,
                      	arrows: true,
                        prevArrow: '<button type="button" class="slick-prev">Previous</button>',
                        nextArrow: '<button type="button" class="slick-next">Next</button>',
                    });
                    thumb.not(".slick-initialized").slick({
                          slidesToShow: 4,
                          slidesToScroll: 1,
                          vertical: verticalThum,
                          focusOnSelect: true,
                          asNavFor:$this,
                          verticalSwiping:true,
                          infinite: true,
                          arrows: arrowsThum,
                          prevArrow: '<button type="button" class="slick-prev">Previous</button>',
                       	  nextArrow: '<button type="button" class="slick-next">Next</button>',
                      });                }
            }
            $this.imagesLoaded(function() {
                $this.addClass("loaded");
            });
        },
      
        _initForceHeight: function() {
            if (0 < $(this.selectors.productPreviewMainImages).length) {
                $(this.selectors.productPreviewMainImages).not(".slick-initialized").slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    prevArrow: '<span class="icon-chevron-left slick-prev-arrow"></span>',
                    nextArrow: '<span class="icon-chevron-right slick-next-arrow"></span>'
                });
            }
        },
        _initSwatchesAndUpSell: function() {
              var DetailParent = $('.product-page');
              var ProductPageProductAddtocart = $('.btn-addtocart.upsell_addtocart');
              var handle_product = $('.product-swatch-js').data('product-handle');
              function ProductInfo(Info) {
                  var view = Boolean($('.product-swatch-js').data('product_detail_swatch')) ? 'viewSelect' : 'viewButtons';
                  var group1 = new theme.SwatchStructor(Info, {
                      contentParent: '.swatches-container',
                      viewDesign: view,
                      enableHistoryState: true,
                      callback: productPageVariant,
                      externalImagesObject: texture_obj,
                      externalColors: colors_value,
                      colorWithBorder: color_with_border
                  });
                  json_data = null;
                  group1 = null;
              }
          
              function ProductDetailAddToCart(variant_id, selector, _swatch) {
                  var _btn = selector.find('.js-detail-button');
                  if (_btn.length == 0) return false;

                  _btn.unbind().on('click',function(e) {
                      e.preventDefault();
                      var quantity = Math.max(1, parseInt(selector.find('.input-counter').find('input').val()));
                      Shopify.addItem(variant_id, quantity);
                      openUpSellProductGrid($(this).data('handle'));
                  })
              }
              function productPageVariant(variant, product) {
                  var _parent = $('.product-page');
                  var _swatch = _parent.find('.swatches-container');
                  swatchVariantHandler(_parent, variant);
                  var img_id = variant.featured_image ? variant.featured_image.id : 'none';
                  var target = img_id == 'none' ? $("[data-slick-index=0]").children() : $("[data-target=" + img_id + "]");
                  var num = target.last().parent().attr('data-slick-index');

                  var $container = $('#product-images-product-template');
                  if (num && $container.length) {
                      $container.slick('slickGoTo', num, true);
                  }
                  ProductDetailAddToCart(variant.id, _parent, _swatch);
              }
              function setDefaultSlider(num, $container, target) {
                  if (!(num && $container.length)) return false;
                  $container.slick('slickGoTo', num, true);
                  $container.find('.zoomGalleryActive').removeClass('zoomGalleryActive');
                  target.addClass('zoomGalleryActive');
                  $(".zoom-product").attr('src', target.attr('data-image')).attr('data-zoom-image', target.attr('data-zoom-image'));
                  !elevateZoomWidget.checkNoZoom() && elevateZoomWidget.configureZoomImage();
              }
              function setScrollSlider(num, $container) {
                  if (!(num && $container.length)) return false;
                  $container.slick('slickGoTo', num, true);
              }
          /*khoi chay*/
              Shopify.getProduct(handle_product, ProductInfo);
          
          
        },
        htmlEntities: function(str) {
            return (str + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        },
        
        convertToSlug: function(item) {
            return item.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
        },       
        _updateImages: function(variant) {
            var font = variant.variant;
            var event = this;
            var rect = this.settings.product_design;
            var m = font.featured_image.src.replace("https:", "").replace("http:", "").split("?v=")[0];
            $(this.selectors.productFeaturedImage).each(function() {
                var anchor = $(this);
                var matches = anchor.attr("href");
                if (0 <= matches.indexOf(m) && !anchor.closest(".slick-slide").hasClass("slick-cloned")) {
                    var $window = $(event.selectors.productMainImages);
                    var y = anchor.closest(".slick-slide").attr("data-slick-index");
                    if ("carousel" == rect ? $window.slick("slickGoTo", y) : $window.slick("slickGoTo", y, true), "scroll" == rect) {
                        /** @type {number} */
                        var top = parseInt(anchor.closest(".shopify-product-gallery__image").offset().top) - 50;
                        $("html,body").animate({
                            scrollTop: top
                        }, "slow");
                    }
                    return void("gallery" == rect && (0 < $(".thumbnails .thumbnail-gallery-item").length && $(".thumbnails .thumbnail-gallery-item").each(function() {
                        var matches = $(this).data("href");
                        if (0 <= matches.indexOf(m)) {
                            $(this).trigger("click");
                        }
                    })));
                }
            });
        },
        _updatePrice: function(node) {
            var s = node.variant;
            if ($(this.selectors.originalPrice).html('<span class="money">' + theme.Currency.formatMoney(s.price, theme.moneyFormat) + "</span>"), s.compare_at_price > s.price) {
                if ($(this.selectors.productPrices).addClass("has-sale"), $(this.selectors.productPrices).removeClass("not-sale"), $(this.selectors.comparePrice).html('<span class="money">' + theme.Currency.formatMoney(s.compare_at_price, theme.moneyFormat) + "</span>").removeClass("hide"), $(this.selectors.saleLabel).find("span").text(theme.strings.sale), "" != theme.sale_percentages) {
                    /** @type {number} */
                    var name = Math.round(100 * (s.compare_at_price - s.price) / s.compare_at_price);
                    $(this.selectors.saleLabel).find("span").text("-" + name + "%");
                }
                $(this.selectors.saleLabel).addClass("hide");
            } else {
                $(this.selectors.productPrices).removeClass("has-sale");
                $(this.selectors.productPrices).addClass("not-sale");
                $(this.selectors.comparePrice).addClass("hide");
                $(this.selectors.saleLabel).addClass("hide");
            }
            theme.CurrencyPicker.convert(this.selectors.product + " .money");
        },
        
        _updateSKU: function(node) {
            var attrs = node.variant;
            if ("" == attrs.sku) {
                $(this.selectors.SKU).addClass("hide");
            } else {
                $(this.selectors.SKU).removeClass("hide").find(".sku").text(attrs.sku);
            }
        },
        
        onUnload: function() {
            this.$container.off(this.settings.namespace);
        }
    }), run;
}();
//testimonial slick
theme.Quotes = (function() {
  var config = {
    mediaQuerySmall: 'screen and (max-width: 749px)',
    mediaQueryMediumUp: 'screen and (min-width: 750px)',
    slideCount: 0
  };
  var defaults = {
    accessibility: true,
    arrows: false,
    dots: true,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 3,
    slidesToScroll: 3,
    rtl: checkrtl  
  };

  function Quotes(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var wrapper = (this.wrapper = '.quotes-wrapper');
    var slider = (this.slider = '#Quotes-' + sectionId);
    var $slider = $(slider, wrapper);
   
    var sliderActive = false;
    var mobileOptions = $.extend({}, defaults, {
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true
    });

    config.slideCount = $slider.data('count');

    // Override slidesToShow/Scroll if there are not enough blocks
    if (config.slideCount < defaults.slidesToShow) {
      defaults.slidesToShow = config.slideCount;
      defaults.slidesToScroll = config.slideCount;
    }

    $slider.on('init', this.a11y.bind(this));

    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });

    enquire.register(config.mediaQueryMediumUp, {
      match: function() {
        initSlider($slider, defaults);
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }
  }

  Quotes.prototype = _.assignIn({}, Quotes.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.quotes-slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return Quotes;
})();
theme.slideshows = {};
theme.SlideshowSection = (function() {
  function SlideshowSection(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var slideshow = (this.slideshow = '#Slideshow-' + sectionId);

    $('.slideshow__video', slideshow).each(function() {
      var $el = $(this);
      theme.SlideshowVideo.init($el);
      theme.SlideshowVideo.loadVideo($el.attr('id'));
    });

    theme.slideshows[slideshow] = new theme.Slideshow(slideshow);
  }

  return SlideshowSection;
})();
theme.SlideshowSection.prototype = _.assignIn(
  {},
  theme.SlideshowSection.prototype,
  {
    onUnload: function() {
      delete theme.slideshows[this.slideshow];
    },

    onBlockSelect: function(evt) {
      var $slideshow = $(this.slideshow);

      // Ignore the cloned version
      var $slide = $(
        '.slideshow__slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $slideshow.slick('slickGoTo', slideIndex).slick('slickPause');
    },

    onBlockDeselect: function() {
      // Resume autoplay
      $(this.slideshow).slick('slickPlay');
    }
  }
);
//slick Product list
theme.Productlists = (function() {
  var config = {
    mediaQueryTiny: 'screen and (max-width: 575px)',
    mediaQuerySmall: '(min-width: 576px) and (max-width: 750px)',
    mediaQueryMediumUp: '(min-width: 750px) and (max-width: 1199px)',
    mediaQueryLarge: 'screen and (min-width: 1200px)',
    slideShow: 0,
    scrollShow: 0,
    rowNumber: 0
  };
  var defaults = {
    accessibility: true,
    infinite: false,
    autoplay: false,
    touchThreshold: 20,
    rtl: checkrtl ,
  };

  function Productlists(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var wrapper = (this.wrapper = '.productlists-wrapper');
    var slider = (this.slider = '#Productlists-' + sectionId);
    var $slider = $(slider, wrapper);
    config.slideShow = parseInt($slider.attr('data-toshow'));
    config.scrollShow = parseInt($slider.attr('data-scroll'));
    config.rowNumber = parseInt($slider.attr('data-row'));
    var arrows = $slider.attr('data-arrows');
    var dots = $slider.data('dots');
    if( arrows == 'true'){
      var arrowTrue = true;
    }
    else{
      var arrowTrue = false;
    }
    var sliderActive = false;
    
    var mobileTinyOptions = $.extend({}, defaults, {
      arrows: false,
      slidesToShow: 2,
      slidesToScroll: 2,
      adaptiveHeight: true,
      dots: dots
    });
    
    var mobileOptions = $.extend({}, defaults, {
      arrows: false,
      slidesToShow: 2,
      slidesToScroll: 2,
      adaptiveHeight: true,
      dots: dots
    });
    var tableOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: 3,
      slidesToScroll: 3,
      adaptiveHeight: true,
      dots: dots
    });
    var desktopOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: config.slideShow,
      slidesToScroll: config.scrollShow,
      rows: config.rowNumber,
      adaptiveHeight: true,
      dots: dots
    });

    $slider.on('init', this.a11y.bind(this));
    
    enquire.register(config.mediaQueryTiny, {
      match: function() {
        initSlider($slider, mobileTinyOptions);
      }
    });
    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });
    enquire.register(config.mediaQueryMediumUp, {
      match: function() {
        initSlider($slider, tableOptions);
      }
    });
    enquire.register(config.mediaQueryLarge, {
      match: function() {
        initSlider($slider, desktopOptions);
      }
    });
    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }
  }

  Productlists.prototype = _.assignIn({}, Productlists.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);
	  enquire.unregister(config.mediaQueryLarge);
      $(this.slider, this.wrapper).slick('unslick');
    },
   
    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.productlists-slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
      
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return Productlists;
})();

//Product feature
theme.productFeature = (function() {

  function productFeature(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    
    this.settings = {
      // Breakpoints from src/stylesheets/global/variables.scss.liquid
      mediaQueryMediumUp: 'screen and (min-width: 750px)',
      mediaQuerySmall: 'screen and (max-width: 749px)',
      sectionId: sectionId,
      sliderActive: false,
    };
    
    this.selectors = {
      addToCart: '#AddToCart-' + sectionId,
      addToCartText: '#AddToCartText-' + sectionId,
      comparePrice: '#ComparePrice-' + sectionId,
      originalPrice: '#ProductPrice-' + sectionId,
      SKU: '.variant-sku',
      originalPriceWrapper: '.product-price__price-' + sectionId,
      originalSelectorId: '#ProductSelect-' + sectionId,
      productImageWraps: '.product-single__photo',
      productPrices: '.product-single__price-' + sectionId,
      productImage: '#product-images-' + sectionId,
      productThumbImages: '.product-single__thumbnail--' + sectionId,
      productThumbs: '.product-single__thumbnails-' + sectionId,
      saleClasses: 'product-price__sale product-price__sale--single',
      saleLabel: '.product-price__sale-label-' + sectionId,
      singleOptionSelector: '.single-option-selector-' + sectionId,
      thumbnailWrapper:'.thumbnails-wrapper-' + sectionId
    };  
      var options = {
        slidesToShow: $(this.selectors.thumbnailWrapper).data('toshow'),
        slidesToScroll: $(this.selectors.thumbnailWrapper).data('scroll'),
        dots: $(this.selectors.thumbnailWrapper).data('dots'),
        rows: $(this.selectors.thumbnailWrapper).data('row'), 
        arrows: $(this.selectors.thumbnailWrapper).data('arrows'), 
        infinite: false,
        focusOnSelect: true,
        rtl: checkrtl,  
        asNavFor: $(this.selectors.productImage),
        responsive: [
          {
            breakpoint: 321,
            settings: {
              slidesToShow: 3
            }
          }
        ]
      };
      var optionsImage = {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        infinite: false,
        lazyload:'progressive',
        asNavFor: $(this.selectors.productThumbs),
        rtl: checkrtl  
      };
      $(this.selectors.productThumbs).slick(options);
      $(this.selectors.productImage).slick(optionsImage);
      this.settings.sliderActive = true;  
  };

  return productFeature;
})();

//slick Product related
theme.Productrelated = (function() {
  var config = {
    mediaQueryTiny: 'screen and (max-width: 575px)',
    mediaQuerySmall: '(min-width: 576px) and (max-width: 750px)',
    mediaQueryMediumUp: '(min-width: 750px) and (max-width: 1199px)',
    mediaQueryLarge: 'screen and (min-width: 1200px)',
    slideShow: 0,
    scrollShow: 0,
    rowNumber: 0
  };
  var defaults = {
    accessibility: true,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 4,
    slidesToScroll: 4,
    rtl: checkrtl  
  };

  function Productrelated(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var wrapper = (this.wrapper = '.productrelated-wrapper');
    var slider = (this.slider = '#Productlistsrelated-' + sectionId);
    var $slider = $(slider, wrapper);
    config.slideShow = parseInt($slider.attr('data-toshow'));
    config.scrollShow = parseInt($slider.attr('data-scroll'));
    config.rowNumber = parseInt($slider.attr('data-row'));
    var arrows = $slider.attr('data-arrows');
    var dots = $slider.data('dots');
    if( arrows == 'true'){
      var arrowTrue = true;
    }
    else{
      var arrowTrue = false;
    }
    var sliderActive = false;
    
    var mobileTinyOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true,
      dots: dots
    });
    var mobileOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: 2,
      slidesToScroll: 2,
      adaptiveHeight: true,
      dots: dots
    });
    var tableOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: 3,
      slidesToScroll: 3,
      adaptiveHeight: true,
      dots: dots
    });
    var desktopOptions = $.extend({}, defaults, {
      
      arrows: arrowTrue,
      slidesToShow: config.slideShow,
      slidesToScroll: config.scrollShow,
      rows: config.rowNumber,
      adaptiveHeight: true,
      dots: dots
    });

    $slider.on('init', this.a11y.bind(this));

    enquire.register(config.mediaQueryTiny, {
      match: function() {
        initSlider($slider, mobileTinyOptions);
      }
    });
    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });
    enquire.register(config.mediaQueryMediumUp, {
      match: function() {
        initSlider($slider, tableOptions);
      }
    });
    enquire.register(config.mediaQueryLarge, {
      match: function() {
        initSlider($slider, desktopOptions);
      }
    });
    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
      if($slider.data('enable') == false ){        
      	 sliderObj.slick('unslick');
      }
    }
  }

  Productrelated.prototype = _.assignIn({}, Productrelated.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);
	  enquire.unregister(config.mediaQueryLarge);
      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.productrelated-slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return Productrelated;
})();

//slick product tabs
theme.Producttabs = (function() {
  var config = {
    mediaQueryTiny: 'screen and (max-width: 575px)',
    mediaQuerySmall: '(min-width: 576px) and (max-width: 750px)',
    mediaQueryMediumUp: '(min-width: 750px) and (max-width: 1199px)',
    mediaQueryLarge: 'screen and (min-width: 1200px)',
    slideShow: 0,
    scrollShow: 0,
    rowNumber: 0
  };
  var defaults = {
    accessibility: true,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 4,
    slidesToScroll: 4,
    rtl: checkrtl  
  };

  function Producttabs(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var wrapper = (this.wrapper = '.producttabs-wrapper__item');
    $container.find('.producttabs-wrapper__item').children().each(function(){
      var blockid = $(this).attr('data-block-id');
      var slider = (this.slider = '#Producttabs-' + blockid);
      var $slider = $(slider, wrapper);
      config.slideShow = parseInt($slider.attr('data-toshow'));
      config.scrollShow = parseInt($slider.attr('data-scroll'));
      config.rowNumber = parseInt($slider.attr('data-row'));
      var arrows = $slider.attr('data-arrows');
      var dots = $slider.data('dots');
      if( arrows == 'true'){
        var arrowTrue = true;
      }
      else{
        var arrowTrue = false;
      }
      var sliderActive = false;
      
      var mobileTinyOptions = $.extend({}, defaults, {
        arrows: arrowTrue,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        dots: dots
    });
      var mobileOptions = $.extend({}, defaults, {
        arrows: arrowTrue,
        slidesToShow: 2,
        slidesToScroll: 2,
        adaptiveHeight: true,
        dots: dots
      });
      var tableOptions = $.extend({}, defaults, {
        arrows: arrowTrue,
        slidesToShow: 3,
        slidesToScroll: 3,
        adaptiveHeight: true,
        dots: dots
      });
      var desktopOptions = $.extend({}, defaults, {
        arrows: arrowTrue,
        slidesToShow: config.slideShow,
        slidesToScroll: config.scrollShow,
        rows: config.rowNumber,
        adaptiveHeight: true,
        dots: dots
      });
      
      enquire.register(config.mediaQueryTiny, {
        match: function() {
          initSlider($slider, mobileTinyOptions);
        }
      });
      enquire.register(config.mediaQuerySmall, {
        match: function() {
          initSlider($slider, mobileOptions);
        }
      });
      enquire.register(config.mediaQueryMediumUp, {
        match: function() {
          initSlider($slider, tableOptions);
        }
      });
      enquire.register(config.mediaQueryLarge, {
        match: function() {
          initSlider($slider, desktopOptions);
        }
      });
      function initSlider(sliderObj, args) {
        if (sliderActive) {
          sliderObj.slick('unslick');
          sliderActive = false;
        }

        sliderObj.slick(args);
        sliderActive = true;
      }
    });
  }
  return Producttabs;
})();

$(function () {
  $('#myTab a:last').tab('show');
})
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  e.target // newly activated tab
  e.relatedTarget // previous active tab
  $('.producttabs-wrapper__item').children().slick("setPosition");
});
//end product tabs
//slick collection list
theme.Collectionlists = (function() {
  var config = {
    mediaQuerySmall: 'screen and (max-width: 749px)',
    mediaQueryMediumUp: 'screen and (min-width: 750px)',
    slideShow: 0,
    scrollShow: 0,
    rowNumber: 0
  };
  var defaults = {
    accessibility: true,
    dots: false,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 4,
    slidesToScroll: 4,
    rtl: checkrtl  
  };

  function Collectionlists(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var wrapper = (this.wrapper = '.collectionlist-wrapper');
    var slider = (this.slider = '#Collectionlists-' + sectionId);
    var $slider = $(slider, wrapper);
    config.slideShow = parseInt($slider.attr('data-toshow'));
    config.scrollShow = parseInt($slider.attr('data-scroll'));
    config.rowNumber = parseInt($slider.attr('data-row'));
    var arrows = $slider.attr('data-arrows');
    if( arrows == 'true'){
      var arrowTrue = true;
    }
    else{
      var arrowTrue = false;
    }
    var sliderActive = false;
    var mobileOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: 2,
      slidesToScroll: 2,
      adaptiveHeight: true
    });
    var desktopOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: config.slideShow,
      slidesToScroll: config.scrollShow,
      rows: config.rowNumber,
      adaptiveHeight: true
    });

    $slider.on('init', this.a11y.bind(this));

    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });

    enquire.register(config.mediaQueryMediumUp, {
      match: function() {
        initSlider($slider, desktopOptions);
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }
  }

  Collectionlists.prototype = _.assignIn({}, Collectionlists.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.collectionlists-slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return Collectionlists;
})();
//slick blogs feature
theme.Blogs = (function() {
  var config = {
    mediaQueryPhone: 'screen and (max-width: 480px)',
    mediaQuerySmall: '(min-width: 481px) and (max-width: 749px)',
    mediaQueryMediumUp: 'screen and (min-width: 750px)',
    slideShow: 0,
    scrollShow: 0,
    rowNumber: 0
  };
  var defaults = {
    accessibility: true,
    dots: false,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 3,
    slidesToScroll: 3,
    rtl: checkrtl  
  };

  function Blogs(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var wrapper = (this.wrapper = '.blogs-wrapper');
    var slider = (this.slider = '#Blogs-' + sectionId);
    var $slider = $(slider, wrapper);
    var sliderActive = false;
    config.slideShow = parseInt($slider.attr('data-toshow'));
    config.scrollShow = parseInt($slider.attr('data-scroll'));
    config.rowNumber = parseInt($slider.attr('data-row'));
    var arrows = $slider.attr('data-arrows');
    if( arrows == 'true'){
      var arrowTrue = true;
    }
    else{
      var arrowTrue = false;
    }
    var mobilePhoneOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true
    });
    var mobileOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: 2,
      slidesToScroll: 2,
      adaptiveHeight: true
    });
    var desktopOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: config.slideShow,
      slidesToScroll: config.scrollShow,
      rows: config.rowNumber,
      adaptiveHeight: true
    });

    $slider.on('init', this.a11y.bind(this));
    
    enquire.register(config.mediaQueryPhone, {
      match: function() {
        initSlider($slider, mobilePhoneOptions);
      }
    });
    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });

    enquire.register(config.mediaQueryMediumUp, {
      match: function() {
        initSlider($slider, desktopOptions);
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }
  }

  Blogs.prototype = _.assignIn({}, Blogs.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQueryPhone);
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.blogs-slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return Blogs;
})();
//instagram
theme.Instagrams = (function() {
  function Instagrams() {
  $('.instagram-block').each(function(){
    var instagram_clientId = $(this).attr('data-clientID');
    var instagram_get = $(this).attr('data-get'); 
    var instagram_tag = $(this).attr('data-tag'); 
    var instagram_locationId = $(this).attr('data-locationId'); 
    var instagram_limit = $(this).attr('data-limit'); 
    var instagram_resolution = $(this).attr('data-resolution');
    var instagram_accessToken = $(this).attr('data-accessToken');
    var instagram_userId = $(this).attr('data-userId');
    var instagram_arrows = $(this).attr('data-arrows');
    if( instagram_arrows == 'true'){
    	var arrowTrue = true;
    }
    else{
    	var arrowTrue = false;
    }
    var config = {
            mediaQuerySmall: 'screen and (max-width: 749px)',
            mediaQueryMediumUp: 'screen and (min-width: 750px)',
            slideShow: 0,
            scrollShow: 0,
            rowNumber: 0
          };
          var defaults = {
            accessibility: true,
            arrows: arrowTrue,
            dots: false,
            autoplay: false,
            touchThreshold: 20,
            slidesToShow: 4,
            slidesToScroll: 4,
            rtl: checkrtl  
          };
          var id = $(this).attr('data-slide-slick');
          var slider = '.slick-instagram-list-' + id;
          var wrapper = '.block-content';
          var $slider = $(slider, wrapper);
          config.slideShow = parseInt($(this).attr('data-shortcode-column'));
          config.scrollShow = parseInt($(this).attr('data-shortcode-column'));
          config.rowNumber = parseInt($(this).attr('data-shortcode-row'));
          var sliderActive = false;
          var mobileOptions = $.extend({}, defaults, {
            slidesToShow: 2,
            slidesToScroll: 2,
            adaptiveHeight: true
          });
          var desktopOptions = $.extend({}, defaults, {
            slidesToShow: config.slideShow,
            slidesToScroll: config.scrollShow,
            rows: config.rowNumber,
            adaptiveHeight: true
          });
    var feed = new Instafeed({
        clientId: instagram_clientId,
        accessToken:  instagram_accessToken,
        get: instagram_get,    
        userId: instagram_userId,
        limit: instagram_limit,
        resolution: instagram_resolution,
      	target:"instafeed-" + id, 
        template: '<a href="{{link}}" target="_blank"><img src="{{image}}" /><div class="likes text-center"><i class="fas fa-heart"></i> {{likes}} <i class="fas fa-comments" style="margin-left: 10px"></i> {{comments}}</div></a>',
        after: function() {
          enquire.register(config.mediaQuerySmall, {
            match: function() {
              initSlider($slider, mobileOptions);
            }
          });

          enquire.register(config.mediaQueryMediumUp, {
            match: function() {
              initSlider($slider, desktopOptions);
            }
          });

          function initSlider(sliderObj, args) {
            if (sliderActive) {
              sliderObj.slick('unslick');
              sliderActive = false;
            }

            sliderObj.slick(args);
            sliderActive = true;
          }
          var images = $("#instafeed-" + id).find('a');
          $.each(images, function(index, image) {
            var delay = (index * 75) + 'ms';
            $(image).css('-webkit-animation-delay', delay);
            $(image).css('-moz-animation-delay', delay);
            $(image).css('-ms-animation-delay', delay);
            $(image).css('-o-animation-delay', delay);
            $(image).css('animation-delay', delay);
            $(image).addClass('animated flipInX');
          });
        }
    });
    feed.run();
  });
  }
  return Instagrams;
})();
//instagram footer
theme.Instagramsfooter = (function() {
  function Instagramsfooter() {
  $('.instagram-block--footer').each(function(){
    var instagram_clientId = $(this).attr('data-clientID');
    var instagram_get = $(this).attr('data-get'); 
    var instagram_limit = $(this).attr('data-limit'); 
    var instagram_resolution = $(this).attr('data-resolution');
    var instagram_accessToken = $(this).attr('data-accessToken');
    var instagram_userId = $(this).attr('data-userId');
    var config = {
            mediaQuerySmall: 'screen and (max-width: 749px)',
            mediaQueryMediumUp: 'screen and (min-width: 750px)',
            slideShow: 0,
            scrollShow: 0,
            rowNumber: 0
          };
          var defaults = {
            accessibility: true,
            arrows: false,
            dots: false,
            autoplay: false,
            touchThreshold: 20,
            slidesToShow: 4,
            slidesToScroll: 4,
            rtl: checkrtl  
          };
          var id = $(this).attr('data-slide-slick');
          var slider = '.slick-instagram-list-' + id;
          var wrapper = '.block-content';
          var $slider = $(slider, wrapper);
          config.slideShow = parseInt($(this).attr('data-shortcode-column'));
          config.scrollShow = parseInt($(this).attr('data-shortcode-column'));
          config.rowNumber = parseInt($(this).attr('data-shortcode-row'));
          var sliderActive = false;
          var mobileOptions = $.extend({}, defaults, {
            slidesToShow: 2,
            slidesToScroll: 2,
            adaptiveHeight: true
          });
          var desktopOptions = $.extend({}, defaults, {
            slidesToShow: config.slideShow,
            slidesToScroll: config.scrollShow,
            rows: config.rowNumber,
            adaptiveHeight: true
          });
    var feed = new Instafeed({
        clientId: instagram_clientId,
        accessToken:  instagram_accessToken,
        get: instagram_get,    
        userId: instagram_userId,
        limit: instagram_limit,
        resolution: instagram_resolution,
      	target:"instafeed-" + id, 
        after: function() {
          enquire.register(config.mediaQuerySmall, {
            match: function() {
              initSlider($slider, mobileOptions);
            }
          });

          enquire.register(config.mediaQueryMediumUp, {
            match: function() {
              initSlider($slider, desktopOptions);
            }
          });

          function initSlider(sliderObj, args) {
            if (sliderActive) {
              sliderObj.slick('unslick');
              sliderActive = false;
            }

            sliderObj.slick(args);
            sliderActive = true;
          }
        }
    });
    feed.run();
  });
  }
  return Instagramsfooter;
})();
//lookbook
theme.Lookbooks = (function() {
  function Lookbooks(container){
    // animation hover
    $('.popup--image .dot__show').each(function(){
      var dataTarget =  $(this).attr('data-show');
      $( this ).hover(
        function() {
		  $(".dot__show[data-show='" + dataTarget + "']" ).addClass("light");
          $(".pop-products[data-product='" + dataTarget + "'] >div" ).addClass("light");
        }, 
        function() {
		  $(".dot__show[data-show='" + dataTarget + "']" ).removeClass("light");
          $(".pop-products[data-product='" + dataTarget + "'] >div" ).removeClass("light");
        }
      );

    });
    $('.list-product .pop-products').each(function(){
      var dataTarget =  $(this).attr('data-product');
      $(this).hover(
        function() {
          $(".dot__show[data-show='" + dataTarget + "']" ).addClass("light");
          $(".pop-products[data-product='" + dataTarget + "'] >div" ).addClass("light");
        }, 
        function() {
          $(".dot__show[data-show='" + dataTarget + "']" ).removeClass("light");
          $(".pop-products[data-product='" + dataTarget + "'] >div" ).removeClass("light");
        }
      );
    });
  }
  return Lookbooks;
})();
//slick image bar
theme.Imagebars = (function() {
  var config = {
    mediaQuerySmall: 'screen and (max-width: 749px)',
    mediaQueryMediumUp: 'screen and (min-width: 750px)',
    slideShow: 0,
    scrollShow: 0,
    rowNumber: 0
  };
  var defaults = {
    accessibility: true,
    dots: false,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 4,
    slidesToScroll: 4,
    rtl: checkrtl  
  };

  function Imagebars(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var wrapper = (this.wrapper = '.imagebar-wrapper');
    var slider = (this.slider = '#Imagebars-' + sectionId);
    var $slider = $(slider, wrapper);
    config.slideShow = parseInt($slider.attr('data-toshow'));
    config.scrollShow = parseInt($slider.attr('data-scroll'));
    config.rowNumber = parseInt($slider.attr('data-row'));
    var arrows = $slider.attr('data-arrows');
    if( arrows == 'true'){
      var arrowTrue = true;
    }
    else{
      var arrowTrue = false;
    }
    var sliderActive = false;
    var mobileOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true
    });
    var desktopOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: config.slideShow,
      slidesToScroll: config.scrollShow,
      rows: config.rowNumber,
      adaptiveHeight: true
    });

    $slider.on('init', this.a11y.bind(this));

    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });

    enquire.register(config.mediaQueryMediumUp, {
      match: function() {
        initSlider($slider, desktopOptions);
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }
  }

  Imagebars.prototype = _.assignIn({}, Imagebars.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.imagebars-slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return Imagebars;
})();
//slick image bar
theme.Logobars = (function() {
  var config = {
    mediaQuerySmall: 'screen and (max-width: 749px)',
    mediaQueryMediumUp: 'screen and (min-width: 750px)',
    slideShow: 0,
    scrollShow: 0,
    rowNumber: 0
  };
  var defaults = {
    accessibility: true,
    dots: false,
    autoplay: false,
    touchThreshold: 20,
    slidesToShow: 4,
    slidesToScroll: 4,
    rtl: checkrtl  
  };

  function Logobars(container) {
    var $container = (this.$container = $(container));
    var sectionId = $container.attr('data-section-id');
    var wrapper = (this.wrapper = '.imagelogos-wrapper');
    var slider = (this.slider = '#Imagelogos-' + sectionId);
    var $slider = $(slider, wrapper);
    config.slideShow = parseInt($slider.attr('data-toshow'));
    config.scrollShow = parseInt($slider.attr('data-scroll'));
    config.rowNumber = parseInt($slider.attr('data-row'));
    var arrows = $slider.attr('data-arrows');
    if( arrows == 'true'){
      var arrowTrue = true;
    }
    else{
      var arrowTrue = false;
    }
    var sliderActive = false;
    var mobileOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: 2,
      slidesToScroll: 2,
      adaptiveHeight: true
    });
    var desktopOptions = $.extend({}, defaults, {
      arrows: arrowTrue,
      slidesToShow: config.slideShow,
      slidesToScroll: config.scrollShow,
      rows: config.rowNumber,
      adaptiveHeight: true
    });

    $slider.on('init', this.a11y.bind(this));

    enquire.register(config.mediaQuerySmall, {
      match: function() {
        initSlider($slider, mobileOptions);
      }
    });

    enquire.register(config.mediaQueryMediumUp, {
      match: function() {
        initSlider($slider, desktopOptions);
      }
    });

    function initSlider(sliderObj, args) {
      if (sliderActive) {
        sliderObj.slick('unslick');
        sliderActive = false;
      }

      sliderObj.slick(args);
      sliderActive = true;
    }
  }

  Logobars.prototype = _.assignIn({}, Logobars.prototype, {
    onUnload: function() {
      enquire.unregister(config.mediaQuerySmall);
      enquire.unregister(config.mediaQueryMediumUp);

      $(this.slider, this.wrapper).slick('unslick');
    },

    onBlockSelect: function(evt) {
      // Ignore the cloned version
      var $slide = $(
        '.imagelogo-slide--' + evt.detail.blockId + ':not(.slick-cloned)'
      );
      var slideIndex = $slide.data('slick-index');

      // Go to selected slide, pause autoplay
      $(this.slider, this.wrapper).slick('slickGoTo', slideIndex);
    },

    a11y: function(event, obj) {
      var $list = obj.$list;
      var $wrapper = $(this.wrapper, this.$container);

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused set aria-live
      $wrapper.on('focusin', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.attr('aria-live', 'polite');
        }
      });

      // Remove aria-live
      $wrapper.on('focusout', function(evt) {
        if ($wrapper.has(evt.target).length) {
          $list.removeAttr('aria-live');
        }
      });
    }
  });

  return Logobars;
})();

//popup newletter
if ($('#block--newsletter_popup').length) {
    theme.PopupNewletter = (function() {
  var popup = {
    setCookieNew: function() {
      if ($.cookie('newleter_popup') != "checkcookied") {
        this.newlettercheckbox();
        var timeCache = $('#block--newsletter_popup').data('timecache');
        setTimeout(function() {
          $('#block--newsletter_popup').modal();
          $('#block--newsletter_popup').on('hidden.bs.modal', function (e) {
            $.cookie('newleter_popup', 'checkcookied', { expires: 100, path: '/' } );
          });            
          $.cookie('newleter_popup', 'checkcookied', {expires:100, path:'/'});
        }, timeCache);
      }
    },
    newlettercheckbox: function() {
      $('#blockFooterCheckBox').change(function(){
        if ($(this).is(':checked')) {
          $.cookie('newleter_popup', "checkcookied", {expires:100, path:'/'});
        } else {
          $.cookie('newleter_popup', null, { path: '/' });
        }
      });
    }
  };
  return popup.setCookieNew();
})();
}
//blog masonry
theme.Blogmasonry = (function(){
// init Isotope
  function concat(){
    var $grid = $('.grid--Blog').isotope({
      itemSelector: '.blog__item'
    });

    // store filter for each group
    var filters = {};

    $('.filters-blog').on( 'click', '.button__tagBlog', function() {
      var $this = $(this);
      // get group key
      var $buttonGroup = $this.parents('.button-group');
      var filterGroup = $buttonGroup.attr('data-filter-group');
      // set filter for group
      filters[ filterGroup ] = $this.attr('data-filter');
      // combine filters
      var filterValue = concatValues( filters );
      // set filter for Isotope
      $grid.isotope({ filter: filterValue });
    });

    // change is-checked class on buttons
    $('.button-group').each( function( i, buttonGroup ) {
      var $buttonGroup = $( buttonGroup );
      $buttonGroup.on( 'click', 'button__tagBlog', function() {
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        $( this ).addClass('is-checked');
      });
    });
  }
  
// flatten object by concatting values
function concatValues( obj ) {
  var value = '';
  for ( var prop in obj ) {
    value += obj[ prop ];
  }
  return value;
}
  return concat;
})();
//ajaxtify loadajax in Blog page
if($('body').hasClass('template-blog')){
theme.Blogloadajax = (function(){
  ajaxify(
    {
      linkParent: '.aj-pagination',
      fade: 'fast',
      endlessOffset: 100
    }
  );
})();
}

window.theme = window.theme || {};

//slick product  shortcode
$('.products_block--slick').each(function(){
    var config = {
      mediaQuerySmall: 'screen and (max-width: 749px)',
      mediaQueryMediumUp: 'screen and (min-width: 750px)',
      slideShow: 0,
      scrollShow: 0,
      rowNumber: 0
    };
    var defaults = {
      accessibility: true,
      arrows: true,
      dots: false,
      autoplay: false,
      touchThreshold: 20,
      slidesToShow: 4,
      slidesToScroll: 4,
      rtl: checkrtl  
    };
	  var id = $(this).attr('data-slide-slick');
      var slider = '.slick-carousel-list-' + id;
  	  var wrapper = '.block_content';
      var $slider = $(slider, wrapper);
      config.slideShow = parseInt($(this).attr('data-shortcode-column'));
      config.scrollShow = parseInt($(this).attr('data-shortcode-column'));
      config.rowNumber = parseInt($(this).attr('data-shortcode-row'));
      var sliderActive = false;
      var mobileOptions = $.extend({}, defaults, {
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true
      });
      var desktopOptions = $.extend({}, defaults, {
        slidesToShow: config.slideShow,
        slidesToScroll: config.scrollShow,
        rows: config.rowNumber,
        adaptiveHeight: true
      });
      enquire.register(config.mediaQuerySmall, {
        match: function() {
          initSlider($slider, mobileOptions);
        }
      });

      enquire.register(config.mediaQueryMediumUp, {
        match: function() {
          initSlider($slider, desktopOptions);
        }
      });

      function initSlider(sliderObj, args) {
        if (sliderActive) {
          sliderObj.slick('unslick');
          sliderActive = false;
        }

        sliderObj.slick(args);
        sliderActive = true;
      }
});
//interval  shortcode carousel
$('.products_block--carousel').each(function(){
  $(this).find('.carousel-product').carousel({
    interval: 8000
  })
})
//modal video
autoPlayYouTubeModal();
//FUNCTION TO GET AND AUTO PLAY YOUTUBE VIDEO FROM DATATAG
function autoPlayYouTubeModal() {
  var trigger = $("body").find('[data-toggle="modal"]');
  trigger.click(function () {
    var theModal = $(this).data("target"),
        videoSRC = $(this).attr("data-theVideo"),
        videoSRCauto = videoSRC + "?autoplay=1";
    $(theModal + ' iframe').attr('src', videoSRCauto);
    $(theModal + ' button.close').click(function () {
      $(theModal + ' iframe').attr('src', videoSRC);
    });
  });
}
//tooltip boostrap
$(function () {
  $("[data-toggle='tooltip']").tooltip();
})

/////////////////////////////////////////////////////////QUICK VIEW//////////////////////////////////////////////////////////
var loading_selector = $('.loading');
var quickview_wrapper = $('#ap_quickview');
var quickview_open = false;
//noi dung cua quick view
var quickview_contnent = quickview_wrapper.find('.modal_content');
// check xem da include html popup chua
if (quickview_wrapper.length) {

    //event show modal of boostrap
    quickview_wrapper.on('show.bs.modal', function(e) {

        //set trang thai thanh da mo popup
        quickview_open = true;

        //reset content cho quick view )
        quickview_contnent.hide();

        //goi phan den phan tu a.quickview de lay link product - lay phan tu bi goi vao event - lay thang dau tien ( thang <a> bi click )
        var getTarget = $(e.relatedTarget).filter(':first');

        //lay handle cua thang a kia bang data-value
        var attr = getTarget.attr('data-value');

        //lay desscription cua product
        var small_description = getTarget.closest('.product').find('.description').html();

        //check function va goi vao function configureQuickView
        typeof(window['configureQuickView']) === "function" && window['configureQuickView'](attr, small_description);

        //bat su kien close modal
    }).on('hidden.bs.modal', function() {
   

        quickview_open = false;

        // check va bat su kien dong quick view - function destroyQuickView
        typeof(window['destroyQuickView']) === "function" && window['destroyQuickView']();

    });
}
var quickview_swatches = false;
function AddToCartQuickView(variant_id, selector, _swatch) {
    var _btn = selector.find('.addtocart-js');
    if (_btn.length == 0) return false;
    _btn.unbind().click(function(e) {
        e.preventDefault();

        var quantity = Math.max(1, parseInt(selector.find('.input-counter').find('input').val()));
        Shopify.addItem(variant_id, quantity);
    })
}
function configureQuickView(product_url, small_description) {
    // cat chuoi url . tach thanh 2 phan truoc va sau dau ('/'). bo thang dang sau di
    var handle = product_url.split('/').pop();

    // goi vao function get product cua shopify . Function nay tu file api.jquery cua shopify server
    Shopify.getProduct(handle, qvLoadSuccess);

    //function quickview load success
    function qvLoadSuccess(json_data) {
      
        //ductm
     
        //check quickview-swatches-container - doan nay la toan tu && 
        var view = $('.quickview-swatches-container').length && $('.quickview-swatches-container').attr('data-swatches-design');

        //viet tat if-else
        view = view == "true" ? 'viewSelect' : 'viewButtons';
        quickview_swatches = new theme.SwatchStructor(json_data, {
            contentParent: '.quickview-swatches-container',
            viewDesign: view,
            location:'quickview',
            enableHistoryState: false,
            callback: quickViewVariant,
            externalImagesObject: texture_obj,
            externalColors: colors_value,
            colorWithBorder: color_with_border
        });
     
        json_data = null;

        //tat loading
        loading_selector.hide();

        //show qv popup
        quickview_contnent.fadeIn();
    }

    //truyen vao variant - product
 function quickViewVariant(variant, product) {

        //khai bao bien de lay select cua product bi click vao
       
        var _ = $('#ap_quickview');
   
        var _parent_general_info = _.find('.product-info');

        var _swatch = _.find('.quickview-swatches-container');

        // goi vao fucntion swatch variant - truye vao may thang selector o tren
        swatchVariantHandler(_parent_general_info, variant);

        //goi vao object addToCartHandler - truyen vao may thang o tren
        var selector = $('#ap_quickview');
        var variant_id = variant.id;

        AddToCartQuickView(variant_id, selector, _swatch);
       
        //title

        _.find('.title').html(product.title);

        //product url

        _.find('.viewfullinfo') && _.find('.viewfullinfo').attr('href', product_url).html('View Full Info');

        //vendor
        _.find('.qv_vendor') && _.find('.qv_vendor').html(product.vendor);

        //type
        var qv_type = _.find('.qv_type');

        if (qv_type.length) {
            product.type == '' ? qv_type.parent().hide() : qv_type.html(product.type).parent().show();
        }

   //image
   var _img = _.find('.product-main-image ul');
   if(_img.hasClass('slick-initialized') == false){   
       
         var _image = $(_img)
             .find('li');
         _img.empty();
         if (product.images.length > 0) {
             for (j in product.images) {
                 var imageLar = '<li class="grid__itemimage"><a href="javascript:void(0)" data-imageid="' + product.id + '" data-image="' + product.images[j] + '" ><img src="' + product.images[j] + '" alt="Proimage" /></a></li>';
                 _img.append(imageLar);
             }
         }
   }
   var _imgThumbnail = _.find('.image-quickview-thumbnail ul');
   if(_imgThumbnail.hasClass('slick-initialized') == false){   
        

         var _imageThum = $(_imgThumbnail)
             .find('li');
         _imgThumbnail.empty();
         if (product.images.length > 0) {
             for (i in product.images) {
                 var thum = '<li class="grid__item col-xs-12 col-md-3 product-single__thumbnails-item js mt-2"><a href="javascript:void(0)" data-imageid="' + product.id + '" data-image="' + product.images[i] + '" ><img src="' + product.images[i] + '" alt="Proimage" /></a></li>';
                 _imgThumbnail.append(thum);
             }
         }
   }
    if (product.images.length > 0) {
             _imgThumbnail.not('.slick-initialized')
                 .slick({
                     slidesToShow: 4
                     , slidesToScroll: 4
                     , arrows: false
                     , dots: false
                     , focusOnSelect: true
                     , asNavFor: _img
                 , });
             _img.not('.slick-initialized')
                 .slick({
                     slidesToShow: 1
                     , slidesToScroll: 1
                     , arrows: false
                     , dots: false
                     , asNavFor: _imgThumbnail
                 , });
         }

   
        //replace description
        var description = _.find('.description').empty();
        description.length && description.html(small_description);
    }
}

function swatchVariantHandler(_parent, variant) {
    var _ = _parent;
    var _price = _.find('.price');
    var _info = _.find('.add-info');
    var _sku = _info.length && _info.find('.sku');
    var _avaibility = _info.length && _info.find('.availability');
    var _input = _.find('.input-counter').find('input');
    var _btnaddtocart = _.find('.btn-addtocart');
    var _barcode = _.find('.barcode');
    var qty_label = _.find('.qty-label');
    var input_counter = _.find('.input-counter');
    var price_str = Shopify.formatMoney(variant.price, money_format);
    var price_comare_str = Shopify.formatMoney(variant.compare_at_price, money_format);


    if (variant.price < variant.compare_at_price) {
        _price.find('>span:first').addClass('new-price').html(price_str);
        _price.find('>span:last').removeClass('hide').html(price_comare_str);
    } else {
        _price.find('>span:first').removeClass('new-price').html(price_str);
        _price.find('>span:last').addClass('hide');
    }

    if (_sku.length) {
        _sku.children().last().html(variant.sku);
        variant.sku == '' ? _sku.addClass('hide') : _sku.removeClass('hide');
    }

    if (_barcode.length) {
        _barcode.html(variant.barcode);
        variant.barcode == '' ? _barcode.parent().addClass('hide') : _barcode.parent().removeClass('hide');
    }
    // Inventory Quantity
    var inventory_management = variant.inventory_management;
    var inventory_policy = variant.inventory_policy;
    var inventory_quantity = variant.inventory_quantity;

    if (_avaibility.length) {
        if (Boolean(variant.available)) {
            _avaibility.find('.sold_out').addClass('hide');
            if (inventory_management == null || inventory_policy == "continue") {
                inventory_quantity = 9999;
                _avaibility.find('.stock_quantity, .in_stock').addClass('hide');
                _avaibility.find('.many_in_stock').removeClass('hide');
            } else {
                _avaibility.find('.stock_quantity').removeClass('hide').html(inventory_quantity);
                _avaibility.find('.in_stock').removeClass('hide');
                _avaibility.find('.many_in_stock').addClass('hide');
            }
        } else {
            _avaibility.find('.stock_quantity, .in_stock, .many_in_stock').addClass('hide');
            _avaibility.find('.sold_out').removeClass('hide');
        }
    }
    if (_btnaddtocart.length == 0) return false

    // Form
    if (Boolean(variant.available)) {
        qty_label.closest('.wrapper').show();
        _btnaddtocart.html(addtocart_text).removeClass('disable');
    } else {
        qty_label.closest('.wrapper').hide();
        _btnaddtocart.html(unavailable_text).addClass('disable');
    }
}

quantityChangeOption = function(){
    $(".js-quantity-button").on("click", function() {
      var el = $(this),
          id = el.data("id"),
          qtySelector = el.siblings(".js-quantity"),
          qty = parseInt(qtySelector.val().replace(/\D/g, ''));
      var qty = validateQty(qty);
      // Add or subtract from the current quantity
      if (el.hasClass("js-button-plus")) {
          qty = qty + 1;
      } else {
          qty = qty - 1;
          if (qty <= 1) qty = 1;
      }
      // Update the input's number
      qtySelector.val(qty);
    });
}
resetQuantity = function(){
	$('.js-quantity').val(1);
}
//////////////////////////////////////////////////////////END QUICKVIEW //////////////////////////////////////////////////////

//////////////////////////////////////////////////////////GLOBAL FUNCTION /////////////////////////////////////////////////////
quantityChangeOption();
validateQty = function (qty) {
        if((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {
            // We have a number!
        } else {
            // Not a number. Default to 1.
            qty = 1;
        }
        return qty;
    };
function destroyQuickView() {
    resetQuantity();
    quickview_swatches && theme.SwatchStructor.destroy;
    quickview_swatches = false;
    var _ = quickview_wrapper;
    _.find('.product-main-image ul').empty().removeClass('slick-initialized slick-slider');
    _.find('.image-quickview-thumbnail ul').empty().removeClass('slick-initialized slick-slider');
    _.find('.description').empty();
    _.find('.swatches-container').empty();
    _.find('.title').empty();
}
function getAllOptions(data) {
    var arr = '';
    var available = true;
    var obj = {};
    for (var i = 0; i < data.length; i++) {
        arr = String(data[i].title).replace(/\/ /g, '/').split('/');
        available = Boolean(data[i].available);

        if (arr[0] && available) {
            if (arr[1]) {
                obj[arr[0]] = obj[arr[0]] || {};
                if (arr[2]) {
                    obj[arr[0]][arr[1]] = obj[arr[0]][arr[1]] || {};
                    obj[arr[0]][arr[1]][arr[2]] = true;
                } else {
                    obj[arr[0]][arr[1]] = true;
                }
            } else {
                obj[arr[0]] = true;
            }
        }
    }
    return obj;
}
function getCurrentVariantById(data, idToLookFor) {
    for (var i = 0; i < data.length; i++) {
        if (!idToLookFor) {
            if (data[i].available) return (data[i]);
        } else {
            if (data[i].id == idToLookFor) return (data[i]);
        }
    }
    return (data[0]);
}
function getCurrentVariantByTitle(data, TitleToLookFor) {
    if (!TitleToLookFor) return data[0];

    var d = 2;
    top:
        for (var i = 0; i < data.length; i++) {
            if (data[i].title.indexOf(TitleToLookFor) > -1 && data[i].available) return (data[i]);
            if (i == data.length - 1) {
                if (TitleToLookFor.indexOf('/') > -1) {
                    TitleToLookFor = TitleToLookFor.split('/');
                    TitleToLookFor.pop();
                    TitleToLookFor = TitleToLookFor.length > 1 ? TitleToLookFor.join('/') : TitleToLookFor;
                    i = 0;
                    continue top;
                }
            }
        }
    return (data[0]);
}
function getVariantIdUrl() {
    var path_search = location.search;
    if (path_search.indexOf('variant=') > -1) {
        path_search = path_search.match(/variant=\d+/g);
        path_search = parseInt(path_search[0].match(/\d+/g));
    }
    return path_search
}
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
function viewButtons(type, obj) {
    obj = obj || {};
    var mainElementName = '.wrapper';
    switch (type) {
        case 'getFunctionClickHandler':
            return 'buttonHandler';

        case 'getGroupElementName':
            return mainElementName;

        case 'getGroupHtml':
            var elementName = mainElementName.replace(/([\.#])/g, ''),
                title_html = '<span class="title-options label">' + obj.title + ':' + '</span>',
                value_html = obj.html;

            return '<div class="' + elementName + '">' + title_html + '<ul class="options options-large">' + value_html + '</ul></div>';

        case 'getButtonHtml':
            var value = obj.value.trim();
            var color = value.toLowerCase();
            

            color = ',' + color + ':';
            color = obj.colors.indexOf(color) > -1 ? obj.colors.split(color).pop().split(',').shift().trim() : false;
            var style = value in obj.texture ? ' style="background:url(' + obj.texture[value] + ')"' : '';
            if (style == '' && color) style = ' style="background:' + color + ';"';

            var btn = style != '' ?
                '<li><a href="#" class="options-color'  + '" data-value="' + value + '" title="' + value + '" ' + style + '></a></li>' :
                '<li><a href="#" data-value="' + value + '" title="' + value + '">' + value + '</a></li>';
            if (obj.value != obj.selected) return btn;
            return btn.replace(/<li/, '<li class="active"');
    }
}
function viewSelect(type, obj) {
    obj = obj || {};
    var mainElementName = '.wrapper';
    switch (type) {
        case 'getFunctionClickHandler':
            return 'selectHandler';
        case 'getGroupElementName':
            return mainElementName;
        case 'getGroupHtml':
            var elementName = mainElementName.replace(/([\.#])/g, ''),
                title_html = '<span class="title-options">' + obj.title + ':' + '</span>',
                value_html = obj.html;
            return '<div class="' + elementName + '">' + title_html + '<select class="form-control select-inline">' + value_html + '</select></div>';
        case 'getButtonHtml':
            var btn = '<option>' + obj.value.trim() + '</option>';
            if (obj.value != obj.selected) return btn;
            return btn.replace(/<option/, '<option selected');
    }
}
function countdownGrid() {
  if (0 < $(".countdown-item").length) {
    $(".countdown-item").each(function() {
      var isprocessbar = $(this).closest('.product-countdown-item').prev();
      var now = new Date;
      var date = $(this).data("countdown-end-time").split("-");
      var dateStart = $(this).data("countdown-start-time").split("-");
      dateStart = new Date(dateStart[2], parseInt(dateStart[0] - 1), dateStart[1])
      date = new Date(date[2], parseInt(date[0] - 1), date[1]);
      if (now < date && dateStart <= now) {
        $(this).countdown({
          until : date,
          layout: '<span class="countdown-day">{dn}<span>days</span></span><span class="countdown-hour">{hn}<span>hours</span></span><span class="countdown-minute">{mn}<span>minutes</span></span><span class="countdown-second">{sn}<span>seconds</span></span>'
        });

        var countDownDate = new Date(date).getTime();
        // Find the distance between now an the count down date
        var distance = countDownDate - now;
		
        var totalTimeStart = date - dateStart;
        
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        var daysOld = Math.floor(totalTimeStart / (1000 * 60 * 60 * 24));
        var hoursOld = Math.floor((totalTimeStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutesOld = Math.floor((totalTimeStart % (1000 * 60 * 60)) / (1000 * 60));
        var secondsOld = Math.floor((totalTimeStart % (1000 * 60)) / 1000);
        
        var timeTotal = daysOld*24*3600 + hoursOld*3600 + minutesOld*60 + seconds;
        
        if(days > 0){
          var sumTime = days*24*3600 + hours*3600 + minutes*60 + seconds;
        }else{
          var sumTime = hours*3600 + minutes*60 + seconds;
        }
        var timeAlert =  timeTotal / 3;
        function progress(timeleft, timetotal, $element) {
          var progressBarWidth = timeleft * $element.width() / timetotal;                		  
          $element.find('.barcontent').css('width', progressBarWidth);
          
          if(timeleft > 0) {
            setTimeout(function() {
              progress(timeleft - 1, timetotal, $element);
              var timeCurrent = timeleft - 1;
  
              if(timeCurrent < timeAlert){
              	$element.find('div').addClass('haft');
              }else{
              	$element.find('div').removeClass('haft');
              }
            }, 1000);
          }
        };
        if(dateStart <= now){
          progress(sumTime, timeTotal, isprocessbar);
        }
      }
    });
  }
}
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
      var hideTwitterAttempts = 0;
	  var tId =   $('#ap-twitter').data('id');
	  var theight =   $('#ap-twitter').data('height');
	  var twidth =   $('#ap-twitter').data('width');
	  var tcolor =   $('#ap-twitter').data('color');
	  var tlinkcolor =   $('#ap-twitter').data('linkcolor');
	  var tnamecolor=   $('#ap-twitter').data('namecolor');

      function hideTwitterBoxElements() {
        setTimeout( function() {
          if($('[id*=ap-twitter'+ tId + ']' ).length) {
            $('#ap-twitter'+ tId + ' iframe').each(function(){
              var ibody = $(this).contents().find( 'body' );
              var show_scroll =  false;
              var height =  theight +'px';
              var width =  twidth+'px';
              if(ibody.find('.timeline-TweetList li.timeline-TweetList-tweet').length) {

                if($(window).width() < 768 ){
                  ibody.find( '.timeline-Tweet' ).css( 'max-width', '100%' );
                }
                if($(window).width() == 768 ){
                  ibody.find( '.timeline-Tweet' ).css( 'max-width', '230px' );
                }
                else{
                  ibody.find( '.timeline-Tweet' ).css( 'width', width );
                }
                ibody.find( '.timeline-Tweet-text' ).css( 'color', tcolor );                                                     
                ibody.find( '.TweetAuthor-screenName ' ).css( 'color', tlinkcolor );                                                                                                 
                ibody.find( '.TweetAuthor-name' ).css( 'color', tnamecolor);                                                                                                                                        
                if(show_scroll == 1){
                  ibody.find( '.timeline-Widget' ).css( 'max-height', height );
                  ibody.find( '.timeline-Widget' ).css( 'overflow-y', 'auto' );  
                  ibody.find( '.timeline-Body' ).css( 'height', 'inherit !important' );
                }
              } else {
                $(this).hide();
          }
        });
      }
      hideTwitterAttempts++;
      if ( hideTwitterAttempts < 3 ) {
        hideTwitterBoxElements();
      }
      }, 1500);
      }

      $(document).ready(function(){
        hideTwitterBoxElements();
      });

////cookie poup
if ($('#virtue-cookies').length) {
  function lawCookie(){
    if($.cookie('popup-cookie-law') != 'accept-cookie' ){
      var mainCookie = $("#virtue-cookies");
      setTimeout(function(){
        $(mainCookie).addClass('show-popup');
        $(mainCookie).find('#virtue-cookies-ok').click(function(){
          acceptCookie();
        });
        $(mainCookie).find('#virtue-cookies-close').click(function(){
          skipCookie();
        });
      },1000);
    }
    function acceptCookie(){
      $(mainCookie).addClass('hide-popup');
      $.cookie('popup-cookie-law', 'accept-cookie', {expires: 100, path: '/'});
    }
    function skipCookie(){
      $(mainCookie).addClass('hide-popup');
      $.cookie('popup-cookie-law', null, {path: '/'});
    }

  }
}
//lookbook slide  
function LookbookSlide() {
  if($('.wrapper-parent-lookbook').length){
    var configDis = {
      mediaQueryDesktop: 'screen and (min-width: 992px)',
      mediaQueryTablet: '(min-width: 768px) and (max-width: 991px)',
      mediaQueryMobile: 'screen and (max-width: 767px)',
    };
    $('.wrapper-parent-lookbook').each(function(){  
      var defaults = {
        arrows: true,
        dots: true,
        rtl: checkrtl  
      };
      var id = $(this).attr('data-lookbookIdSlise'); 
      var toShow = parseInt($(this).data('toshow'));
      var toScroll =parseInt($(this).data('toscroll'));
      if($(this).data('centerMode') == "true"){
        var centerMode = true ;
      }else{
        var centerMode = false ;
      }
      if($(this).data('variableWidth') == "true"){
        var variableWidth = true ;
      }else{
        var variableWidth = false ;
      }
      var slider = $(this).find('.wrapper-lookbook-' + id);
      var wrapper = $(this).find('.block-content');
      var $slider = $(slider, wrapper);
      var sliderActive = false;
       var desktopOptions = $.extend({}, defaults, {
        slidesToShow: toShow,
        slidesToScroll: toScroll,
        centerMode: centerMode,
        variableWidth: variableWidth,
      });
       var tabletOptions = $.extend({}, defaults, {
        slidesToShow: 2,
        slidesToScroll: 2,
       });
      var mobileOptions = $.extend({}, defaults, {
        slidesToShow: 1,
        slidesToScroll: 1,
      });
      initSlider($slider, mobileOptions);
      enquire.register(configDis.mediaQueryDesktop, {
        match: function() {
          initSlider($slider, desktopOptions);
        }
      });
      enquire.register(configDis.mediaQueryTablet, {
        match: function() {
          initSlider($slider, tabletOptions);
        }
      });
      enquire.register(configDis.mediaQueryMobile, {
        match: function() {
          initSlider($slider, mobileOptions);
        }
      });
      function initSlider(sliderObj, args) {
        if (sliderActive) {
          sliderObj.slick('unslick');
          sliderActive = false;
        }

        sliderObj.slick(args);
        sliderActive = true;
      }
    })
  }
}; 
// hide topbar mobile
function hideTopbar(){
  enquire.register('screen and (max-width: 767px)', {
    match: function() {
      //       $('.topnar-inner').find('.text-nav-topbar').slideUp();
      $('.topnar-inner').find('.text-nav-topbar').first().slideDown();
      $('.topnar-inner').find('.btn-toggle-mobile').click(function(){
        $('.topnar-inner').find('.text-nav-topbar:not(:first)').slideToggle();
      });
    }
  });
}
//filter top
$('.fixed-top-sidebar').css('top', $('.breadcrumb-nav').outerHeight() + $('.collection-header').outerHeight());

//////////////// Start Up Sell & Group Sell ///////////////////
$(document).ready(function(){  
  if ($('#virtue-cookies').length) {
    lawCookie();
  }
  LookbookSlide();
  if($('body').hasClass('template-page')){
    $('.sticky-sidebar').stick_in_parent();}
  hideTopbar();
});
$(document).ready(function() {
//swatch when change slick detail
  $('#product-images-product-template').on('beforeChange', function(event, slick, currentSlide, nextSlide){
    var n = nextSlide + 2;
	$(".swatches-container .wrapper:nth-child(1) a").each(function() {
      if($("#product-images-product-template .slick-slide:nth-child("+ n +")").data('option1') == $(this).data('value')){
      	 $(this).trigger( "click" );
      }
    });
  });
// swatch grid
  $('.swatch-variant ul.options li a').click(function(){
    var moneyFormat = theme.moneyFormat;
    for (var k in Currency.moneyFormats){
      if(k == Currency.currentCurrency){
          moneyFormat = Currency.moneyFormats[k].money_format
      }
    }
    var price1 = Currency.convert($(this).data('price'),shopCurrency,Currency.currentCurrency);
    var price2 = Currency.convert($(this).data('compprice'),shopCurrency,Currency.currentCurrency);
    if(price1){
    	$(this).closest(".grid-view-item").find('.product-price__price').find('.money').html(Shopify.formatMoney(price1,moneyFormat));
  	}
    if(price2){
    	$(this).closest(".grid-view-item").find('.product-price__sale').find('.money').html(Shopify.formatMoney(price2,moneyFormat));
    }
  });
 // changeQuantityProduct();
 //  upSellSlide('.upsell-wrapper');
 // upSellSlide('.groupupsell-wrapper');
});
//////////////// End Up Sell & Group Sell ///////////////////
/////////////// change Quantity ////////////////////

theme.Cookie = (function() {
    var $compareButton = null;
    var $compareTile = null;
    var compare = null;

    /*
     * Update button to show current state (gold for active)
     */
    var animateCompare = function(self) {
        $(self).toggleClass('is-active');
    };
	
    /*
     * Add/Remove selected item to the user's wishlist array in localStorage
     * Compare button class 'is-active' determines whether or not to add or remove
     * If 'is-active', remove the item, otherwise add it
     */
    var updateCompare = function(self,cookie_name,page) {
      	compare = localStorage.getItem(cookie_name) || [];
        if (compare.length > 0) {
            compare = JSON.parse(localStorage.getItem(cookie_name));
        }
        var productHandle = $(self).attr('data-product-handle');
        var isRemove = $(self).hasClass('is-active');
        /* Remove */
        if (isRemove) {
            var removeIndex = compare.indexOf(productHandle);
            compare.splice(removeIndex, 1);
            localStorage.setItem(cookie_name, JSON.stringify(compare));
        }
        /* Add */
        else {
            compare.push(productHandle);
            localStorage.setItem(cookie_name, JSON.stringify(compare));
        }
      	updateCountCookie(cookie_name,page);
    };

    /*
     * Loop through compare buttons and activate any items that are already in user's compare
     * Activate by adding class 'is-active'
     * Run on initialization
     */
    var activateItemsInCompare = function() {
        $compareButton.each(function() {
          	$('[data-toggle="popover"]').popover(); 
            var productHandle = $(this).attr('data-product-handle');
            if (compare.indexOf(productHandle) > -1) {
                $(this).addClass('is-active'); 
            }
        });
    };

    var displayOnlyCompareItems = function(cookie_name,page,tile) {
      	var compare = localStorage.getItem(cookie_name);
      	
        if(!compare) {
          $("#popup-content").remove();
          return;
        }
        if (compare.length > 0) {
            compare = JSON.parse(localStorage.getItem(cookie_name));
        }
      	$(tile + ' .product-tile-container').each(function() {
          	var productHandle = $(this).attr('data-product-handle');
            if (compare.indexOf(productHandle) === -1) {
                $(this).remove();
            }
        }).promise().done( function(){ 
      		$(page +'-loader').fadeOut(0, function() {
              $(page +'-grid').addClass('is_visible');
              $(page + '-hero').addClass('is_visible');
              if (compare.length) {
                 $(page + '-grid--empty-list').hide();

              } else {
                $(page + '-grid--empty-list').show();
                $('.compare-grid').hide();

              }
           });
      	} );
    };

    /*
     * Check if on the compare page and hide any items that aren't a part of the compare
     * If no wishlist items exist, show the empty compare notice
     */
    var loadCompare = function(cookie_name,page,tile) {      
      if($('.page-check-data').data('page') == page ){
        compare = localStorage.getItem(cookie_name);
	    var statusCount = compare.length;
        if (window.location.href.indexOf('pages/'+page) > -1) {
          displayOnlyCompareItems(cookie_name,page,tile);
        }
      }
    };
  
  	var updateCountCookie = function(cookie_name,page) {
      	compare = localStorage.getItem(cookie_name) || [];
        if (compare.length > 0) {
            compare = JSON.parse(localStorage.getItem(cookie_name));	
        }
      	$(".quick-"+page+" span").html(compare.length);
    };

    var bindUIActions = function(cookie_name,page) {
        $compareButton.click(function(e) {
            e.preventDefault();
            updateCompare(this,cookie_name,page);
            animateCompare(this);   
        });
    };
  	
    var clickAddRemove = function(page){
      $('.action--' + page).each(function(){
        $(this).click(function(){
          if($(this).hasClass('remove-item-compare')){
          	$(this).closest('.product-tile-container').remove(); 
          }
          if($(this).hasClass('remove-item-wishlist')){
            $(this).closest('.product-tile-container').remove(); 
            $(this).remove();
          }
          if($(this).hasClass('is-active')){
            $(this).attr('title', page)
            $(this).find('.removed').show();
			$(this).find('.added').hide();
          }else{
            $(this).attr('title', 'Added '+ page)
            $(this).find('.added').show();
			$(this).find('.removed').hide();
          }  
        });
      });
      $(document).mouseup(function(e){
        var container = $('.action--' + page);

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) 
        {
          container.find('.added').hide();
          container.find('.removed').hide();
        }
      });
    };
  	var cookieIconAction = function(page,tile,cookie_name) {
      $(".quick-"+page).click(function(){
        var url = $(this).attr("data-url");
        $.ajax({
            type: "GET",
            url: url,
            async: !1,
            beforeSend: function() {
                //showLoading()
              $('.compare_loading').addClass('active');
            },
            complete: function(b) {
              var a_compare = JSON.parse(localStorage.getItem(cookie_name));
              if(cookie_name == 'user_compare'){
                if(a_compare!= null && a_compare.length==0){
                  $("#popup-content").html($('.compare-grid--empty-list', b.responseText).html());
                  $(".compare-grid--empty-list").css('display','block');
                }else{
                	$("#popup-content").html($(tile, b.responseText).html()); 
                }
              }
              if(cookie_name == 'user_wishlist'){
                $("#popup-content").html($(tile, b.responseText).html());
              }
              displayOnlyCompareItems(cookie_name,page,"#popup-content");
              $('.compare_loading').removeClass('active');
              theme.Cookie.init('.compare-btn','.compare-grid','user_compare','compare');
            },
            error: function(a, b) {
                //hideLoading()
               $('.compare_loading').removeClass('active');
            }
        })
        
        
       // return false;
		compareHeight();
      });
    }
    
        
       
  //tạo khung compare
    
    var compareHeight = function(){  
      var maxHeightImage = Math.max.apply(null, $(".image_compare").map(function (){
        return $(this).height();
      }).get());
      $(".image_compare").each(function(){
        $(this).css('height', maxHeightImage + 20);
      });
       var maxHeightImage = Math.max.apply(null, $(".availability_compare").map(function (){
        return $(this).height();
      }).get());
      $(".availability_compare").each(function(){
        $(this).css('height', maxHeightImage + 20);
      });
      var maxHeightImage = Math.max.apply(null, $(".price_compare").map(function (){
        return $(this).height();
      }).get());
      $(".price_compare").each(function(){
        $(this).css('height', maxHeightImage);
      });
      var maxHeightImage = Math.max.apply(null, $(".vender_compare").map(function (){
        return $(this).height();
      }).get());
      $(".vender_compare").each(function(){
        $(this).css('height', maxHeightImage);
      });
      var maxHeightImage = Math.max.apply(null, $(".type_compare").map(function (){
        return $(this).height();
      }).get());
      $(".type_compare").each(function(){
        $(this).css('height', maxHeightImage);
      });

      var maxHeightImage = Math.max.apply(null, $(".options_compare").map(function (){
        return $(this).height();
      }).get());
      $(".options_compare").each(function(){
        $(this).css('height', maxHeightImage);
      });

      var maxHeightImage = Math.max.apply(null, $(".rate_compare").map(function (){
        return $(this).height();
      }).get());
      $(".rate_compare").each(function(){
        $(this).css('height', maxHeightImage + 20);
      });

    }
    function init(button,tile,cookie_name,page) {
        clickAddRemove(page);
      	$compareButton = $(button);
    	compare = localStorage.getItem(cookie_name) || [];
        if (compare.length > 0) {
            compare = JSON.parse(localStorage.getItem(cookie_name));
        }
        bindUIActions(cookie_name,page);
        activateItemsInCompare();
        loadCompare(cookie_name,page,tile);
      	updateCountCookie(cookie_name,page);
      	compareHeight();
      	
      	var a_compare = JSON.parse(localStorage.getItem(cookie_name));
        if(cookie_name == 'user_compare'){
          if(a_compare!= null && a_compare.length==0){
            $(".compare-grid").css('display','none')
          	$(".compare-grid--empty-list").css('display','block');
          }
        }
      	if(cookie_name == 'user_wishlist'){
          if(a_compare!= null && a_compare.length==0){
          	$(".wishlist-grid--empty-list").css('display','block');
          }
        }
      
      	if($(".ap-check-action").hasClass("quick-"+page))
      		cookieIconAction(page,tile,cookie_name);      
    };
  	return {
        init: init
    };
})();
//   khởi tạo compare và wishlist
theme.Cookie.init('.compare-btn','.compare-grid','user_compare','compare');
theme.Cookie.init('.wishlist-btn','.wishlist-grid','user_wishlist','wishlist');

function changeCurrentcies()
{
  Currency.format = "money_format";
  var r = Currency.cookie.read();
  $("span.money span.money").each(function() {
    $(this).parent("span.money").removeClass("money")
  }), $("span.money").each(function() {
    $(this).attr("data-currency-" + shopCurrency, $(this).html());
  });
  var e = $(".currencies a"),
      n = $(".pre-currencies");

  if (null == r || r == shopCurrency) Currency.currentCurrency = shopCurrency;
  else {
    Currency.currentCurrency = r, Currency.convertAll(shopCurrency, r), e.removeClass("selected"), $(".currencies a[data-currency=" + r + "]").addClass("selected");
    var c = $(".currencies a[data-currency=" + r + "]").html();
    n.html(c), u(Currency.currentCurrency, shopCurrency)
  }  
  e.click(function() {
    e.removeClass("selected"), $(this).addClass("selected");
    var r = $(this).attr("data-currency"),
        c = $(this).html();
    n.html(c), Currency.convertAll(Currency.currentCurrency, r), u(Currency.currentCurrency, shopCurrency);
    $(".pre-currencies").attr("data-currency",r);
  });
  window.selectCallback;

  function u(r, e) {
    $(".selected-currency").text(Currency.currentCurrency), r != e ? ($(".multi-currency-warning").text("*"), $(".multi-currency-warning-bottom").show()) : ($(".multi-currency-warning").text(""), $(".multi-currency-warning-bottom").hide())
  }
  u(Currency.currentCurrency, shopCurrency) 
}

$(document).ready(function() {
  if(template_page != "collection" ) changeCurrentcies();
});

function openUpSellProductGrid(handle){
  $.ajax({
    type: "GET",
    url: '/products/' + handle + '?view=metafield',
    async: !1,
    beforeSend: function() {
      $(".modal-upsale-product").html('');
    },
    complete: function(data) {
      $(".modal-upsale-product").html('');
      $(".modal-upsale-product").html($("#all-product-upsell", data.responseText).html());
      byUpSellGrid();
    },
    error: function(a, b) {
    }
  })
}

function byUpSellGrid(){
  $(".modal-upsale-action").click(function(){
    var arr_group_product = [];
    $(".modal-upsale-product .select_upsell_product").each(function(){
      if($(this)[0]["checked"]){
        arr_group_product.push($(this).val());
      }
    });
    addCartUpSell(arr_group_product,0);
    return false;
  }); 
}

function byUpSellDetail(){
  var arr_group_product = [];
  if($(".js-detail-button").hasClass("upsell_addtocart")){
    $("#by-upsell-detail .select_upsell_product").each(function(){
      if($(this)[0]["checked"]){
        arr_group_product.push($(this).val());
      }
    });
  }
  if($('.js-detail-button').hasClass("groupsell_addtocart")){
    var quantity = parseInt($("input.quantity").val());
    $("#by-group-detail .select_group_product").each(function(){
      if($(this)[0]["checked"]){
        arr_group_product.push($(this).val());
      }
    });
  }
  addCartUpSell(arr_group_product,0);
}

function addCartUpSell(products,countVar){
  if(countVar < products.length){
    var datarespon = jQuery.getJSON(products[countVar], function(response) {
      updatePopupCart(response);
      
      $(".modal-upsale-product .select_upsell_product").each(function(){
        if($(this).is(":checked")){
          $(this).closest('.modal-upsale-product').find(".upsell-status").show();
          $(this).prop('checked', false);
        }
      });
      countVar++
      addCartUpSell(products,countVar);
    });
    
  }else{
    addCartUpSellComplete();
  }
}
function addCartUpSellComplete(){
  jQuery.getJSON('/cart.js', function(response) {
    $("#cartToggle .badge-cart").html(response.item_count);    
//     upSellSlide('.popup-cart-upsell');
  });
  
}

function updatePopupCart(line_item){
  var getsettingCarttype = $('.cart').data('cart-type');
  if (getsettingCarttype == 'top_major') {
    var _parent = $('.site-header').find('.cart_top_dropdown_style_js');
    var _empty_cart = $('.empty-cart-js');
    var _ul = _parent.find('ul:not(.item-html-js)');

  } else if (getsettingCarttype == 'dropdown') {
    var _parent = $('.site-header').find('.cart_dropdown_style_js');
    var _empty_cart = $('.empty-cart-js');
    var _ul = _parent.find('ul:not(.item-html-js)');
  }

  var price_str = Shopify.formatMoney(line_item.price);

  var _ = $('.item-html-js').children().clone();
  _.find('.title').find('a').attr('href', line_item.url).html(line_item.product_title);
  _.find('.price').html(price_str);
  _.find('.qty').find('input').val(line_item.quantity);

  var _img = _.find('.img').find('a');
  _img.attr('href', line_item.url).empty();
  $('<img src=' + line_item.image + ' alt="Cart Image">').appendTo(_img);

  var _details = _.find('.details');
  line_item.variant_title == null ? _details.remove() : _details.html(line_item.variant_title.replace(/ \//g, ', '));

  var delete_btn = _.find('.delete').find('a');
  var delete_url = String(delete_btn.attr('href')).replace('id=0', 'id=' + line_item.id);
  delete_btn.attr('href', delete_url);
  _.find('.edit').find('a').attr('href', line_item.url);

  _ul.find('[href="' + delete_url + '"]').length && _ul.find('[href="' + delete_url + '"]').closest('li').remove();
  $(_).appendTo(_ul);
  !_empty_cart.hasClass('hide') && _empty_cart.addClass('hide');

} 

function productGridAction(){
  $(".grid-view-item .addtocart-item-js").click(function(){
  	openUpSellProductGrid($(this).data("handle"));
  });
}


function upSellSlide (idwrapper){     
  	if($(".modal-upsale-product .popup-cart-upsell").hasClass('slick-initialized')) return;
    var options = {
      slidesToShow: 3,
      slidesToScroll: 3,
      dots: false,
      arrows: true, 
      rtl: checkrtl,  
      responsive: [
        {
          breakpoint: 321,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    };
    $(idwrapper).slick(options);    
}

theme.init = function() {
  theme.customerTemplates.init();
  // Theme-specific selectors to make tables scrollable
  var tableSelectors = '.rte table,' + '.custom__item-inner--html table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'scrollable-wrapper'
  });

  // Theme-specific selectors to make iframes responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"],' +
    '.custom__item-inner--html iframe[src*="youtube.com/embed"],' +
    '.custom__item-inner--html iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'video-wrapper'
  });

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });
  theme.GridOption.init();
  theme.cartStructor.init();
  countdownGrid();
};
$(theme.init);
