//Variables
const musicNotes = document.querySelectorAll('.music-note');
const dropZones = document.querySelectorAll('.dropZone');
const reset = document.querySelector('#reset-btn');
let draggableIcon = null;

let audioContext;
let gainNode;

const audioElements = document.querySelectorAll("audio");
const playButton = document.querySelector("#play-btn");
const pauseButton = document.querySelector("#pause-btn");












//Functions
musicNotes.forEach(note => {
    note.dataset.originalParent = note.parentElement.id; // sets the positioning of the parent element for when the drops are reset
});

function dragMusicNote() {
  draggableIcon = this; //Sets draggableIcon to the specific item within the node list that's being dragged 
}

function endDragMusicNote() {
  draggableIcon = null; //returns the draggableIcon variable to null
}

function dragNoteover(e) {
  e.preventDefault(); // required to allow drop
}

//Appends dropped icons to target zone and plays music if music is currently playing 
function droppedMusicNote() {
  if (!draggableIcon) return;

  // prevent dropping if zone already has a drag item
  if (this.querySelector('.music-note')) return;

  this.appendChild(draggableIcon);

  //This allows the audio to auto play if music is already playing
  const audioId = draggableIcon.querySelector('img').dataset.audio;
  const audioEl = document.querySelector(`#${audioId}`);

  if (audioEl && playButton.dataset.playing === "true") {
    audioEl.currentTime = 0;
    audioEl.play();
  }
}


//resets the music icons to their original positions
function resetMusicDrops() {
  musicNotes.forEach(note => {
    const audioId = note.querySelector('img').dataset.audio;
    const audioEl = document.querySelector(`#${audioId}`);

    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }

    const originalParentId = note.dataset.originalParent;
    const originalParent = document.querySelector(`#${originalParentId}`);

    if (originalParent) {
      originalParent.appendChild(note);
    }
  });
}


//Retrieves audios associated with music notes currently in the drop zone
function getActiveAudios() {
  const activeAudios = [];

  dropZones.forEach(zone => {
    const note = zone.querySelector('.music-note');
    if (note) {
      // const audioId = note.dataset.audio;
      const audioId = note.querySelector('img').dataset.audio;
      const audioEl = document.querySelector(`#${audioId}`);
      if (audioEl) activeAudios.push(audioEl);
    }
  });

  return activeAudios;
}


//Play Button
async function handlePlayButtonClick() {
  // Create AudioContext on first user gesture
  if (!audioContext) {
    audioContext = new AudioContext();

    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    // Create a source for EACH audio element
    audioElements.forEach(audio => {
      const track = audioContext.createMediaElementSource(audio);
      track.connect(gainNode);
    });
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  //Play all currently paused audio
  const activeAudios = getActiveAudios();
  activeAudios.forEach(audio => audio.play());
  playButton.dataset.playing = "true";
  
}


//Pause Button
async function handlePauseButtonClick() {
  if (!audioContext) {
    audioContext = new AudioContext();

    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    // Only create sources once at the beginning of playback
    audioElements.forEach(audio => {
      if (!audio._source) {
        audio._source = audioContext.createMediaElementSource(audio);
        audio._source.connect(gainNode);
      }
    });
  }

  // Pause all currently playing audio
  const activeAudios = getActiveAudios();
  activeAudios.forEach(audio => audio.pause());
  playButton.dataset.playing = "false";
}









//Event Listeners
musicNotes.forEach(note => {
  note.addEventListener('dragstart', dragMusicNote);
  note.addEventListener('dragend', endDragMusicNote);
});

dropZones.forEach(zone => {
  zone.addEventListener('dragover', dragNoteover);
  zone.addEventListener('drop', droppedMusicNote);
});

reset.addEventListener('click', resetMusicDrops);

playButton.addEventListener("click", handlePlayButtonClick);

pauseButton.addEventListener('click', handlePauseButtonClick)