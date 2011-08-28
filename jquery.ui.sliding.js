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
    itens: 5,
    item: 'li',
    mode: 'horizontal',
    target: false,
    next: '.ui-sliding-next-link',
    prev: '.ui-sliding-previous-link',
    disabledClass: 'ui-state-disabled',
    url: null,
    totalPages: 0,
    speed: 1000,
    onNextRemote: function(){}
  },
  navClasses : {
    next: 'ui-sliding-next',
    prev: 'ui-sliding-prev'
  },
  navContext : 'body',
  currentPage: 1,
  pages: 0,
  elementDimensions: 0,
  _create: function() {

    $(this.element).addClass('ui-widget ui-widget-content ui-corner-all ui-sliding-content');

    this.elementDimensions = $(this.element).find(this.options.item).eq(0).outerWidth(true);
    this.setTotalPages(Math.ceil($(this.element).find(this.options.item).length/this.options.itens));

    if(this.options.target) {
      this.navContext = this.options.target || 'body';
    }

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
    var containerSize = parseInt($(this.element).find(this.options.item).eq(0).outerWidth(true)) * (this.options.itens);
    if (this.options.mode == 'horizontal') {
      $(this.element).css({
        'overflow': 'hidden',
        'width': containerSize
      });
    }
  },
  _setOverallSize: function(itens) {
    overallSize =  parseInt(this.elementDimensions * itens);
    $(this.element).children().css({
       'width': overallSize
     });
  },
  _createNav: function() {
    var self = this;
    if(this.options.target) {
      $(this.options.target).append($('<a />',{
         'href' : '#',
         'class' : self.navClasses.prev + ' ui-state-default ui-corner-all'
      }).html('<span class="ui-icon ui-icon-carat-1-w">previous</span>'));
      $(this.options.target).append($('<a />',{
         'href' : '#',
         'class' : self.navClasses.next + ' ui-state-default ui-corner-all'
      }).html('<span class="ui-icon ui-icon-carat-1-e">next</span>'));
    } else {
      $(this.options.next).addClass(self.navClasses.next, self.navContext);
      $(this.options.prev).addClass(self.navClasses.prev, self.navContext);
    }

  },
  _navHandlers: function() {
    var self = this;
    $('.' + self.navClasses.next, this.navContext).bind('click.sliding', function(e){
      var nextPage = self.getCurrentPage() + 1;
      self.goToPage(nextPage);
      return false;
    });
    $('.' + self.navClasses.prev, this.navContext).bind('click.sliding', function(e){
      var prevPage = self.getCurrentPage() - 1;
      if (prevPage) {
        self.goToPage(prevPage);
      }
      return false;
    });
  },
  goToPage: function(page) {
     var self = this;
     var delta = (page-1)*this.options.itens;
     if(this.options.url && page > this.getCurrentPage()) {
       $.get(this.options.url, {}, function(data){
          $(self.element).find('ul').append(data);
          self.makeSlide(delta, page);
          self.options.onNextRemote.call(self, data);
       })
     } else {
        self.makeSlide(delta, page);
     }
  },
  makeSlide: function(delta, page) {
    var self = this;
    $(this.element).clearQueue('fx').scrollTo($(self.element).find(self.options.item).eq(delta), this.options.speed, function() {
       self._setCurrentPage(page);
       self.refresh();
     });
  },
  refresh: function() {
    var cur = this.getCurrentPage();
    if(cur == 1) {
      $('.'+this.navClasses.prev, this.navContext).addClass(this.options.disabledClass);
      $('.'+this.navClasses.next, this.navContext).removeClass(this.options.disabledClass);
    }
    else if(cur == this.pages) {
      $('.'+this.navClasses.next, this.navContext).addClass(this.options.disabledClass);
      $('.'+this.navClasses.prev, this.navContext).removeClass(this.options.disabledClass);
    } else {
      $('.'+this.navClasses.next, this.navContext).removeClass(this.options.disabledClass);
      $('.'+this.navClasses.prev, this.navContext).removeClass(this.options.disabledClass);
    }
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
      this._setOverallSize(totalPages*this.options.itens);
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