/**
 *
 * @name jQuery sliding plugin
 * @namespace jQuery
 * @author Alexandre Magno (http://blog.alexandremagno.net)
 * @version 0.1
 * @description jQuery ui slider horizontal or vertical
 * @requires
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 *   jquery.scrollTo
 */

(function( $, undefined ) {
$.widget( "ui.sliding", {
  options: {
    items: 5,
    item: 'li',
    mode: 'horizontal',
    target: false,
    next: '.ui-sliding-next-link',
    prev: '.ui-sliding-previous-link',
    disabledClass: 'ui-state-disabled',
    url: null,
    speed: 1000,
    easing: 'easeInOutQuad',
    params: {},
    beforeRemoteSlide: function(){},
    onAppend: function(){},
    onNextRemote: function(){}
  },
  navClasses : {
    next: 'ui-sliding-next',
    prev: 'ui-sliding-prev'
  },
  navElements : {
    next: null,
    prev: null
  },
  currentPage: 1,
  pages: 0,
  elementDimensions: 0,
  visited: [],
  _create: function() {
    var self = this;
    $(this.element).addClass('ui-widget ui-widget-content ui-corner-all ui-sliding-content');

    this.elementDimensions = $(this.element).find(this.options.item).eq(0).outerWidth(true);
    this.setTotalPages(Math.ceil($(this.element).find(this.options.item).length/this.options.items));

    this._enclose();
    this._createNav();
    this.refresh();
    this._navHandlers();

  },
  _enclose: function() {
    this._setContainerSize();
    this._setOverallSize(this.element.find(this.options.item).length);
  },
  _setContainerSize: function() {
    var containerSize = parseInt($(this.element).find(this.options.item).eq(0).outerWidth(true)) * (this.options.items);
    if (this.options.mode == 'horizontal') {
      $(this.element).css({
        'overflow': 'hidden',
        'width': containerSize
      });
    }
  },
  _setOverallSize: function(items) {
    overallSize =  parseInt(this.elementDimensions * items);
    $(this.element).children().css({
       'width': overallSize
     });
  },
  _createNav: function() {
    var self = this;
    if (this.options.target) {
      $(this.options.target).append($('<a />', {
        'href': '#',
        'class': self.navClasses.prev + ' ui-state-default ui-corner-all'
      }).html('<span class="ui-icon ui-icon-carat-1-w">previous</span>'));
      $(this.options.target).append($('<a />', {
        'href': '#',
        'class': self.navClasses.next + ' ui-state-default ui-corner-all'
      }).html('<span class="ui-icon ui-icon-carat-1-e">next</span>'));
      this.navElements.next = $('.' + this.navClasses.next, this.options.target);
      this.navElements.prev = $('.' + this.navClasses.prev, this.options.target);
    }
    else {
      this.navElements.next = $(this.options.next);
      this.navElements.prev = $(this.options.prev);

      $(this.options.next).addClass(self.navClasses.next);
      $(this.options.prev).addClass(self.navClasses.prev);
    }

  },
  _navHandlers: function() {
    var self = this;
    this._bindNext();
    this._bindPrev();
  },
  _bindNext: function() {
    var self = this;
    $(self.navElements.next).unbind('click.sliding').bind('click.sliding', function(e){
      var nextPage = self.getCurrentPage() + 1;
      self.goToPage(nextPage);
      return false;
    });
  },
  _bindPrev: function() {
    var self = this;
    $(self.navElements.prev).unbind('click.sliding').bind('click.sliding', function(e){
      var prevPage = self.getCurrentPage() - 1;
      if (prevPage) {
        self.goToPage(prevPage);
      }
      return false;
    });
  },
  goToPage: function(page) {
     var self = this;
     var delta = (page-1)*this.options.items;
     self._setCurrentPage(page);
     var urlFormat = this.getUrlFormat();
     if(this.options.url && !this.pageCached(delta)) {
       self.options.beforeRemoteSlide.call(self.element);
       $.ajax({
         context: self,
         url: urlFormat,
         type: "GET",
         data: this.options.params,
         success: function(data) {
            var content = self.options.onAppend.call(self.element,data[0]) || data;
            $(self.element).find('ul').append(content);
            self.makeSlide(delta, page);
            self.options.onNextRemote.call(self.element, data);
         },
         error: function(x) {
           if (window.console) {
             console.debug('ajax error: ', x.statusText);
           } else {
             alert('ajax error: ', x.statusText);
           }
         }
       });
     } else {
        self.makeSlide(delta, page);
     }
  },
  makeSlide: function(delta, page) {
    var self = this;
    var targetElement = $(self.element).find(self.options.item).eq(delta);
    $(this.element).clearQueue('fx').scrollTo(targetElement, self.options.speed,
      {
        'easing': self.options.easing,
        'onAfter': function(){
          self.refresh();
        }
      });
  },
  getUrlFormat: function() {
    if(!this.options.urlFormat) {
      return this.options.url;
    } else {
      var urlFormat = this.options.urlFormat;
      var newUrl = urlFormat.replace("{url}", this.options.url);
      newUrl = newUrl.replace("{page}", this.getCurrentPage());
      return newUrl;
    }
  },
  pageCached: function(index) {
    return this.element.find(this.options.item).eq(index).length;
  },
  refresh: function() {
    var cur = this.getCurrentPage();
    if(cur == 1) {
      $(this.navElements.prev).addClass(this.options.disabledClass);
      $(this.navElements.next).removeClass(this.options.disabledClass);
      this._unbindHandler($(this.navElements.prev));
    }
    else if(cur == this.pages) {
      $(this.navElements.next).addClass(this.options.disabledClass);
      $(this.navElements.prev).removeClass(this.options.disabledClass);
      this._unbindHandler($(this.navElements.next));
    } else {
      $(this.navElements.next).removeClass(this.options.disabledClass);
      $(this.navElements.prev).removeClass(this.options.disabledClass);
      this._bindNext();
      this._bindPrev();
    }
  },
  _unbindHandler: function(target) {
     target.unbind('click.sliding').bind('click.sliding',function(){
        return false;
     });
  },
  restart: function() {
    this.goToPage(1);
  },
  _setCurrentPage: function(page) {
    this.currentPage = page;
  },
  setTotalPages: function(totalPages) {
    this.pages = totalPages;
    if(this.options.url) {
      this._setOverallSize(totalPages*this.options.items);
    }
  },
  getTotalPages: function() {
    return this.pages;
  },
  getCurrentPage: function() {
    return this.currentPage;
  },
  destroy: function() {

  }
});
})(jQuery);