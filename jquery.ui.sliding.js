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
    prev: '.ui-sliding-previous-link'
  },
  navClasses : {
    next: 'ui-sliding-next',
    prev: 'ui-sliding-prev'
  },
  _create: function() {

    $(this.element).addClass('ui-widget ui-widget-content ui-corner-all ui-sliding-content');

    this.enclose();

    this.createNav();

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
  goToPage: function(page) {
     var item = $(this.options.item);
     var delta = page*this.options.itens;
     $(this.element).clearQueue('fx').scrollTo(item.eq(delta), 800, {
         onAfter: function(){

         }
     });
  },
  destroy: function() {

  }
});
})(jQuery);