let cameraOn = false;
let micOn = true;

function appLoaded() {
  console.log("App carregado (onload)");
}

function hoverCard(card) {
  card.style.transform = "translateY(-5px)";
}

function leaveCard(card) {
  card.style.transform = "translateY(0)";
}

function startCall(name) {
  document.getElementById("callName").innerText =
    "Call with " + name;

  document.getElementById("callModal").style.display = "flex";
}

function endCall() {
  document.getElementById("callModal").style.display = "none";
}

function toggleCamera() {
  cameraOn = !cameraOn;
  updateStatus();
}

function toggleMic() {
  micOn = !micOn;
  updateStatus();
}

function updateStatus() {
  document.getElementById("callStatus").innerText =
    `${cameraOn ? "Camera ligada" : "Camera desligada"} • 
     ${micOn ? "Microfone ligado" : "Microfone desligado"}`;
}
