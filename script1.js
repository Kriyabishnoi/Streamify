const videobtn = document.querySelector("#videobtn");
const videoInput = document.querySelector("#videoInput");
const videoPlayer = document.querySelector("#main");
const speedUp = document.querySelector("#speedUp");
const speedDown = document.querySelector("#speedDown");
const volumeUp = document.querySelector("#volumeUp");
const volumeDown = document.querySelector("#volumeDown");
const toast = document.querySelector(".toast");
const fast = document.querySelector("#Fast");
const slow = document.querySelector("#Slow");
const playButton = document.getElementById('plays');
const pauseButton = document.getElementById('pause');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progress');
const progressHandle = document.getElementById('progressHandle');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const fullScreen=document.querySelector("#Full");
const handleInput = () => { 
    videoInput.click();
}

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const acceptInputHandler = (obj) => {
    const selectedVideo = obj.target.files[0];
    const link = URL.createObjectURL(selectedVideo);
    const videoElement = document.createElement("video");
    videoElement.src = link;
    videoElement.setAttribute("class", "video");
    videoPlayer.appendChild(videoElement);

    videoElement.volume = 0.3;

    videoElement.addEventListener('timeupdate', () => {
        updateProgressBar(videoElement);
        updateTimer(videoElement);
    });

    videoElement.addEventListener('loadedmetadata', () => {
        updateProgressBar(videoElement);
        updateTimer(videoElement);
    });
}

videobtn.addEventListener("click", handleInput);
videoInput.addEventListener("change", acceptInputHandler);

const speedUpHandler = () => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        if (videoElement.playbackRate > 3) return;
        videoElement.playbackRate += 0.5;
        showtoast(`${videoElement.playbackRate}x`);
    }
}

const speedDownHandler = () => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        if (videoElement.playbackRate <= 0.5) return;
        videoElement.playbackRate -= 0.5;
        showtoast(`${videoElement.playbackRate}x`);
    }
}

const volumeUpHandler = () => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        if (videoElement.volume >= 0.99) return;
        videoElement.volume += 0.1;
        showtoast(`${Math.round(videoElement.volume * 100)}%`);
    }
}

const volumeDownHandler = () => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        if (videoElement.volume <= 0.1) {
            videoElement.volume = 0;
        } else {
            videoElement.volume -= 0.1;
        }
        showtoast(`${Math.round(videoElement.volume * 100)}%`);
    }
}

const showtoast = (message) => {
    console.log("Toast Message:", message); // Debugging line
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 1000);
};


const fullScreenHandler = () => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        videoElement.requestFullscreen();
    }
}

const updateProgressBar = (videoElement) => {
    if (videoElement) {
        const percentage = (videoElement.currentTime / videoElement.duration) * 100;
        progressBar.style.width = `${percentage}%`;
        progressHandle.style.left = `${percentage}%`;
    }
}

const updateTimer = (videoElement) => {
    if (videoElement) {
        currentTimeDisplay.textContent = formatTime(videoElement.currentTime);
        durationDisplay.textContent = formatTime(videoElement.duration);
    }
}

const seekTo = (event, videoElement) => {
    if (videoElement) {
        const rect = progressContainer.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(1, offsetX / width)); // Ensure percentage is between 0 and 1
        videoElement.currentTime = percentage * videoElement.duration;
        updateProgressBar(videoElement);
        updateTimer(videoElement);
    }
}

progressContainer.addEventListener('click', (event) => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        seekTo(event, videoElement);
    }
});

progressContainer.addEventListener('mousedown', (event) => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        const onMouseMove = (event) => seekTo(event, videoElement);
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
});

progressHandle.addEventListener('mousedown', (event) => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        const onMouseMove = (event) => {
            const rect = progressContainer.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const width = rect.width;
            const percentage = Math.max(0, Math.min(1, offsetX / width)); // Ensure percentage is between 0 and 1
            progressHandle.style.left = `${percentage * 100}%`;
            progressBar.style.width = `${percentage * 100}%`;
            videoElement.currentTime = percentage * videoElement.duration;
            updateTimer(videoElement);
        };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
});

playButton.addEventListener('click', () => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        videoElement.play();
        playButton.style.display = 'none';
        pauseButton.style.display = 'inline-block';
    }
});

pauseButton.addEventListener('click', () => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        videoElement.pause();
        pauseButton.style.display = 'none';
        playButton.style.display = 'inline-block';
    }
});

fast.addEventListener("click", speedUpHandler);
slow.addEventListener("click", speedDownHandler);
volumeUp.addEventListener("click", volumeUpHandler);
volumeDown.addEventListener("click", volumeDownHandler);
fullScreen.addEventListener("click", fullScreenHandler);

const retryButton = document.getElementById('retry');

retryButton.style.display = 'none'; // Hide the Retry button initially

retryButton.addEventListener('click', () => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        videoElement.currentTime = 0; // Reset video to the beginning
        videoElement.play(); // Play the video
        retryButton.style.display = 'none'; // Hide the Retry button when the video is replayed
        playButton.style.display = 'none';
        pauseButton.style.display = 'inline-block';
    }
});
document.addEventListener('ended', (event) => {
    const videoElement = event.target;
    if (videoElement.tagName === 'VIDEO') {
        retryButton.style.display = 'inline-block'; // Show the Retry button when the video ends
    }
}, true);

const volumeIcon = document.getElementById('volume-icon');
const volumeSlider = document.getElementById('volume-slider');

const updateVolumeIcon = (volume) => {
    if (volume === 0) {
        volumeIcon.className = 'fa-solid fa-volume-mute';
    } else if (volume <= 50) {
        volumeIcon.className = 'fa-solid fa-volume-down';
    } else {
        volumeIcon.className = 'fa-solid fa-volume-high';
    }
};

volumeSlider.addEventListener('input', () => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        const volume = volumeSlider.value;
        videoElement.volume = volume / 100; // Convert to 0-1 range
        updateVolumeIcon(volume);
    }
});

volumeIcon.addEventListener('click', () => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
        if (videoElement.volume > 0) {
            videoElement.volume = 0;
            volumeSlider.value = 0;
        } else {
            videoElement.volume = 0.3;
            volumeSlider.value = 30;
        }
        updateVolumeIcon(videoElement.volume * 100);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("dropZone");
    const videoPlayer = document.querySelector("#main");

    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropZone.classList.add("active");
    });

    dropZone.addEventListener("dragleave", (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropZone.classList.remove("active");
    });

    dropZone.addEventListener("drop", (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropZone.classList.remove("active");

        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("video/")) {
            // Remove any existing video
            videoPlayer.innerHTML = '';

            // Create a new video element
            const link = URL.createObjectURL(file);
            const videoElement = document.createElement("video");
            videoElement.src = link;
            videoElement.setAttribute("class", "video");
            videoPlayer.appendChild(videoElement);

            videoElement.volume = 0.3;

            // Update progress bar and timer
            videoElement.addEventListener('timeupdate', () => {
                updateProgressBar(videoElement);
                updateTimer(videoElement);
            });

            videoElement.addEventListener('loadedmetadata', () => {
                updateProgressBar(videoElement);
                updateTimer(videoElement);
            });

            // Automatically play the new video
            

        } else {
            alert("Please drop a valid video file.");
        }
        
    });   
});



/*document.getElementById('#backward').addEventListener('click', () => {
    const videoElement=document.querySelector("video");
    videoElement.currentTime = Math.max(0, videoElement.currentTime - 10);
});

document.getElementById('#forward').addEventListener('click', () => {
    const videoElement=document.querySelector("video");
    videoElement.currentTime = Math.min(videoElement.duration, videoElement.currentTime + 10);
});*/