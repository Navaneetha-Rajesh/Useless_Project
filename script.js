const player = document.getElementById('player');
const spellInput = document.getElementById('spellInput');
const feedback = document.getElementById('feedback');
const songs = [
    'assets/audio/hedwig-theme.mp3',
    'assets/audio/hogwarts-ambiance.mp3',
    'assets/audio/heroic-song.mp3'
];
let currentSongIndex = 0;

const spells = {
    'accio': () => {
        currentSongIndex = Math.floor(Math.random() * songs.length);
        player.src = songs[currentSongIndex];
        player.play();
        showFeedback('Summoning music!', 'success');
    },
    'sonorus': () => {
        player.volume = Math.min(player.volume + 0.1, 1);
        showFeedback('Voice amplified!', 'success');
    },
    'quietus': () => {
        player.volume = Math.max(player.volume - 0.1, 0);
        showFeedback('Voice softened!', 'success');
    },
    'avada kedavra': () => {
        player.pause();
        player.currentTime = 0;
        showFeedback('Music has been silenced!', 'error');
    },
    'lumos': () => {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        showFeedback('Light revealed!', 'success');
    },
    'nox': () => {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        showFeedback('Darkness falls!', 'success');
    },
    'alohomora': () => {
        player.src = songs[songs.length - 1]; // Last song as "hidden"
        player.play();
        showFeedback('Secret song unlocked!', 'success');
    },
    'expelliarmus': () => {
        player.pause();
        showFeedback('Music disarmed!', 'success');
    },
    'reducto': () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        player.src = songs[currentSongIndex];
        player.play();
        showFeedback('Blasting to next track!', 'success');
    },
    'muffliato': () => {
        player.muted = !player.muted;
        showFeedback(player.muted ? 'Sound muffled!' : 'Sound restored!', 'success');
    },
    'wingardium leviosa': () => {
        songs.sort(() => Math.random() - 0.5);
        currentSongIndex = 0;
        player.src = songs[currentSongIndex];
        player.play();
        showFeedback('Music is floating!', 'success');
    },
    'expecto patronum': () => {
        player.src = songs[0]; // Special song (e.g., Hedwig’s Theme)
        player.play();
        showFeedback('Patronus summoned!', 'success');
    }
};

function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = type;
}

function castSpell() {
    const spell = spellInput.value.toLowerCase().trim();
    if (spells[spell]) {
        spells[spell]();
    } else {
        showFeedback('Muggle alert! Spell unknown.', 'error');
    }
    spellInput.value = '';
}

// Allow Enter key to cast spell
spellInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') castSpell();
});