# jQuery sliding

# About the plugin ?

This plugin is a UI Slide components

# Features

* Pagination
* Ajax request on demand

# Tested

* Firefox 3+ Windows / MAC / Linux
* IE 7+ Windows

# Dependencies
* jquery.scrollTo
* jquery.easing

# Version history

* 1.0
  * slide of simple list
  * ajax sliding
  * custom url formats
  * easing

# In a nutshell:
    <script type="text/javascript" src="jquery.ui.sliding.js"></script>
    <script type="text/javascript">
      $(function(){
          $("#vertical").sliding({
              item: "#horizontal li",
              prev: "#pager button.previous",
              next: "#pager button.next
            });
        });
      </script>

# Options

* items (default: 5)
  The items per page that will be displayed
* item (default: 'li')
  The item that will be the slider
* target (default: false)
  The element target for pagination. When you specify the plugin will create navigation buttons automatically
* next: (default: '.ui-sliding-next-link')
  The element that will be used for next buttom
* prev: (default: '.ui-sliding-prev-link')
  The element that will be used for previous buttom
* disabledClass (default: 'ui-state-disabled')
  The class added when next and previous button are inactive
* url (default: none)
  When you specify a url the plugin will work with ajax
* speed (default: 1000)
  The speed of the page transition
* easing (default: 'easeInOutQuad')
  The easing method for animation
* params
  Extra params to be passed in the ajax request
* beforeRemoteSlide
  A callback to be called before the pagination
* onAppend
  A callback triggered before the content is added, you receive the data returned as parameters and you can modify the content just return new content in this function
* onNextRemote
  A callback to be called when finished the request and when the new page is displayed