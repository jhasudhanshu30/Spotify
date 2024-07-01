console.log('Lets write Javascript');
let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    //let a = await fetch(`/${folder}/`)
    let a = await fetch("http://127.0.0.1:5501/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    //songs = []
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }

    //Show all the songs in the playlist
    let songUL = document.querySelector(".songList ul");
    //songUL.innerHTML = ""; // Clear the list before adding new songs

    songs.forEach(song => {
        console.log(song);
        let li = document.createElement("li");
        li.innerHTML = `
                    <img class="invert" src="music.svg" alt="">
                    <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>Sudhanshu Jha</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert" src="play.svg" alt="">
                    </div>`;
        songUL.appendChild(li);
    });

    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    //Get the list of all the songs
    //Get the list of all the songs
    songs = await getSongs()
    playMusic(songs[0], true)
    //console.log(songs)

    // //Show all the songs in the playlist
    // let songUL = document.querySelector(".songList ul");
    // //songUL.innerHTML = ""; // Clear the list before adding new songs

    // songs.forEach(song => {
    //     console.log(song);
    //     let li = document.createElement("li");
    //     li.innerHTML = `
    //                 <img class="invert" src="music.svg" alt="">
    //                 <div class="info">
    //                     <div>${song.replaceAll("%20", " ")}</div>
    //                     <div>Harry</div>
    //                 </div>
    //                 <div class="playnow">
    //                     <span>Play Now</span>
    //                     <img class="invert" src="play.svg" alt="">
    //                 </div>`;
    //     songUL.appendChild(li);
    // });

    // //Attach an event listener to each song
    // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    //     e.addEventListener("click", element => {
    //         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    //     })
    // })

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    //Listen for timeupdate event
    // currentSong.addEventListener("timeupdate", ()=>{
    //     console.log(currentSong.currentTime, currentSong.duration);
    //     document.querySelector(".songtime").innerHTML = '${ secondsToMinutesSeconds(currentSong.currentTime)} :${secondsToMinutesSeconds(currentSong.duration)}'

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })

    // Add an event listener to sekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //Add an event listener to previous
    previous.addEventListener("click", () => {
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        //currentSong.src.split("/").slice(-1)[0]
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    //Add an event listener to next
    next.addEventListener("click", () => {
        console.log("Next  clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        //currentSong.src.split("/").slice(-1)[0]
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })



}

main()