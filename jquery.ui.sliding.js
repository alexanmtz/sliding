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
    speed: 1000,
    onNextRemote: function(){}
  },
  navClasses : {
    next: 'ui-sliding-next',
    prev: 'ui-sliding-prev'
  },
  navContext : 'body',
  currentPage: 1,
  lastPage: 1,
  itensToFit: 1,
  _create: function() {

    $(this.element).addClass('ui-widget ui-widget-content ui-corner-all ui-sliding-content');
    this.lastPage = Math.ceil($(this.element).find(this.options.item).length/this.options.itens);

    if(this.options.target) {
      this.navContext = this.options.target || 'body';
    }

    this.enclose();
    this.createNav();
    this.refresh();
    this.navHandlers();

  },
  enclose: function() {
    var containerSize = parseInt($(this.element).find(this.options.item).outerWidth(true)) * (this.options.itens);

    var itensAmount = $(this.options.item, this.element).length;

    this.itensToFit = this.options.url ? this.options.itens*2 : itensAmount;

    var overallSize = parseInt($(this.element).find(this.options.item).eq(0).outerWidth(true)) * this.itensToFit;

    if(this.options.mode == 'horizontal') {
     $(this.element).css({
       'overflow': 'hidden',
       'width': containerSize
     });
     $(this.element).children().css({
       'width': overallSize
     });
    }
  },
  createNav: function() {
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
  navHandlers: function() {
    var self = this;
    $('.' + self.navClasses.next, this.navContext).bind('click.sliding', function(e){
      var nextPage = self.getCurrentPage() + 1;
      self._setCurrentPage(nextPage);
      self.goToPage(nextPage);
      return false;
    });
    $('.' + self.navClasses.prev, this.navContext).bind('click.sliding', function(e){
      var prevPage = self.getCurrentPage() - 1;
      if (prevPage) {
        self._setCurrentPage(prevPage);
        self.goToPage(prevPage);
      }
      return false;
    });
  },
  goToPage: function(page) {
     var self = this;
     var delta = (page-1)*this.options.itens;
     var pages = Math.ceil(this.itensToFit/this.options.itens);
     if(this.options.url) {
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
    $(this.element).clearQueue('fx').scrollTo($(self.options.item).eq(delta), this.options.speed, function() {
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
    else if(cur == this.lastPage) {
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
    this.lastPage = totalPages;
  },
  getTotalPages: function() {
    return this.lastPage;
  },
  getCurrentPage: function() {
    return this.currentPage;
  },
  destroy: function() {

  }
});
})(jQuery);