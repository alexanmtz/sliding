# jQuery sliding

# About the plugin ?

This plugin is alternative for slider / carousel plugins out there. The reason that I develop this one is that I was needed a carousel
that could support more complex markup structure inside the carousel container and can be horizontal or vertical, with the flexibility for use on demmand with ajax or with all content already in the markup.

# Features

* Pagination
* Vertical and horizontal orientation
* You can choose the item will be slided into complex markups

# Tested

* Firefox 3+ Windows / MAC / Linux
* IE 7+ Windows

# Development processo

This plugin it's being developed with jQuery-ui and jasmine. I create matchers in jasmine to detect that itens is really inside the container, that's way I know if it really visible.

# Issues

* You must define width (horizontal mode) or height (vertical mode) to the slide calculate where will finish the container. If the itens are variable they still works,
but the itens not exactly will fit at container

* The slide works at itens already loaded, just hidding the subsequent ones. This plugin follow this UI pattern: http://developer.yahoo.com/ypatterns/selection/carousel.html
If you wish to use with ajax for a larg amount of itens, I'm working on that for next releases.

* For horizontal slider, you should use float instead display: inline and not use margin topo or padding top in itens, you could set theses properties on outermost container


# In a nutshell:
  <script type="text/javascript" src="jquery-sliding.js"></script>
  <script type="text/javascript">
     $(function(){
        $("#vertical").sliding({
           mode : "vertical",
            item: "#vertical li",
            prev: "#pager button.previous",
            next: "#pager button.next,
            pager: "#pager"
        });
     });
  </script>
