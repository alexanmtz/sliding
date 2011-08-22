describe("Sliding", function() {

  beforeEach(function(){
    jQuery.fx.off = true;
  });

  it("should load the instance of the plugin", function() {
    expect($.ui.sliding).toBeTruthy();
  });

  var container = '#sliding-container';

  function createUnorderedList(itens, toreturn) {
    var ul = $('<ul></ul>');
    var list = '';
    for(var i = 0; i < itens; i++) {
      list += '<li>item</li>';
    }
    if(!$(container).find('ul').length) {
      $('<ul></ul>').appendTo(container);
    }
    if(toreturn) {
      return list;
    } else {
      $(list).appendTo($(container).find('ul'));
    }

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
    it("should show only the itens with margin and padding applied", function(){
       $(container).find('li').css({
         'margin' : '4px',
         'padding' : '10px'
       })
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
      it("should add button when prev and next is passed", function(){
        $(container).sliding({
          'prev' : '#nav-prev-x',
          'next' : '#nav-next-x'
        });
        expect($('#nav-prev-x').get(0)).toHaveClass('ui-sliding-prev');
        expect($('#nav-next-x').get(0)).toHaveClass('ui-sliding-next');
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
      it("should return to start page when execute restart", function(){
          $(container).sliding('goToPage', 2);
          $(container).sliding('restart');
          expect($(container).get(0)).beInRange(0,5);
      });
      it("should get the currentPage", function(){
        $(container).sliding('goToPage', 2);
        var currentPage = $(container).sliding('getCurrentPage');
        expect(currentPage).toBe(2);
      });
    });
    describe("next e previous page disable handler",function(){
      beforeEach(function(){
        var nav = $('<div id="nav"></div>');
        nav.insertAfter(container);
        $(container).sliding({
          target: '#nav'
        });
      });
      it("should the first page should have previous button disabled",function(){
        expect($('.ui-sliding-prev').get(0)).toHaveClass('ui-state-disabled');
        expect($('.ui-sliding-next').get(0)).not.toHaveClass('ui-state-disabled');
      });
      it("should go to last page should have next button disabled", function(){
        $(container).sliding('goToPage', 3);
        expect($('.ui-sliding-next').get(0)).toHaveClass('ui-state-disabled');
        expect($('.ui-sliding-prev').get(0)).not.toHaveClass('ui-state-disabled');
      });
      it("should go to a middle page the prev and next should be enabled", function(){
        $(container).sliding('goToPage', 2);
        expect($('.ui-sliding-prev').get(0)).not.toHaveClass('ui-state-disabled');
        expect($('.ui-sliding-next').get(0)).not.toHaveClass('ui-state-disabled');
      });
    });
    describe("interact with the navigation buttons", function(){
       beforeEach(function(){
        var nav = $('<div id="nav"><a class="test-next" href="#">next</a><a class="test-prev" href="#">prev</a></div>');
        nav.insertAfter(container);
        $(container).sliding({
          next: '.test-next',
          prev: '.test-prev'
        });
       });
       it("should go to second page when click next", function(){
         $('.test-next').trigger('click');
         var currentPage = $(container).sliding('getCurrentPage');
         expect(currentPage).toBe(2);
       });
       it("should go to previous page", function(){
         $(container).sliding('goToPage', 3);
         $('.test-prev').trigger('click');
         var currentPage = $(container).sliding('getCurrentPage');
         expect(currentPage).toBe(2);
       });
       it("should go to previous page and disabling prev when is the first page", function(){
         $(container).sliding('goToPage', 2);
         $('.test-prev').trigger('click');
         var currentPage = $(container).sliding('getCurrentPage');
         expect(currentPage).toBe(1);
       });
    });
    describe("remote sliding", function(){
      beforeEach(function(){
        var nav = $('<div id="nav"><a class="test-next" href="#">next</a><a class="test-prev" href="#">prev</a></div>');
        nav.insertAfter(container);

     });
     it("should be able to set total pages", function(){
        $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test',
          itens: 15 // one page
        });
        $(container).sliding('setTotalPages', 10);
        var totalPages = $(container).sliding('getTotalPages');
        expect($(container).sliding('getTotalPages')).toBe(10);
     });
     it("should next button be available when total pages it's greater than one ", function(){
        $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test',
          itens: 15 // one page
        });
        $(container).sliding('totalPages', 4);
        expect($('.ui-sliding-next')).not.toHaveClass('ui-state-disabled');
     });
     it("should make a ajax request for second page", function(){
        var newData = createUnorderedList(30, true);
        spyOn($, 'ajax').andCallFake(function(options){
          options.success(newData);
        });
        $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test',
          itens: 15 // one page
        });
        $(container).sliding('setTotalPages', 3);
        $('.test-next').trigger('click');
        expect($(container).find('li').length).toBe(45);
        expect($(container).get(0)).beInRange(15,30);
     });
    });
  });

});