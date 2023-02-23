document.addEventListener("DOMContentLoaded", () => {
  if (window.Worker) {
    let dogsWorker = new Worker("dogs.js");
    dogsWorker.onmessage = function (message) {
      const urls = message.data;
      for (let i = 0; i < urls.length; i++) {
        document.getElementById(`dog-${i + 1}`).src = urls[i];
      }
      dogsWorker.terminate();
    };
  } else {
    console.log('Your browser doesn\'t support web workers.');
  }
});