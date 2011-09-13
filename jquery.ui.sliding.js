/**
 *
 * @name jQuery sliding plugin
 * @namespace jQuery
 * @author Alexandre Magno (http://blog.alexandremagno.net)
 * @version 1.1.1
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
    wrapper: 'ul',
    next: '.ui-sliding-next-link',
    prev: '.ui-sliding-previous-link',
    disabledClass: 'ui-state-disabled',
    url: null,
    speed: 1000,
    easing: 'easeInOutQuad',
    params: {},
    onAppend: function(){}
  },
  navClasses : {
    next: 'ui-sliding-next',
    prev: 'ui-sliding-prev'
  },
  uiClasses: 'ui-widget ui-widget-content ui-corner-all ui-sliding-content',
  nextButton: null,
  prevButton: null,
  currentPage: 1,
  pages: 0,
  elementDimensions: 0,
  visited: [],
  _create: function() {
    var self = this;

    $(this.element).addClass(this.uiClasses);
    this.elementDimensions = $(this.element).find(this.options.item).eq(0).outerWidth(true);
    this.setTotalPages(Math.ceil($(this.element).find(this.options.item).length/this.options.items));

    this.enclose();
    $(this.element).scrollTo(0);
    this._createNav();
    this._navHandlers();
    this.refresh();
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
    overallSize =  parseInt(this.elementDimensions * items);
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
    self.nextButton.unbind('click.sliding').bind('click.sliding', function(e){
      self._unbindNext();
      var nextPage = self.getCurrentPage() + 1;
      self.goToPage(nextPage);
      return false;
    });
  },
  _bindPrev: function() {
    var self = this;
    self.prevButton.unbind('click.sliding').bind('click.sliding', function(e){
      self._unbindNext();
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
     if (this.options.url && !this.pageCached(delta)) {
     self._trigger('before',{
       target: self.element
     });
     $.ajax({
       context: self,
       url: urlFormat,
       type: "GET",
       data: this.options.params,
       success: function(data){
         var content = self.options.onAppend.call(self.element, data[0]) || data;
         $(self.element).children(self.options.wrapper).append(content);
         self.makeSlide(delta, page);
         self._trigger('nextRemote',{
           'target': self.element
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
   }
   else {
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
  pageCached: function(index) {
    return this.element.find(this.options.item).eq(index).length;
  },
  refresh: function() {
    var cur = this.getCurrentPage();
    var totalPages = this.getTotalPages();
    if(cur == 1) {
      this.prevButton.addClass(this.options.disabledClass);
      this.nextButton.removeClass(this.options.disabledClass);
      this._unbindPrev();
      this._bindNext();
    } else if(cur == this.pages) {
      this.nextButton.addClass(this.options.disabledClass);
      this.prevButton.removeClass(this.options.disabledClass);
      this._unbindNext();
      this._bindPrev();
    } else {
      this.nextButton.removeClass(this.options.disabledClass);
      this.prevButton.removeClass(this.options.disabledClass);
      this._bindPrev();
      this._bindNext();
    }
    if(cur == 1 && totalPages == 1){
      this.prevButton.addClass(this.options.disabledClass);
      this.nextButton.addClass(this.options.disabledClass);
      this._unbindNext();
      this._unbindPrev();
    }
  },
  _unbindNext: function() {
     this.nextButton.unbind('click.sliding').bind('click.sliding',function(){
        return false;
     });
  },
  _unbindPrev: function() {
     this.prevButton.unbind('click.sliding').bind('click.sliding',function(){
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
  isLastPage: function() {
    return this.getCurrentPage() == this.getTotalPages();
  },
  destroy: function() {
    var width = this.originalWidth;
    $(this.element).removeClass(this.uiClasses);
    $(this.element).removeAttr('style');
    $(this.element).children(this.options.wrapper).removeAttr('style');
    this.disable();
    this._setCurrentPage(1);
    this.setTotalPages(1);
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