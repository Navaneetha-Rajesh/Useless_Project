// Get DOM elements for audio player, input, and feedback
const player = document.getElementById('player');
const spellInput = document.getElementById('spellInput');
const feedback = document.getElementById('feedback');

// Audio files array (Note: .mp4 may not work; use .mp3 for browser compatibility)
const songs = [
    'assets/audio/hedwig.mp4',
    'assets/audio/march.mp4',
    'assets/audio/quiditch.mp4'
];
let currentSongIndex = 0;

// Spell actions object
const spells = {
    'accio': () => {
        currentSongIndex = Math.floor(Math.random() * songs.length);
        player.src = songs[currentSongIndex];
        player.play();
        showFeedback('Summoning music!', 'success');
    },
    'sonorus': () => {
        player.volume = Math.min(player.volume + 0.2, 1); // Increase volume by 20%
        showFeedback('Voice amplified!', 'success');
    },
    'quietus': () => {
        player.volume = Math.max(player.volume - 0.2, 0); // Decrease volume by 20%
        showFeedback('Voice softened!', 'success');
    },
    'avada kedavra': () => {
        player.pause();
        player.currentTime = 0; // Reset to start
        showFeedback('Music has been silenced!', 'error');
    },
    'lumos': () => {
        changeTheme('light-theme', 'Light revealed!'); // Switch to light theme
    },
    'nox': () => {
        changeTheme('dark-theme', 'Darkness falls!'); // Switch to dark theme
    },
    'alohomora': () => {
        player.src = songs[songs.length - 1]; // Play last song as "hidden"
        player.play();
        showFeedback('Secret song unlocked!', 'success');
    },
    'expelliarmus': () => {
        player.pause();
        showFeedback('Music disarmed!', 'success');
    },
    'reducto': () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length; // Next song
        player.src = songs[currentSongIndex];
        player.play();
        showFeedback('Blasting to next track!', 'success');
    },
    'muffliato': () => {
        player.muted = !player.muted; // Toggle mute
        showFeedback(player.muted ? 'Sound muffled!' : 'Sound restored!', 'success');
    },
    'wingardium leviosa': () => {
        songs.sort(() => Math.random() - 0.5); // Shuffle songs
        currentSongIndex = 0;
        player.src = songs[currentSongIndex];
        player.play();
        showFeedback('Music is floating!', 'success');
    },
    'expecto patronum': () => {
        player.src = songs[0]; // Play first song (special)
        player.play();
        showFeedback('Patronus summoned!', 'success');
    }
};

// Handle theme transitions with fade effect
function changeTheme(themeClass, message) {
    document.body.classList.add('fade-out');
    setTimeout(() => {
        document.body.classList.remove('light-theme', 'dark-theme', 'fade-out');
        document.body.classList.add(themeClass, 'fade-in');
        showFeedback(message, 'success');
    }, 500); // Match CSS transition duration
}

// Display feedback message with success/error styling
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = type;
}

// Cast spell based on input
function castSpell() {
    const spell = spellInput.value.toLowerCase().trim();
    if (spells[spell]) {
        spells[spell]();
    } else {
        showFeedback('Muggle alert! Spell unknown.', 'error');
    }
    spellInput.value = '';
}

// Trigger castSpell on Enter key
spellInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') castSpell();
});

// Auto-focus input on page load
spellInput.focus();