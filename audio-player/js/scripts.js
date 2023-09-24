import playList from "./playList.js";

const audio = document.getElementById('audio-track');
const playPauseButton = document.getElementById('playPause');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
const progressBar = document.getElementById('progressBar');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const coverImage = document.getElementById('cover');
const titleDisplay = document.getElementById('title');
const artistDisplay = document.getElementById('artist');
const body = document.querySelector('body');
const volume = document.getElementById('volume');
const soundButton = document.getElementById('sound-button');

let currentTrackIndex = 0;

// загрузка песен
function loadTrack(trackIndex) {
  const track = playList[trackIndex];
  audio.src = track.src;
  coverImage.src = track.cover;
  titleDisplay.textContent = track.title;
  artistDisplay.textContent = track.artist;
  durationDisplay.textContent = track.duration;
  body.style.backgroundImage = `url('${track.cover}')`;
}

loadTrack(currentTrackIndex);

// пауза/начать
function playPause() {
  if (audio.paused) {
    audio.play();
    playPauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <path fill="#C1FF008F" d="M32 0c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zM32 58c-14.359 0-26-11.641-26-26s11.641-26 26-26 26 11.641 26 26-11.641 26-26 26zM20 20h8v24h-8zM36 20h8v24h-8z"></path>
       </svg>`;
  } else {
    audio.pause();
    playPauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <path fill="#C1FF008F" d="M32 0c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zM32 58c-14.359 0-26-11.641-26-26s11.641-26 26-26 26 11.641 26 26-11.641 26-26 26zM24 18l24 14-24 14z"></path>
      </svg>`;
  }
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playList.length;
  loadTrack(currentTrackIndex);
  playPause();
}

function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + playList.length) % playList.length;
  loadTrack(currentTrackIndex);
  playPause();
}

playPauseButton.addEventListener('click', playPause);
nextButton.addEventListener('click', nextTrack);
prevButton.addEventListener('click', prevTrack);

// обновление время песни и положение ползунка
audio.addEventListener('timeupdate', () => {
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  currentTimeDisplay.textContent = formatTime(currentTime);
  if (!audio.paused && duration > 0) {
    progressBar.value = (currentTime / duration) * 100;
  }
  volume.addEventListener('input', () => {
    audio.volume = volume.value;
  });
});

audio.addEventListener('ended', nextTrack);

// форматирование время
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

progressBar.addEventListener('input', () => {
  const duration = audio.duration; // длинна медеа
  audio.currentTime = (progressBar.value / 100) * duration;
});

// Year
const currentYear = new Date().getFullYear();
const yearElement = document.querySelector('.footer__year');
yearElement.textContent = currentYear.toString();

// выключение звука
function toggleMute() {
  if (audio.muted) {
    audio.muted = false;
    soundButton.src = 'assets/images/volume/volume.png';
  } else {
    audio.muted = true;
    soundButton.src = 'assets/images/volume/volume-close.png';
  }
}
soundButton.addEventListener('click', toggleMute);

const soundListButton = document.getElementById('sound-list');
const controlsListTrack = document.querySelector('.controls__list-track');
const playlistContainer = document.querySelector('.playlist-container');

// создание списка песен
function createPlaylist() {
  for (let i = 0; i < playList.length; i++) {
    const song = playList[i];
    const songElement = document.createElement('div');
    songElement.classList.add('song');
    songElement.innerHTML = `
      <img src="${song.cover}" class="song-cover" alt="${song.title} Cover">
      <div class="song-details">
        <p class="song-title">${song.title}</p>
        <p class="song-artist">${song.artist}</p>
      </div>`;

    // событие, когда выбрали песню
    songElement.addEventListener('click', () => {
      loadTrack(i);
      playPause();
      controlsListTrack.style.display = 'none';
    });
    playlistContainer.appendChild(songElement);
  }
  return playlistContainer;
}

// отображения списка по клику
soundListButton.addEventListener('click', () => {
  playlistContainer.innerHTML = '';

  const playlist = createPlaylist();
  controlsListTrack.style.display = 'flex';
  controlsListTrack.appendChild(playlist);

  // если нажмем на область вне списка
  const closePlaylistOnClickOutside = (event) => {
    if (!playlistContainer.contains(event.target) && event.target !== soundListButton) {
      controlsListTrack.style.display = 'none';
    }
  };

  document.addEventListener('click', closePlaylistOnClickOutside);
});