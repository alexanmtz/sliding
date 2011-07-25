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
    speed: 1000
  },
  navClasses : {
    next: 'ui-sliding-next',
    prev: 'ui-sliding-prev'
  },
  currentPage: 1,
  lastPage: 1,
  _create: function() {

    $(this.element).addClass('ui-widget ui-widget-content ui-corner-all ui-sliding-content');
    this.lastPage = Math.ceil($(this.element).find(this.options.item).length/this.options.itens);

    this.enclose();
    this.createNav();
    this.refresh();
    this.navHandlers();

  },
  enclose: function() {
    var containerSize = parseInt($(this.element).find(this.options.item).css('width')) * (this.options.itens);
    var overallSize = parseInt($(this.element).find(this.options.item).css('width')) * ($(this.options.item, this.element).length);

    if(this.options.mode == 'horizontal') {
     $(this.element).find(this.options.item).css('float', 'left');
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
         'class' : self.navClasses.next
      }).text('next'));
      $(this.options.target).append($('<a />',{
         'href' : '#',
         'class' : self.navClasses.prev
      }).text('previous'));
    } else {
      $(this.options.next).addClass(self.navClasses.next);
      $(this.options.prev).addClass(self.navClasses.prev);
    }

  },
  navHandlers: function() {
    var self = this;
    $('.' + self.navClasses.next).bind('click', function(e){
      var nextPage = self.getCurrentPage() + 1;
      self.goToPage(nextPage);
      return false;
    });
  },
  goToPage: function(page) {
     var self = this;
     var item = $(this.options.item);
     var delta = (page-1)*this.options.itens;
     var pages = Math.ceil($(this.element).find(this.options.item).length/this.options.itens);
     $(this.element).clearQueue('fx').scrollTo(item.eq(delta), this.options.speed, function() {
       self.currentPage = page;
       self.refresh();
     });
  },
  refresh: function() {
    var cur = this.getCurrentPage();
    if(cur == 1) {
      $('.'+this.navClasses.prev).addClass(this.options.disabledClass);
      $('.'+this.navClasses.next).removeClass(this.options.disabledClass);
    }
    else if(cur == this.lastPage) {
      $('.'+this.navClasses.next).addClass(this.options.disabledClass);
      $('.'+this.navClasses.prev).removeClass(this.options.disabledClass);
    } else {
      $('.'+this.navClasses.next).removeClass(this.options.disabledClass);
      $('.'+this.navClasses.prev).removeClass(this.options.disabledClas);
    }
  },
  restart: function() {
    this.goToPage(1);
  },
  getCurrentPage: function() {
    return this.currentPage;
  },
  destroy: function() {

  }
});
})(jQuery);