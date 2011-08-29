beforeEach(function() {
  this.addMatchers({
    toBePlaying: function(expectedSong) {
      var player = this.actual;
      return player.currentlyPlayingSong === expectedSong
          && player.isPlaying;
    }
  });
  this.addMatchers({
    itemsInsideContainer: function(amount) {
        var isIn = 0;
        var current_width = $(this.actual).width();
        var container_pos = $(this.actual).position();
        var final_pos = current_width + container_pos.left;
        $(this.actual).find('li').each(function(i, el){
            var el_pos = $(this).position();
            if (el_pos.left < final_pos) {
                isIn++;
            }
        });
        return isIn == amount;
    },
    beInRange: function(start, end) {
      var isIn = 0;
        var current_width = $(this.actual).width();
        var container_pos = $(this.actual).position();
        var final_pos = current_width + container_pos.left;
        $(this.actual).find('li').slice(start, end).each(function(i, el){
            var el_pos = $(this).position();
            if (el_pos.left < final_pos && el_pos.left >= container_pos.left) {
                isIn++;
            }
        });
        return isIn == $(this.actual).sliding('option','items');
    }
  });
});
