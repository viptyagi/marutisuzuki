  document.addEventListener('DOMContentLoaded', function() {
     // Initialize video element and controls
     const video = document.querySelector('video');
     const playPauseButton = document.querySelector('#playPauseButton');
     const muteButton = document.querySelector('#muteButton');
     const fullscreenButton = document.querySelector('#fullscreenButton');
 
     if (!video || !playPauseButton || !muteButton || !fullscreenButton) {
         console.error('Video element or controls not found.');
         return;
     }
 
     // Play/Pause Toggle
     playPauseButton.addEventListener('click', function() {
         if (video.paused) {
             video.play();
             playPauseButton.textContent = 'Pause';
         } else {
             video.pause();
             playPauseButton.textContent = 'Play';
         }
     });
 
     // Mute/Unmute Toggle
     muteButton.addEventListener('click', function() {
         video.muted = !video.muted;
         muteButton.textContent = video.muted ? 'Unmute' : 'Mute';
     });
 
     // Fullscreen Toggle
     fullscreenButton.addEventListener('click', function() {
         if (document.fullscreenElement) {
             document.exitFullscreen();
         } else {
             video.requestFullscreen();
         }
     });
 
     // Event Listeners for Video Status
     video.addEventListener('play', function() {
         console.log('Video is playing');
     });
 
     video.addEventListener('pause', function() {
         console.log('Video is paused');
     });
 
     video.addEventListener('ended', function() {
         console.log('Video has ended');
     });
 
     // Optional: Handle video errors
     video.addEventListener('error', function() {
         console.error('Error occurred while playing video.');
     });
 });
 