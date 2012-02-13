/**
 *
 * @name jQuery sliding plugin
 * @namespace jQuery
 * @author Alexandre Magno (http://blog.alexandremagno.net)
 * @version 1.4
 * @description jQuery ui slider horizontal or vertical
 * @requires
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 *   jquery.scrollTo
 *   jquery.easing
 */

(function( $, undefined ) {
$.widget( "ui.sliding", {
  options: {
    items: 5,
    item: 'li',
    mode: 'horizontal',
    target: false,
    wrapper: 'ul',
    next: '.ui-sliding-next-link',
    prev: '.ui-sliding-previous-link',
    disabledClass: 'ui-state-disabled',
    url: null,
    speed: 1000,
    easing: 'easeInOutQuad',
    autoHeight: false,
    params: {},
    currentPage: 1,
    onAppend: function(){}
  },
  navClasses : {
    next: 'ui-sliding-next',
    prev: 'ui-sliding-prev'
  },
  uiClasses: 'ui-widget ui-widget-content ui-corner-all ui-sliding-content',
  nextButton: null,
  prevButton: null,
  pages: 0,
  elementDimensions: 0,
  visited: [],
  ignoreCache: false,
  pageClass: "sliding-page-",
  _create: function() {
    var self = this;
    this.currentPage = this.options.currentPage;
    $(this.element).addClass(this.uiClasses);
    this.updateTotalPages();
    this._createNav();
    this._navHandlers();
    this._addPaginationClass();
    this.refresh();
  },
 _setOption: function( key, value ) {
    switch( key ) {
      case "url":
        this.ignoreCache = true;
        break;
    }

    $.Widget.prototype._setOption.apply( this, arguments );
    if (this._super) {
      this._super( "_setOption", key, value );
    }
  },
  _addPaginationClass: function() {
    this._removePaginationClass();

    var pageClass = this.pageClass + this.currentPage;
    var items = $(this.element).find(this.options.item);

    if (items.length > this.options.items) {
      items.slice(0, this.options.items).addClass(pageClass);
    } else {
      items.addClass(pageClass);
    }
  },
  _removePaginationClass: function() {
    var items = $(this.element).find(this.options.item);
    items.removeAttr("class");
  },
  getIgnoreCache: function() {
    return this.ignoreCache;
  },
  getSlidingOffset: function() {
    return parseInt($(this.element).find(this.options.item).eq(0).outerWidth(true)) * (this.options.items)
  },
  enclose: function() {
    this._setContainerSize();
    this._setOverallSize(this.element.find(this.options.item).length);
  },
  _setContainerSize: function() {
    var containerSize = this.getSlidingOffset();
    if (this.options.mode == 'horizontal') {
      $(this.element).css({
        'overflow': 'hidden',
        'width': containerSize
      });
    }
  },
  _setOverallSize: function(items) {
    var overallSize =  parseInt(this.elementDimensions * items);
    $(this.element).children(this.options.wrapper).css({
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
      this.nextButton = $('.' + this.navClasses.next, this.options.target);
      this.prevButton = $('.' + this.navClasses.prev, this.options.target);
    }
    else {
      this.nextButton = $(this.options.next);
      this.prevButton = $(this.options.prev);

      this.nextButton.addClass(self.navClasses.next);
      this.prevButton.addClass(self.navClasses.prev);
    }

  },
  _navHandlers: function() {
    var self = this;
    this._bindNext();
    this._bindPrev();
  },
  _bindNext: function() {
    var self = this;
    self.nextButton.removeClass(this.options.disabledClass);
    self.nextButton.unbind('click.sliding').bind('click.sliding', function(e){
      var nextPage = self.getCurrentPage() + 1;
      self._trigger('navClicked', {target: self.element}, {
        clickedButton: self.nextButton,
        currentPage: nextPage
      });
      self.goToPage(nextPage);
      return false;
    });
  },
  _bindPrev: function() {
    var self = this;
    self.prevButton.removeClass(this.options.disabledClass);
    self.prevButton.unbind('click.sliding').bind('click.sliding', function(e){
      var prevPage = self.getCurrentPage() - 1;
      if (prevPage) {
        self._trigger('navClicked', {target: self.element}, {
          clickedButton: self.prevButton,
          currentPage: prevPage
        });
        self.goToPage(prevPage);
      }
      return false;
    });
  },
  goToPage: function(page) {
     page = parseInt(page, 10);

     var self = this;
     var delta = (page-1)*this.options.items;
     self._setCurrentPage(page);
     var urlFormat = this.getUrlFormat();
     self.disable();

     if (this.options.url && !this.pageCached(page)) {
       self._trigger('before', {target: self.element});
       $.ajax({
         context: self,
         url: urlFormat,
         type: "GET",
         data: this.options.params,
         success: function(data){
           self.ignoreCache = false;
           var content = $(self.options.onAppend.call(self.element, data) || data);
           content.addClass(self.pageClass + page);

           var previousElement = $("."+ self.pageClass + (page + 1), self.element);

           if (previousElement.length > 0) {
             previousElement.before(content);

           } else {
             $(self.element).children(self.options.wrapper).append(content);
           }

           self.makeSlide(delta, page);
           self._trigger('nextRemote',{
             'target': self.element,
           },{
             'data': data
           });
         },
         error: function(x){
           if (window.console) {
             console.debug('ajax error: ', x.statusText);
           }
           else {
             alert('ajax error: ', x.statusText);
           }
         }
       });
     } else {
       var pageClass = self.pageClass + page;

       if ($("." + pageClass, self).length == 0) {
         $(this.element).
            find(this.options.item).
            slice(delta, this.options.items * page).
            addClass(pageClass);
       }

       self.makeSlide(delta, page);
     }
  },
  makeSlide: function(delta, page) {
    var self = this;
    var targetElement = $("." + self.pageClass + page, self.element);

    $(this.element).clearQueue('fx').scrollTo(targetElement, self.options.speed,
      {
        'easing': self.options.easing,
        'onAfter': function(){
          self.refresh();
          if(self.options.autoHeight) {
            self._adjustHeight($(targetElement).height());
          }
          self._trigger('finish', {target: self.element}, {
            'currentElement' : targetElement
          });
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
  pageCached: function(page) {
    return !this.ignoreCache && !!this.element.find("." + this.pageClass + page).length;
  },
  _adjustHeight: function(newHeight) {
    $(this.element).animate({
      'height' : newHeight
    });
    this._trigger('resize', {target: self.element},{
      'newHeight' : newHeight
    });
  },
  refresh: function() {
    var cur = this.getCurrentPage();
    var totalPages = this.getTotalPages();
    if(cur == 1) {
      this._unbindPrev();
      this._bindNext();
    } else if(cur == this.pages) {
      this._unbindNext();
      this._bindPrev();
    } else {
      this._bindPrev();
      this._bindNext();
    }
    if(cur == 1 && totalPages == 1){
      this._unbindNext();
      this._unbindPrev();
    }
  },
  _unbindNext: function() {
    this.nextButton.addClass(this.options.disabledClass);
    this.nextButton.unbind('click.sliding').bind('click.sliding',function(){
      return false;
    });
  },
  _unbindPrev: function() {
    this.prevButton.addClass(this.options.disabledClass);
    this.prevButton.unbind('click.sliding').bind('click.sliding',function(){
      return false;
    });
  },
  restart: function(options) {
    options = options || {};
    this.goToPage(options.page || this.options.currentPage);
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
  updateTotalPages: function() {
    this._removePaginationClass();

    this.elementDimensions = $(this.element).find(this.options.item).eq(0).outerWidth(true);
    this.setTotalPages(Math.ceil($(this.element).find(this.options.item).length/this.options.items));

    this.enclose();
  },
  getTotalPages: function() {
    return this.pages;
  },
  getCurrentPage: function() {
    return this.currentPage;
  },
  isLastPage: function() {
    return this.getCurrentPage() == this.getTotalPages();
  },
  destroy: function() {
    var width = this.originalWidth;
    $(this.element).removeClass(this.uiClasses);
    $(this.element).removeAttr('style');
    $(this.element).children(this.options.wrapper).removeAttr('style');
    this.disable();
    this._setCurrentPage(this.options.currentPage);
    this._removePaginationClass();
    this.setTotalPages(this.options.currentPage);
    this.nextButton.removeClass(this.options.disabledClass);
    this.prevButton.removeClass(this.options.disabledClass);
    if(this.options.target) {
      $(this.options.target).empty();
    }
  },
  disable: function() {
    this._unbindNext();
    this._unbindPrev();
  },
  enable: function() {
    this._bindNext();
    this._bindPrev();
  }
});
})(jQuery);
