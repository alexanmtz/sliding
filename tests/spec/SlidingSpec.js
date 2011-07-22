describe("Sliding", function() {

  beforeEach(function(){
    jQuery.fx.off = true;
  });

  it("should load the instance of the plugin", function() {
    expect($.ui.sliding).toBeTruthy();
  });

  var container = '#sliding-container';

  function createUnorderedList(itens) {
    var ul = $('<ul></ul>');
    var list = '';
    for(var i = 0; i < itens; i++) {
      list += '<li>item</li>';
    }
    $('<ul></ul>').appendTo(container);
    $(list).appendTo($(container).find('ul'));

  };

  beforeEach(function() {
     setFixtures(sandbox({
      'id': 'sliding-container',
      'class' : 'sliding'
     }));
     createUnorderedList(15);
  });

  describe("Sliding plugin horizontal mode", function() {
    beforeEach(function(){
      $('ul li',container).css('width', 100);
    });

    it("should set width based on itens", function(){
      $(container).sliding({
        itens: 3,
        mode: 'horizontal'
      });
      expect($(container).css('overflow')).toBe('hidden');
      expect($(container).css('width')).toBe('300px');
    });

    it("should show only the itens specified", function(){
      $(container).sliding({
        itens: 2
      });
      expect($(container).get(0)).itensInsideContainer(2);
    });

    describe("navigation buttons with the option target", function(){
      beforeEach(function(){
        var nav = $('<div id="nav"></div>');
        nav.insertAfter(container);
        $(container).sliding({
          'target' : '#nav'
        });
      });
      it("should add next button in the target", function(){

        expect($('#nav').get(0)).toContain('a.ui-sliding-next');

      });
      it("shoud add prev button in the target", function(){

        expect($('#nav').get(0)).toContain('a.ui-sliding-prev');

      });
    });
    describe("navigation buttons with the navigation buttons declared", function(){
      beforeEach(function(){
        var nav = $('<div id="nav-next-x"></div><div id="nav-prev-x"></div>');
        nav.insertAfter(container);
      });
      it("should add add button when next is passed", function(){
        $(container).sliding({
          'next' : '#nav-next-x'
        });
        expect($('#nav-next-x').get(0)).toHaveClass('ui-sliding-next');

      });
      it("should add button when next is passed", function(){
        $(container).sliding({
          'prev' : '#nav-prev-x'
        });
        expect($('#nav-prev-x').get(0)).toHaveClass('ui-sliding-prev');
      });
    });
    describe("direct page navigation without handlers", function(){
      beforeEach(function(){
        $(container).sliding();
      });
      it("should go to page 2", function(){
          $(container).sliding('goToPage', 2);
          expect($(container).get(0)).beInRange(5,10);
      });
      it("should return to start page when execute refresh", function(){
          $(container).sliding('goToPage', 2);
          $(container).sliding('refresh');
          expect($(container).get(0)).beInRange(0,5);
      });
      it("should trow a exception when request a non existent page", function(){
        $(container).sliding('goToPage', 20);
        expect($(container).sliding('goToPage')).toThrow(e);
      });
    });
  });

});