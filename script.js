const clickBtn = document.getElementById('clickBtn');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh' ;

// search by song or artist

async function searchSongs(term){
    const res = await fetch(`${apiURL}/suggest/${term}`); 
    const data = await res.json();

    showData(data);
}

// show song or artist in DOM
function showData(data){
    const  lyricList = data.data.slice(0, 10);
    result.innerHTML = `
        <ul id="songs">
            ${lyricList.map(song => `
                <li>
                    <span><h3>${song.title}</h3>Album by <span id="artistName">${song.artist.name}</span></span>
                    <button class="btn btn-success" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
                </li>
                ` )

                .join('')
            }
        </ul>
    ` ;

    if (data.prev || data.next) {
        more.innerHTML = `
        ${
        data.prev
            ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
            : ''
        }
        ${
        data.next
            ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
            : ''
        }
    `;
    } 
    else {
        more.innerHTML = '';
    }
}

// Get prev and next songs
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
  
    showData(data);
}

// get lyrics for songs
async function getLyrics(artist, songTitle){
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
  
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>') ;

    result.innerHTML = `
    <h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>
    ` ;

    more.innerHTML = '' ;
} 

// event listener
clickBtn.addEventListener('click', e => {
    e.preventDefault();
    const searchTerm = search.value.trim() ;

    if(!searchTerm){
        alert("please type in a search term");
    }
    else{
        searchSongs(searchTerm);
    }

    document.getElementById('extra').style.display = "none" ;
})

// get lyrics button click
result.addEventListener('click', e => {
    const clickedSong = e.target;

    if(clickedSong.tagName === 'BUTTON'){
        const artist = clickedSong.getAttribute('data-artist') ;
        const songTitle = clickedSong.getAttribute('data-songtitle') ;

        getLyrics(artist, songTitle) ;
    };
})