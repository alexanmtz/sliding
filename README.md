## jQuery sliding

### About the plugin ?

This plugin is a slide component developed to attempt complex carousels, that can be smart enough to load dynamic content as needed.

### Documentation and usage

You can see examples at [Sliding Github page](http://alexanmtz.github.com/sliding/ "The github page of usage examples")

You can get reference about documentation at [Sliding Github wiki](https://github.com/alexanmtz/sliding/wiki "The github wiki about the documentation")

### In a nutshell:
    <script type="text/javascript" src="jquery.sliding.js"></script>
    <script type="text/javascript">
      $(function(){
          $("#cool-list").sliding({
              item: "li",
              prev: ".previous",
              next: ".next"
            });
        });
      </script>

### Features

* You can create carousel with simple lists in one line
* Using jQuery UI theme support
* Using the jQuery UI API for tracking events for fully customization
* Request new elements for carousels just when needed, caching the current viewed pages
* Option for auto height adjustment, this way is possible to have different content sizes

### Tested

* Firefox 3+ Windows / MAC / Linux
* IE 7+ Windows
* A complete test suite using [Jasmine](http://pivotal.github.com/jasmine/ "Jasmine - BDD for your javascript")

### Dependencies
* jquery.scrollTo - [Ariel Flesler](http://flesler.blogspot.com/2007/10/jqueryscrollto.html "ScrollTo jQuery plugin")
* jquery.easing - [http://gsgd.co.uk/sandbox/jquery/easing/](http://gsgd.co.uk/sandbox/jquery/easing/ "jQuery easing plugin")

### Authors
* Alexandre Magno ([@alexanmtz](http://www.twitter.com/alexanmtz)) 
* Túlio Ornelas ([@tulios](http://www.twitter.com/tulios))
* Emerson Macedo ([@emerleite](http://www.twitter.com/emerleite))
* Daniel Martins ([@danielfmt](http://www.twitter.com/danielfmt))

### Version history
* 1.5.1
  * Allow to pass a page when restart
* 1.5
  * Support to initalize with current page. The default is 1.
* 1.4
  * Firefox bug when reload the page
* 1.1.1
  * bugfix - making slide for first page when initialize the plugin for browser refresh issues in firefox
* 1.1
  * using the jQuery UI callback standard to use callback as events
* 1.0.2
  * bugfix - the plugin not handle next page when is just one page
* 1.0.1
  * Prevent multiples clicks in navigation to avoid a disorder behavior 
* 1.0.0
  * slide of simple list
  * ajax sliding
  * custom url formats
  * easing
