## jQuery sliding

### About the plugin ?

This plugin is a slide component developed to attempt complex carousels, that can be smart enough to load dynamic content as needed.

### Documentation and usage

You can see examples at [Sliding Github page](http://alexanmtz.github.com/sliding/ "The github page of usage examples")

You can get reference about documentation at [Sliding Github page docs](http://alexanmtz.github.com/sliding/#docs "The full reference for documentation")

A complete tutorial for examples of use [Creating sliding itens with jQuery Sliding](http://blog.alexandremagno.net/en/2012/06/creating-sliding-itens-with-jquery-sliding/ "A Tutorial from my blog about usage")

Para documentação em português [Criando elementos deslizantes com o jQuery Sliding](blog.alexandremagno.net/2012/06/criando-elementos-deslizantes-com-o-jquery-sliding/ "Um post no blog sobre o uso do jQuery sliding em Português")

### In a nutshell:
    <script type="text/javascript" src="jquery.sliding.js"></script>
    <script type="text/javascript">
      $(function(){
          $("#cool-list").sliding({
			  items: 5,
              item: "li",
              prev: ".previous",
              next: ".next"
            });
        });
      </script>

### Or event:
    <script type="text/javascript" src="jquery.sliding.js"></script>
    <script type="text/javascript">
      $(function(){
          
			  $('element').sliding({
			    items: 4,
			    url: url,
			    urlFormat: '{url}/page/{page}/',
			    next: nextLink,
			    prev: prevLink,
			    disabledClass: 'disabled',
			    speed: 500,
			    onAppend: function(data) {
			       // data is { total_pages: 2, html: 'content' }
			       return data.html;
			    }
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
* 1.8
  * Suport for numbered pagination
* 1.7.1
	* The refresh when setTotalPages broke the method, now fixed
* 1.7.0
	* When setTotalPages is not needed anymore to manually call refresh, it made it internally
	* A new option type to set ajax request type, default is GET
* 1.6.0
  * In progress
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
