//Variables
const musicNotes = document.querySelectorAll('.music-note');
const dropZones = document.querySelectorAll('.dropZone');

let draggableIcon = null;



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

function droppedMusicNote() {
  if (!draggableIcon) return;

  // prevent dropping if zone already has a drag item
  if (this.querySelector('.music-note')) return;

  this.appendChild(draggableIcon);
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