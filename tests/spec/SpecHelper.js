beforeEach(function() {
  this.addMatchers({
    toBePlaying: function(expectedSong) {
      var player = this.actual;
      return player.currentlyPlayingSong === expectedSong
          && player.isPlaying;
    }
  });
  this.addMatchers({
    toBeReallyVisible: function(amount) {
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
    }
  })
});
