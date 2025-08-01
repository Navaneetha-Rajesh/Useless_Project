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
  'lumos': { id: '1n8NKQRg8LVHy7oUhUgbFF', name: 'Hedwig\'s Theme', artist: 'John Williams' }
};

let player;
let isPlaying = false;

function initializePlayer(token) {
  console.log('Spotify SDK loaded');
  try {
    player = new Spotify.Player({
      name: 'Harry Potter Spell Player',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5,
      robustnessLevel: 'low'
    });

    player.addListener('ready', ({ device_id }) => {
      console.log('Player ready with Device ID', device_id);
    });

    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
      console.error('Initialization error:', message);
      errorMessage.textContent = 'Failed to initialize Spotify player. Check token.';
      errorMessage.classList.remove('hidden');
    });

    player.addListener('authentication_error', ({ message }) => {
      console.error('Authentication error:', message);
      errorMessage.textContent = 'Spotify authentication failed. Refresh token.';
      errorMessage.classList.remove('hidden');
    });

    player.connect().then(success => {
      if (!success) {
        console.error('Player connection failed');
      }
    });
  } catch (err) {
    console.error('Spotify Player error:', err);
    errorMessage.textContent = 'Error setting up player. Try again.';
    errorMessage.classList.remove('hidden');
  }
}

window.onSpotifyWebPlaybackSDKReady = () => {
  // Wait for user to trigger initialization
};

castButton.addEventListener('click', castSpell);
spellInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') castSpell();
});

playPauseButton.addEventListener('click', () => {
  if (!player) {
    errorMessage.textContent = 'Player not initialized. Authorize Spotify first.';
    errorMessage.classList.remove('hidden');
    return;
  }
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

  if (!player) {
    errorMessage.textContent = 'Player not initialized. Authorize Spotify first.';
    errorMessage.classList.remove('hidden');
    return;
  }

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
      }).then(response => {
        if (!response.ok) {
          console.error('Playback error:', response.statusText);
          errorMessage.textContent = 'Failed to play track. Check token or track ID.';
          errorMessage.classList.remove('hidden');
        } else {
          trackDisplay.classList.remove('hidden');
          albumArt.src = 'https://via.placeholder.com/128'; // Placeholder image
          trackName.textContent = track.name;
          artistName.textContent = track.artist;
          playPauseButton.textContent = 'Pause';
          isPlaying = true;
        }
      }).catch(err => {
        console.error('Fetch error:', err);
        errorMessage.textContent = 'Error playing track. Try again.';
        errorMessage.classList.remove('hidden');
      });
    });
  } else {
    errorMessage.textContent = "You're a Muggle! Try a real spell.";
    errorMessage.classList.remove('hidden');
  }
  spellInput.value = '';
}

function getSpotifyToken() {
  const clientId = '6455bcb71b304be5b096fdba4cca0e96';
  const redirectUri = 'http://127.0.0.1:5500';
  const scopes = 'user-read-playback-state user-modify-playback-state';
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
  window.open(authUrl, '_blank');
}