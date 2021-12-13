fetch('./js/data.json').then(results => results.json()).then(data => selectSong(data));
let song;
let playStatus = false;
let seek_value = 0;
let playList;
let index = 0;
let songsListUL = document.querySelector('.slides');
const currentPlayTime = document.querySelector(".current-playtime");
const volumeSection = document.querySelector('.volume_section');
const totalPlayTime = document.querySelector(".total-playtime");
const play = document.querySelector(".play");
const currentSongName =   document.querySelector("#current_song_name");
const currentArtistName =   document.querySelector("#current_artist_name");
const currentCoverImage =   document.querySelector("#current_cover_image");
const seekerSlider = document.querySelector(".seeker_slider");
const volume_controller = document.querySelector(".volume_controller");

function selectSong(songsList){
    playList = songsList;
    console.log(songsList);
    index = 0;
    songName = songsList[index].filename;
    song = new Audio("../media/"+songName);
    generatePlayList(songsList);
}

function playSelectedSong(selectedIndex){
    pauseCurrentSong();
    index = selectedIndex;
    song = new Audio("../media/" + playList[index].filename);
    playSong();
}

function generatePlayList(songsList){
    const numberOfListItems =songsList.length;
    for (i = 0; i < numberOfListItems; ++i) {
        document.querySelector('#song'+(i+1)).innerHTML = "<div class='row'>" +
        "<div class='column left'><img class='grid-image' src='./media/grid.png' width='30' height='30'/> "+
        "<img class='album-image' src='"+ songsList[i].path +"' onclick=playSelectedSong("+ (i) + ") width='30' height='30'/>" + 
        "<button id='play_hover' class='fa fa-play-circle fa-3x' onclick=playSelectedSong("+ (i) + ")></button></div>" +
        "<div class='column right'><div class='row'>" +
        "<div class='scolumn sleft'>" + songsList[i].name + 
        "<p id='artist" + (i+1) + "'></p>" +
        "</div><div class='scolumn sright'><small id='duration" + (i+1) + "'> </small>"+
        "</div>";
    }

    for (i = 0; i < numberOfListItems; ++i) {
        document.querySelector('#artist'+(i+1)).textContent = songsList[i].artist;
        document.querySelector('#duration'+(i+1)).textContent = songsList[i].duration;
    }
}

function playOrPause(){
    if(playStatus){
        pauseCurrentSong();
    }
    else{
        playSong();
    }
}

function pauseCurrentSong(){
    song.pause();
    playStatus = false;
    play.innerHTML = '<i class="fa fa-play-circle fa-3x"></i>';
}

function playSong(){
    song.play();
    playStatus = true;
    play.innerHTML = '<i class="fa fa-pause-circle fa-3x"></i>';
    currentSongName.innerHTML = "<h3>" + playList[index].name +"</h3>" ;
    currentArtistName.innerHTML = "<h4>" + playList[index].artist +"</h4>" ;
    currentCoverImage.innerHTML = "<img id='coverimage' src='"+ playList[index].path +"' width='300' height='300'/>" ;
    setTotalDurationOfSong();
    setInterval(updateSeekValue, 1000);
}

function muteOrUnmute(){
    if(song.muted){
        song.muted = false;
        volumeSection.innerHTML = '<i class="fa fa-volume-mute fa-2x"></i>';
    }
    else{
        song.muted = true;
        volumeSection.innerHTML = '<i class="fa fa-volume-up fa-2x"></i>';
    }
}

function updateSeekValue() {
    let seekAtValue = song.currentTime * (200 / song.duration);
    seekerSlider.value = seekAtValue;
    currentPlayTime.textContent = convertValueToTime(seekAtValue);
    console.log(song.currentTime);
    console.log(song.duration);
    console.log(seekAtValue);
    setTotalDurationOfSong();
}

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

function seekAt() {
    let seekAtValue = song.duration * (seekerSlider.value / 100);
    song.currentTime = seekAtValue;
    currentPlayTime.textContent = convertValueToTime(seekAtValue);
}

function setTotalDurationOfSong(){
    let totalDuration = song.duration;
    totalPlayTime.textContent = convertValueToTime(totalDuration);
}

function convertValueToTime(value){
    var minutes = Math.floor(value / 60);
    var seconds = value - minutes * 60;
    return zeroPad(minutes, 2) + " : "+ zeroPad(seconds.toFixed(0), 2);
}

function controlVolume() {
    song.volume = volume_controller.value / 100;
}

const zeroPad = (num, places) => String(num).padStart(places, '0')

$(".slides").sortable({
    placeholder: 'slide-placeholder',
   axis: "y",
   revert: 150,
   start: function(e, ui){
       placeholderHeight = ui.item.outerHeight();
       ui.placeholder.height(placeholderHeight + 15);
       $('<div class="slide-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
   },
   change: function(event, ui) {
       ui.placeholder.stop().height(0).animate({
           height: ui.item.outerHeight() + 15
       }, 300);
       
       placeholderAnimatorHeight = parseInt($(".slide-placeholder-animator").attr("data-height"));
       $(".slide-placeholder-animator").stop().height(placeholderAnimatorHeight + 15).animate({
           height: 0
       }, 300, function() {
           $(this).remove();
           placeholderHeight = ui.item.outerHeight();
           $('<div class="slide-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
       });
   },
   stop: function(e, ui) {
       $(".slide-placeholder-animator").remove();
   },
});