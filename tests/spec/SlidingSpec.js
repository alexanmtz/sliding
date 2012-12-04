describe("Sliding", function() {

  beforeEach(function(){
    jQuery.fx.off = true;
  });

  it("should load the instance of the plugin", function() {
    expect($.ui.sliding).toBeTruthy();
  });

  var container = '#sliding-container';
  var numberOfElements = 15;

  function createUnorderedList(items, toreturn) {
    // Sets the size of each LI
    $(container).append('<style>li { width: 10px; }</style>');

    var ul = $('<ul></ul>');
    var list = '';
    for(var i = 0; i < items; i++) {
      list += '<li class="some-class">item</li>';
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
     createUnorderedList(numberOfElements);
  });

  describe("when creating", function() {
    beforeEach(function() {
      $(container).sliding();
    });

    it("should flag the group as disabled", function() {
      expect($(container).sliding("isGrouped")).toBeFalsy();
    });

    it("should adjust the container size", function() {
      expect( $(container).width() ).toEqual(50);
    });

    it("should adjust the overall size", function() {
      expect( $("ul", container).width() ).toEqual(150);
    });
  });

  describe("enclosing with a specific number of items", function() {
    beforeEach(function() {
      $(container).sliding();
      $(container).sliding("enclose", 30);
    });

    it("should adjust the overall size accordingly", function() {
      expect( $("ul", container).width() ).toEqual(300);
    });
  });
  
  describe("current page", function() {
    describe("with default value", function() {
      beforeEach(function() {
        $(container).sliding();
      });

      it("should be 1 by default", function() {
        var currentPage = $(container).sliding('getCurrentPage');
        expect(currentPage).toBe(1);
      });

      it('should have pageClass based for page 1', function() {
        expect($(".sliding-page-1").length > 0).toBeTruthy();
      });

      it('should keep classes for each item', function() {
        expect($("li", container).hasClass("some-class")).toBeTruthy();
      });
    });

    describe("receiving currentPage 2 on initialization ", function() {
      beforeEach(function() {
        $(container).sliding({currentPage: 2});
      });

      it("should be based on initialization value", function() {
        var currentPage = $(container).sliding('getCurrentPage');
        expect(currentPage).toBe(2);
      });

      it('should have pageClass based on initialization value', function() {
        expect($(".sliding-page-2").length > 0).toBeTruthy();
      });

      describe('when restart', function() {
        it('should keep current page ', function() {
          $(container).sliding('restart');
          var currentPage = $(container).sliding('getCurrentPage');
          expect(currentPage).toBe(2);
        });

        it('should restart to given page ', function() {
          $(container).sliding('restart', {page: 1});
          var currentPage = $(container).sliding('getCurrentPage');
          expect(currentPage).toBe(1);
        });
      });

      describe('when destroy', function() {
        it('should kepp current page', function() {
          $(container).sliding('destroy');
          var currentPage = $(container).sliding('getCurrentPage');
          expect(currentPage).toBe(2);
        });

        it('should set total pages to currentPage', function() {
          $(container).sliding('destroy');
          var totalPages = $(container).sliding('getTotalPages');
          expect(totalPages).toBe(2);
        });
      });
    });
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
    describe("navigation buttons callback", function() {
       var callback, beforeCallback;

       beforeEach(function(){
         navCallback = jasmine.createSpy();
         beforeCallback = jasmine.createSpy();

         var nav = $('<div id="nav"><a class="test-next" href="#">next</a><a class="test-prev" href="#">prev</a></div>');
         nav.insertAfter(container);

         $(container).sliding({
           next: '.test-next',
           prev: '.test-prev',
           navClicked: navCallback,
           before: beforeCallback
         });
      });

      it("should have a successfull clicked callback with next button", function(){
        $('.test-next').trigger('click');
        expect(navCallback).toHaveBeenCalledWith(jasmine.any(Object), {
          clickedButton: $(".test-next"),
          currentPage: 2
        });
      });

      it("should have a successfull clicked callback with prev button", function(){
        $('.test-next').trigger('click');
        $('.test-prev').trigger('click');
        expect(navCallback).toHaveBeenCalledWith(jasmine.any(Object), {
          clickedButton: $(".test-prev"),
          currentPage: 1
        });
      });

      it("should trigger the 'before' callback", function() {
        $('.test-next').trigger('click');
        $('.test-prev').trigger('click');

        expect(beforeCallback.callCount).toBe(2);
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
   describe("Dealing with navigation and paging", function(){
      beforeEach(function() {
        var pager = $('<div class="pager"></div>');
        var nav = $('<div id="nav"><a class="test-next" href="#">next</a><a class="test-prev" href="#">prev</a></div>');
        nav.insertAfter(container);
        pager.insertAfter(container);
        $(container).sliding({
          pager: ".pager",
          pagerActiveClass: "sliding-pager-active",
          next: '.test-next',
          prev: '.test-prev',
          items: 5
        });
      });
      it("should append a list with n itens according with total pages", function(){
        expect($(".pager li").length).toBe(3);
      });
      it("should the first item be one and the last three", function(){
        expect($(".pager li:first a").text()).toBe("1");
        expect($(".pager li:last a").text()).toBe("3");
      });
      it("should add the active class in first page", function(){
        expect($(".pager li:eq(0)").hasClass('sliding-pager-active')).toBe(true);
      });
      it("should add the active class in current page", function(){
        $(container).sliding("goToPage", 2);
        expect($(".pager li:eq(1)").hasClass('sliding-pager-active')).toBe(true);
      });
      it("should go to the desired page when click in navigation buttons", function(){
        // $(".pager li:eq(1)").trigger('click');
        //expect($(".pager li:eq(1)").hasClass('sliding-pager-active')).toBe(true);
      });
    });
    describe("when changing the url", function() {
      beforeEach(function() {
        $(container).sliding();
      });
      it("should avoid the cache", function() {
        expect($(container).sliding("getIgnoreCache")).toBeFalsy();
        $(container).sliding('option', 'url', "new_url");
        expect($(container).sliding("getIgnoreCache")).toBeTruthy();
      });
      describe("and checking if a have cache", function() {
        it("should return false if ignoreCache is true", function() {
          expect($(container).sliding('pageCached', 1)).toBeTruthy();;

          $(container).sliding('option', 'url', "new_url");
          expect($(container).sliding("getIgnoreCache")).toBeTruthy();
          expect($(container).sliding('pageCached', 1)).toBeFalsy();;
        })
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

     it("should set ignoreCache to false", function() {
       $(container).sliding({
         next: '.test-next',
         prev: '.test-prev'
       });
       $(container).sliding('option', 'url', "new_url");
       expect($(container).sliding("getIgnoreCache")).toBeTruthy();

       $('.test-next').trigger('click');
       expect($(container).sliding("getIgnoreCache")).toBeFalsy();
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

      it("should disable navigation buttons", function() {
        $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test',
          items: 15 // one page
        });

        $(container).sliding('setTotalPages', 3);
        $(container).sliding('refresh');

        var slidingInstance = $(container).data("sliding");
        spyOn(slidingInstance, "disable");

        $('.test-next').trigger('click');
        expect(slidingInstance.disable).toHaveBeenCalled();
      });
     it("should have a successfull ajax callback", function(){
       var nextRemoteCallback = jasmine.createSpy();
       var beforeAjaxCallback = jasmine.createSpy();

       var x = $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test',
          items: 15, // one page,
          nextRemote: nextRemoteCallback,
          beforeAjax: beforeAjaxCallback
        });

        $(container).sliding('setTotalPages', 3);
        $(container).sliding('refresh');
        $('.test-next').trigger('click');

        expect(beforeAjaxCallback).toHaveBeenCalled();

        expect(nextRemoteCallback).toHaveBeenCalledWith(jasmine.any(Object), {
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
     it("should trigger the 'beforeSlide' callback", function() {
       var callback = jasmine.createSpy();
        $(container).sliding({
          next: '.test-next',
          prev: '.test-prev',
          url: 'foo/test2',
          beforeSlide: callback,
          items: 15
        });
        $(container).sliding('setTotalPages', 3);
        $(container).sliding('goToPage', 2);
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

  describe("generation of chunks of elements", function() {
    beforeEach(function() {
      $("ul", container).css("float", "left");
      $("ul", container).css("list-style", "none");

      $("li", container).css("float", "left");
      $("li", container).css("width", "30%");
      $("li", container).css("height", "40px");

      $("#sliding-container").css("margin", 0);
      $("#sliding-container").css("padding", 0);

      $(container).sliding({
        item: "li",
        items: 6,
        columns: 3
      });
    });

    it("should flag the group as enabled", function() {
      expect($(container).sliding("isGrouped")).toBeTruthy();
    });

    it("should use the parent to wrap the elements", function() {
      expect($("ul li.sliding-page-container", container).length > 0).toBeTruthy();
      expect($("ul li.sliding-page-container", container).length).toEqual(Math.ceil(numberOfElements/6));
    });

    it("should adjust the height for the number of columns of the row", function() {
      var outerHeight = $(container).find("li").not(".sliding-page-container").eq(0).outerHeight(true);
      var containers = $("ul li.sliding-page-container", container);

      // considering 15 itens, 3 pages
      expect($(containers[0]).height()).toEqual(outerHeight * 2);
      expect($(containers[1]).height()).toEqual(outerHeight * 2);
      expect($(containers[2]).height()).toEqual(outerHeight * 1);
    });

    describe("the regroup of elements", function() {
      beforeEach(function() {
        $(container).sliding("option", "items", 8);
        $(container).sliding("option", "columns", 1);
        $(container).sliding("regroup");
      });

      it("should rewrap the elements", function() {
        expect($("ul li.sliding-page-container", container).length > 0).toBeTruthy();
        expect($("ul li.sliding-page-container", container).length).toEqual(Math.ceil(numberOfElements/8));
      });

      it("should recalculate the height", function() {
        var outerHeight = $(container).find("li").not(".sliding-page-container").eq(0).outerHeight(true);
        var containers = $("ul li.sliding-page-container", container);

        // considering 15 itens, 2 pages
        expect($(containers[0]).height()).toEqual(outerHeight * 8);
        expect($(containers[1]).height()).toEqual(outerHeight * 7);
      });
    });

    describe("the destruction of group", function() {
      beforeEach(function() {
        $(container).sliding("destroyGroup");
      });

      it("should unwrap the elements", function() {
        expect($("ul li.sliding-page-container", container).length).toBe(0);
      });
    });

  });

});
