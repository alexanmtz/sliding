describe("Sliding", function() {

  beforeEach(function(){
    jQuery.fx.off = true;
  });

  it("should load the instance of the plugin", function() {
    expect($.ui.sliding).toBeTruthy();
  });

  var container = '#sliding-container';

  function createUnorderedList(items, toreturn) {
    var ul = $('<ul></ul>');
    var list = '';
    for(var i = 0; i < items; i++) {
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

    it("should set width based on items", function(){
      $(container).sliding({
        items: 3,
        mode: 'horizontal'
      });
      expect($(container).css('overflow')).toBe('hidden');
      expect($(container).css('width')).toBe('300px');
    });

    it("should show only the items specified", function(){
      $(container).find('li').css('float', 'left');
      $(container).sliding({
        items: 2
      });
      expect($(container).get(0)).itemsInsideContainer(2);
    });
    it("should show only the items with margin and padding applied", function(){
       $(container).find('li').css({
         'margin' : '4px',
         'padding' : '10px',
         'float' : 'left',
         'listStyleType' : 'none'
       });
       $(container).sliding({
        items: 2
       });
       expect($(container).get(0)).itemsInsideContainer(2);
    });
    describe("destroy method", function(){
      beforeEach(function(){
       var nav = $('<div id="nav"></div>');
        nav.insertAfter(container);
        $(container).sliding({
          'target' : '#nav'
        });
        $(container).sliding('destroy');
      });
      it("should remove ui classes", function(){
        expect($(container).get(0)).not.toHaveClass('ui-widget');
        expect($(container).get(0)).not.toHaveClass('ui-widget-content');
        expect($(container).get(0)).not.toHaveClass('ui-corner-all');
        expect($(container).get(0)).not.toHaveClass('ui-sliding-content');
      });
      it("should set the container size to initial state", function(){
        var originalWidth = $(container).css('width');
        expect($(container).css('overflow')).not.toBe('hidden');
        expect($(container).css('width')).toBe(originalWidth);
      });
      it("should the content back to original width", function(){
        expect($(container).css('width')).not.toBe('1500px');
      });
      it("should remove disabled classes in the ui", function(){
        expect($('#nav').html()).toBe('');
      });

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
      it("should really disbale next buttom when its last page", function(){
        spyOn($.ui.sliding.prototype, 'goToPage');
        $(container).sliding('goToPage', 3);
        $('.ui-sliding-next').click();
        expect($.ui.sliding.prototype.goToPage.callCount).toBe(2);

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
      newData = '';
      beforeEach(function(){
        var nav = $('<div id="nav"><a class="test-next" href="#">next</a><a class="test-prev" href="#">prev</a></div>');
        nav.insertAfter(container);
        newData = createUnorderedList(30, true);
        spyOn($, 'ajax').andCallFake(function(options){
          options.success(newData);
        });

     });
     it("should set the correct dimensions with the width based on total pages", function() {
        $('ul li',container).css('width', 100);
        $(container).sliding({
          items: 5,
          mode: 'horizontal',
          url: 'foo/example'
        });
        $(container).sliding('setTotalPages', 3);
        expect($(container).css('overflow')).toBe('hidden');
        expect($(container).css('width')).toBe('500px');
        expect($(container).find('ul').css('width')).toBe('1500px');
     });
     it("should set the correct dimensions with last page not complete", function() {
        $('ul li',container).css('width', 100);
        $(container).sliding({
          items: 7,
          mode: 'horizontal',
          url: 'foo/example'
        });
        $(container).sliding('setTotalPages', 3);
        expect($(container).css('overflow')).toBe('hidden');
        expect($(container).css('width')).toBe('700px');
        expect($(container).find('ul').css('width')).toBe('2100px');
     });
     it("should be able to set total pages", function(){
        $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test',
          items: 15 // one page
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
          items: 15 // one page
        });
        $(container).sliding('totalPages', 4);
        expect($('.ui-sliding-next')).not.toHaveClass('ui-state-disabled');
     });
     it("should make a ajax request for second page", function(){
        $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test',
          items: 15 // one page
        });
        $(container).sliding('setTotalPages', 3);
        $(container).sliding('refresh');
        $('.test-next').trigger('click');
        expect($(container).find('li').length).toBe(45);
        expect($(container).get(0)).beInRange(15,30);
     });
     it("should have a successfull ajax callback", function(){
       var callback = jasmine.createSpy();
       $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test',
          items: 15, // one page,
          nextRemote: callback
        });
        $(container).sliding('setTotalPages', 3);
        $(container).sliding('refresh');
        $('.test-next').trigger('click');
        expect(callback).toHaveBeenCalledWith(jasmine.any(Object), {
          data: newData
        });
     });
     it("should not make ajax request when is going to previous page", function(){
       $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test2',
          items: 15
        });
        $(container).sliding('setTotalPages', 3);
        $(container).sliding('goToPage', 2);
        $('.test-prev').trigger('click');
        expect($.ajax.callCount).toEqual(1);
     });
     it("should not make ajax request when is going to previous page and go to next page again", function(){
       $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test2',
          items: 15
        });
        $(container).sliding('setTotalPages', 3);
        $(container).sliding('goToPage', 2);
        $(container).sliding('goToPage', 1);
        $('.test-next').trigger('click');
        expect($.ajax.callCount).toEqual(1);
     });
     it("should call loading callback when request starts", function() {
        var callback = jasmine.createSpy();
        $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test2',
          before: callback,
          items: 15
        });
        $(container).sliding('setTotalPages', 3);
        $(container).sliding('goToPage', 2);
        expect(callback).toHaveBeenCalled();
     });
     it("should call onFinish sliding when slide ends", function(){
        var callback = jasmine.createSpy();
        $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test2',
          finish: callback,
          items: 15
        });
        $(container).sliding('setTotalPages', 3);
        $(container).sliding('goToPage', 2);
        var currentElement = $(container).find('li').eq(16);
        expect(callback).toHaveBeenCalled();
     });
     it("should call create callback", function(){
        var callback = jasmine.createSpy();
        $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test2',
          create: callback,
          items: 15
        });
        $(container).sliding('setTotalPages', 3);
        $(container).sliding('goToPage', 2);
        var currentElement = $(container).find('li').eq(16);
        expect(callback).toHaveBeenCalled();
     });
     it("should pass extra parameters in the request", function(){
       $(container).sliding({
         next: '.test-next',
         prev: '.test-prev',
         url: 'foo/test3',
         items: 15,
         params: {
           'extra' : 'foo'
         }
       });
       $(container).sliding('goToPage', 2);
       expect($.ajax.mostRecentCall.args[0]["data"]).toEqual({'extra':'foo'});
     });
     it("should setup the url format passing the page", function(){
       $(container).sliding({
         next: '.test-next',
         prev: '.test-prev',
         url: 'foo/test',
         urlFormat: '{url}/page/{page}',
         items: 15
       });
       $(container).sliding('goToPage', 2);
       expect($(container).sliding('getUrlFormat')).toEqual('foo/test/page/2');
     });
    });
    describe("differents formats of response in remote sliding in page info came in the response", function(){
       var newData = {};
       beforeEach(function(){
          newData = '';
          var nav = $('<div id="nav"><a class="test-next" href="#">next</a><a class="test-prev" href="#">prev</a></div>');
          nav.insertAfter(container);
          newData = {
            pages: 3,
            content: '<li>jsonitem 04</li><li>jsonitem 05</li><li>jsonitem 06</li>'
          };
          spyOn($, 'ajax').andCallFake(function(options){
            options.success(newData);
          });
       });
       it("should have a callback to modify the response", function(){
         var callback = jasmine.createSpy().andCallFake(function(data){
            return data.content;
         });
         $(container).sliding({
            next: '.test-next',
            prev: '.test-prev',
            url: 'foo/test2',
            onAppend: callback,
            items: 15
          });
          $(container).sliding('setTotalPages', 2);
          $(container).sliding('goToPage', 2);
          expect(callback).toHaveBeenCalledWith(newData);

       });
     });
     describe("Automatic height adjustment", function(){
		it("should adjust to new height when go to last page", function(){
			list_item = $(container).find('li');
			list_item.css('height', 150);
			$(container).find('li:last').css('height', 90);
			$(container).sliding({
				items : 1,
				autoHeight: true
			});
			$(container).sliding('goToPage', 15);
			expect($(container).height()).toEqual(90);
		});
		it("should adjust when go to last page and then adjust again", function(){
			list_item = $(container).find('li');
			list_item.css('height', 150);
			$(container).find('li:last').css('height', 90);
			$(container).sliding({
				items : 1,
				autoHeight: true
			});
			$(container).sliding('goToPage', 15);
			expect($(container).height()).toEqual(90);
			$(container).sliding('goToPage', 14);
			expect($(container).height()).toEqual(150);
		});
		it("should adjust when items is greater than one", function() {
			list_item = $(container).find('li');
			list_item.css('height', 150);
			$(container).find('li:eq(10)').css('height', 90);
			$(container).sliding({
				items : 5,
				autoHeight: true
			});
			$(container).sliding('goToPage', 3);
			expect($(container).height()).toEqual(90);
			$(container).sliding('goToPage', 2);
			expect($(container).height()).toEqual(150);
		});
		it("should call a callback with the height adjusted", function(){
			var callback = jasmine.createSpy();
			list_item = $(container).find('li');
			list_item.css('height', 150);
			$(container).find('li:last').css('height', 90);
			$(container).sliding({
				items : 1,
				autoHeight: true,
				resize: callback
			});
			$(container).sliding('goToPage', 15);
			expect(callback).toHaveBeenCalledWith(jasmine.any(Object),{ 'newHeight' : 90 });
		});
     });

  });

});