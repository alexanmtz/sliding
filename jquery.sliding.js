/**
 *
 * @name jQuery sliding plugin
 * @namespace jQuery
 * @author Alexandre Magno, Túlio Ornelas, Daniel Fernandes and Emerson Macedo (http://blog.alexandremagno.net)
 * @version 1.9.1
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
    columns: null,
    item: 'li',
    mode: 'horizontal',
    target: false,
    wrapper: 'ul',
    next: '.ui-sliding-next-link',
    prev: '.ui-sliding-previous-link',
    disabledClass: 'ui-state-disabled',
    url: null,
    type: "GET",
    speed: 1000,
    easing: 'easeInOutQuad',
    autoHeight: false,
    params: {},
    currentPage: 1,
    pager: false,
    pagerActiveClass: "sliding-pager-active",
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
  groupElements: false,
  pageClassTemplate: "sliding-page",
  pageClass: "sliding-page-",
  pageContainerClass: "sliding-page-container",
  _create: function() {
    var self = this;
    var groupElements = false;

    if (!this.options.columns) {
      this.options.columns = this.options.items;
    } else {
      groupElements = true
    }

    this.currentPage = this.options.currentPage;
    $(this.element).addClass(this.uiClasses);

    this._addPaginationClass();
    this._createNav();
    this.updateTotalPages();
    this._navHandlers();

    if (groupElements) {
      this._slicePages();
    }
    
    if(this.options.pager) {
      this.createPager();
    }

    this.refresh();
  },
  _setOption: function( key, value ) {
    switch( key ) {
      case "url":
        this.setIgnoreCache(true);
        break;
    }

    $.Widget.prototype._setOption.apply( this, arguments );
    if (this._super) {
      this._super( "_setOption", key, value );
    }
  },
  _removeAttrs: function(element, regex) {
    var self = $(element);
    $.each(self[0].attributes, function(i, attr) {
      if (attr && attr.specified && regex.test(attr.name)) {
        self.removeAttr(attr.name);
      }
    });
  },
  _slicePages: function() {
    this.groupElements = true;
    var items = $(this.element).find(this.options.item);
    var item = $(items[0]);

    var parentTemplate = item.parent().clone();
    parentTemplate.html("");
    parentTemplate.removeAttr("style");
    parentTemplate.removeAttr("class");
    this._removeAttrs(parentTemplate, /^data-*/);

    var itemTemplate = item.clone();
    itemTemplate.html("");
    itemTemplate.removeAttr("style");
    itemTemplate.removeAttr("class");
    itemTemplate.addClass(this.pageContainerClass);
    this._removeAttrs(itemTemplate, /^data-*/);
    itemTemplate.width(this.element.width());

    var totalPages = Math.ceil(items.length/this.options.items);

    var index = 0;
    for(var i = 0; i < totalPages; i++) {
      var selectedItens = items.slice(index, this.options.items + index);
      var itemWrapper = itemTemplate.clone();
      var outer = parseInt(selectedItens.outerHeight(true), 10);

      itemWrapper.height(
        Math.ceil(selectedItens.length/this.options.columns) * outer
      );

      selectedItens.wrapAll(itemWrapper.append(parentTemplate.clone()));
      index += this.options.items;
    }
  },
  _removeSlices: function() {
    if (this.isGrouped()) {
      $(this.element).
        find(this.options.item).
        not("." + this.pageContainerClass).
        unwrap().
        unwrap();
    }

    this.groupElements = false;
  },
  _getPageClass: function(index) {
    if (!index) {
      index = this.getCurrentPage();
    }
    return this.pageClass + index;
  },
  _addPaginationClass: function() {
    var pageClass = this._getPageClass();
    var items = $(this.element).
      find(this.options.item).
      not("." + this.pageContainerClass);

    if (items.length > this.options.items) {
      items.slice(0, this.options.items).
      addClass(this.pageClassTemplate + " " + pageClass);

    } else {
      items.addClass(this.pageClassTemplate + " " + pageClass);
    }
  },
  _removePaginationClass: function() {
    $(this.element).find(this.options.item).removeClass(this.pageClassTemplate);

    for (var i = 0; i < this.pages; i++) {
      var pageClass = this._getPageClass(i + 1);
      $(this.element).find(this.options.item).removeClass(pageClass);
    }
  },
  getIgnoreCache: function() {
    return this.ignoreCache;
  },
  getSlidingOffset: function() {
    var outer = $(this.element).
      find(this.options.item).
      not("." + this.pageContainerClass).
      eq(0).
      outerWidth(true);

    return parseInt(outer, 10) * (this.options.columns)
  },
  getSlidingHeightOffset: function() {
    var outer = $(this.element).
      find(this.options.item).
      not("." + this.pageContainerClass).
      eq(0).
      outerHeight(true);

    var items = $("." + this._getPageClass(), this.element);
    return parseInt(outer, 10) * (Math.ceil(items.length/this.options.columns))
  },
  enclose: function(items) {
    if (!items) {
      items = this.element.find(this.options.item).not("." + this.pageContainerClass).length;
    }

    this._setContainerSize();
    this._setOverallSize(items);
  },
  _setContainerSize: function() {
    var containerWidth = this.getSlidingOffset();
    var containerHeight = this.getSlidingHeightOffset();

    if (this.options.mode == 'horizontal') {
      $(this.element).css({
        'overflow': 'hidden',
        'width': containerWidth,
        'height': containerHeight
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

     self._trigger('before', {target: self.element});

     if (this.options.url && !this.pageCached(page)) {
       self._trigger('beforeAjax', {target: self.element});

       $.ajax({
         context: self,
         url: urlFormat,
         type: this.options.type,
         data: this.options.params,
         success: function(data){
           self.setIgnoreCache(false);
           var content = $(self.options.onAppend.call(self.element, data) || data);
           content.addClass(self.pageClass + page);

           var previousElement = $("."+ self.pageClass + (page + 1), self.element);

           if (previousElement.length > 0) {
             previousElement.before(content);

           } else {
             $(self.element).children(self.options.wrapper).append(content);
           }

           self.makeSlide(page);
           self._trigger('nextRemote', {'target': self.element}, {'data': data});
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
       var pageClass = this._getPageClass(page);

       if ($("." + pageClass, self.element).length == 0) {
         self.getItems(page).addClass(self.pageClassTemplate + " " + pageClass);
       }

       self.makeSlide(page);
     }
  },
  createPager: function() {
    $('.sliding-pager').remove();
    $('<ul class="sliding-pager"></ul>').appendTo(this.options.pager);
    var pages = this._generatePageList();
    $(this.options.pager).find('ul').append(pages);
    this.updatePagerIndex(this.getCurrentPage());
    this._delegatePagination(".sliding-pager");
  },
  _generatePageList: function() {
    var markupList = "";
    for(var i=1; i <= this.getTotalPages(); i++) {
      markupList += '<li><a href="#"><span>' + i + '</span></a>';
    }
    return markupList;
  },
  _delegatePagination: function(target) {
    var self = this;
    $(target).delegate("li a", "click",function(e){
      var page = parseInt($(e.target).text());
      self.goToPage(page);
      return false;
    });
  },
  updatePagerIndex: function(page) {
    $(this.options.pager).find("ul li").removeClass("sliding-pager-active").filter(':eq(' + (page - 1) + ')').addClass("sliding-pager-active");
  },
  makeSlide: function(page, options) {
    var self = this;
    var targetElement = $("." + this._getPageClass(page), self.element);

    var triggerEvent = function(evt) {
      self._trigger(evt, {target: self.element}, {
        'currentElement' : targetElement
      });
    };

    var animate = (options == undefined || options.animate == undefined) ? true : options.animate;
    var speed = animate ? self.options.speed : 0;
    var opts = {
      'easing': self.options.easing,
      'onAfter': function(){
        self.refresh();
        if(self.options.autoHeight) {
          var outer = parseInt(targetElement.outerHeight(true), 10);
          var targetHeight = Math.ceil(targetElement.length/self.options.columns) * outer;
          self._adjustHeight(targetHeight);
        }
        triggerEvent('finish');
      }
    }

    triggerEvent('beforeSlide');
    $(this.element).clearQueue('fx').scrollTo(targetElement, speed, opts);
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
  getItems: function(page) {
    var items = $(this.element).find(this.options.item).not("." + this.pageContainerClass);
    var start = this.options.items * (page - 1);

    return items.slice(start, start + this.options.items);
  },
  pageCached: function(page) {
    return !this.getIgnoreCache() && !!this.element.find("." + this._getPageClass(page)).length;
  },
  setIgnoreCache: function(ignoreCache) {
    this.ignoreCache = ignoreCache;
  },
  getIgnoreCache: function() {
    return this.ignoreCache;
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
    if(this.options.pager) {
      this.createPager();
      this.updatePagerIndex(cur);
    }
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
    this._removePaginationClass();
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
    this.refresh();
  },
  updateTotalPages: function() {
    this._removePaginationClass();
    this.elementDimensions = $(this.element).
      find(this.options.item).
      not("." + this.pageContainerClass).
      eq(0).
      outerWidth(true);

    var elementsLength = $(this.element).
      find(this.options.item).
      not("." + this.pageContainerClass).
      length;

    this.setTotalPages(Math.ceil(elementsLength/this.options.items));
    this._addPaginationClass();

    this.enclose();
  },
  isGrouped: function() {
    return this.groupElements;
  },
  destroyGroup: function() {
    this._removeSlices();
  },
  regroup: function() {
    this.updateTotalPages();
    this._removeSlices();
    this.enclose();
    this._slicePages();
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