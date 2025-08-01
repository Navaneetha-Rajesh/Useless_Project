const spellInput = document.getElementById('spellInput');
const castButton = document.getElementById('castButton');
const trackDisplay = document.getElementById('trackDisplay');
const albumArt = document.getElementById('albumArt');
const trackName = document.getElementById('trackName');
const artistName = document.getElementById('artistName');
const playPauseButton = document.getElementById('playPauseButton');
const errorMessage = document.getElementById('errorMessage');

// Map spells to Spotify track IDs (replace with real IDs)
const spellTracks = {
  'lumos': { id: '3KkXRkHbMCARz0aVfEt68P', name: 'Hedwig\'s Theme', artist: 'John Williams' },
  'expecto patronum': { id: '5zGZK3qRPL9hTIF6JHzDPb', name: 'Battle of Hogwarts', artist: 'Alexandre Desplat' },
  'wingardium leviosa': { id: '4qZxNAL07rZ9b3lU3q9N0m', name: 'Leaving Hogwarts', artist: 'John Williams' },
  'expelliarmus': { id: '2W3Y3rZf5fV4r2g3q1bW2X', name: 'Duel of the Fates', artist: 'John Williams' },
  'alohomora': { id: '6X5fY3nZ3Y3v5f5Y3nZ3Y', name: 'The Chamber of Secrets', artist: 'John Williams' }
};

let player;
let isPlaying = false;

window.onSpotifyWebPlaybackSDKReady = () => {
  const token = 'YOUR_ACCESS_TOKEN'; // Get from Spotify auth (see below)
  player = new Spotify.Player({
    name: 'Harry Potter Spell Player',
    getOAuthToken: cb => { cb(token); },
    volume: 0.5
  });

  player.addListener('ready', ({ device_id }) => {
    console.log('Player ready with Device ID', device_id);
  });

  player.connect();
};

castButton.addEventListener('click', castSpell);
spellInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') castSpell();
});

playPauseButton.addEventListener('click', () => {
  if (isPlaying) {
    player.pause();
    playPauseButton.textContent = 'Play';
  } else {
    player.resume();
    playPauseButton.textContent = 'Pause';
  }
  isPlaying = !isPlaying;
});

function castSpell() {
  const spell = spellInput.value.toLowerCase().trim();
  errorMessage.classList.add('hidden');
  trackDisplay.classList.add('hidden');

  if (spellTracks[spell]) {
    const track = spellTracks[spell];
    player._options.getOAuthToken(token => {
      fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [`spotify:track:${track.id}`] }),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    });
    trackDisplay.classList.remove('hidden');
    albumArt.src = `https://i.scdn.co/image/ab67616d0000b273${track.id}`; // Placeholder, update with real image
    trackName.textContent = track.name;
    artistName.textContent = track.artist;
    playPauseButton.textContent = 'Pause';
    isPlaying = true;
  } else {
    errorMessage.classList.remove('hidden');
  }
  spellInput.value = '';
}

// Simplified auth (run separately to get token)
function getSpotifyToken() {
  const clientId = '6455bcb71b304be5b096fdba4cca0e96';
  const redirectUri = 'http://127.0.0.1:5500';
  const scopes = 'user-read-playback-state user-modify-playback-state';
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
  window.location = authUrl;
}