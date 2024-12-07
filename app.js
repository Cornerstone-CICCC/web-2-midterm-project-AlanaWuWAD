$(function () {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjhiYWZiYTU5OWFiNmU1ZDQwNzBlZjZhMDQ1MjkwYiIsIm5iZiI6MTczMjk5MjcyNC4zOCwic3ViIjoiNjc0YjVlZDQzMzliN2I2NzBjOWM4NGRhIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.UEHE6hXuIW9GmQ9vqZuLcFqBvMhjSMjavRZ7YDJiR3k'
    }
  };

  //search
  const dialog = document.querySelector('dialog');
  const closeButton = document.querySelector('#close');
  const searchList = document.querySelector('.search-list');
  const text = document.querySelector('.search-text');
  const btnSearch = document.querySelector('.fa-solid');

  btnSearch.addEventListener('click', () => {
    if (text.value) {
      overlay.classList.remove('hidden');
      search(text.value);
      // console.log(text.value)
    } else {
      alert('Please input movie name!')
    }
  });
  closeButton.addEventListener('click', () => {
    dialog.close();
    overlay.classList.add('hidden');
  });

  async function search(name) {
    let searchUrl = `https://api.themoviedb.org/3/search/movie?query=${name}`;
    try {
      let res = await fetch(searchUrl, options);
      let data = await res.json();
      searchList.innerHTML = '';
      data.results.forEach((i) => {
        if (i.backdrop_path) {
          searchList.innerHTML += `
          <div class='div-img'>
            <p>${i.title}</p>
            <img class='img-list' data-movie-id="${i.id}" src="https://image.tmdb.org/t/p/w200/${i.backdrop_path}" alt=""> 
          </div>  
        `
        }
        dialog.showModal();
      })
    } catch (e) {
      console.error(e);
    }
  };

  // Trending movies and TV
  const trendingVideos = document.querySelector('.trendingAll');
  const closeTrailer = document.querySelector('#closeTrailer');
  const trailerHidden = document.querySelector('.trailer-hidden');
  async function trendingAll() {
    try {
      let res = await fetch('https://api.themoviedb.org/3/trending/all/day?language=en-US', options);
      let data = await res.json();
      console.log('ALL', data.results)
      for (let i = 0; i < 6; i++) {
        let img = document.createElement('img')
        img.classList.add('popular');
        img.src = `https://image.tmdb.org/t/p/w300/${data.results[i].poster_path}`
        trendingVideos.append(img)
        // console.log('for', data.results[i].poster_path)
        // trendingVideos.innerHTML += `
        //   <img class='popular' data-movie-id="${data.results[i].id}" data-media-type="${data.results[i].media_type}" src="https://image.tmdb.org/t/p/w300/${data.results[i].poster_path}" alt=""> 
        // `;
        creatModal(data.results[i].id, img)
      }
      // trendingVideos.addEventListener('click', (e) => {
      //   trailerHidden.classList.remove('trailer-hidden');
      //   videoAll(e.target.dataset.movieId, e.target.dataset.mediaType)
      // })
      // closeTrailer.addEventListener('click', () => {
      //   trailerHidden.classList.add('trailer-hidden');
      //   document.getElementById('trailerPlayer').src = "";
      // })
    } catch (e) {
      console.error(e);
    }
  }
  trendingAll()

  // Function of playing videos
  // const trailerPlayer = document.querySelector('#trailerPlayer');
  // async function videoAll(id, mediaType) {
  //   console.log('vidoeALL', id, mediaType)
  //   try {
  //     let res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}/videos?language=en-US`, options);
  //     let data = await res.json();

  //     // type: 'Trailer'
  //     const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

  //     if (trailer) {
  //       // build YouTube URL
  //       const youtubeUrl = `https://www.youtube.com/embed/${trailer.key}`;
  //       trailerPlayer.src = youtubeUrl;
  //     } else {
  //       console.log('No trailer available for this movie.');
  //       trailerPlayer.parentElement.innerHTML = '<p>No trailer available for this movie.</p>';
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  // Movies top 10
  let trendingMovie = document.querySelector('.trendingMovie');
  const movieUrl = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';

  async function moviesTop10() {
    try {
      let res = await fetch(movieUrl, options);
      let data = await res.json();

      console.log(data.results)
      for (let i = 0; i < 10; i++) {
        let dataDetail = await movieDetail(data.results[i].id, 'movie');
        // console.log('dataD',dataDetail);

        trendingMovie.innerHTML += `
          <div class="movieName"><p>${data.results[i].title}</p>
          <img class='moviesTop10' id="${data.results[i].id}" src="https://image.tmdb.org/t/p/w300/${data.results[i].backdrop_path}" alt="">
          <div class="movieDetail">
                <p>Release Date: ${dataDetail.release_date}</p>
                <p>Popular: ${dataDetail.vote_average}</p>
                <p>Runtime: ${Math.floor(dataDetail.runtime / 60)} hr ${dataDetail.runtime % 60}min</p>
            </div>
          </div>
           
        `;

      }
    } catch (e) {
      console.error(e);
    }

  }
  moviesTop10()

  async function movieDetail(id, type) {
    const movieDetail = `https://api.themoviedb.org/3/${type}/${id}`;
    try {
      let res = await fetch(movieDetail, options);
      let data = await res.json();
      return data;
      // let runtime_hr = Math.floor(data.runtime / 60);
      // let runtime_min = data.runtime % 60;
      // console.log('detail', runtime_hr, runtime_min)
      // return `${runtime_hr}hr ${runtime_min}min`
    } catch (e) {
      console.error(e);
    }
  }

  //Trending shows
  let trendingShow = document.querySelector('.trendingShow');
  const showUrl = 'https://api.themoviedb.org/3/trending/tv/day?language=en-US';

  async function showsTop10() {
    try {
      let res = await fetch(showUrl, options);
      let data = await res.json();
      // console.log(data.results)
      let count =0;
      let i =0;
      while (count < 10 && i < data.results.length) {
        let dataDetail = await movieDetail(data.results[i].id, 'tv');
        if(data.results[i].backdrop_path){
        trendingShow.innerHTML += `
          <div class="showName"><p>${data.results[i].name}</p>
          <img class='showsTop10' id="${data.results[i].id}" src="https://image.tmdb.org/t/p/w300/${data.results[i].backdrop_path}" alt="">
          <div class="movieDetail">
                <p>Release Date: ${dataDetail.first_air_date}</p>
                <p>Popular: ${dataDetail.vote_average}</p>
                <p>Country: ${dataDetail.origin_country}</p>
            </div>
          </div>
        `;
        count++;
        }
        i++;
      }
    } catch (e) {
      console.error(e);
    }
  }
  showsTop10()

  //Comming soon
  const upcomming = document.querySelector('.upcomming');

  const upcommingUrl = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';

  async function upcommingMovie() {
    try {
      let res = await fetch(upcommingUrl, options);
      let data = await res.json();
      let id = Math.random() * 10 | 0;
      while(data.results[id].release_date < '2024-11-31'){
        id = Math.random() * 10 | 0;
      }
      // console.log('data',data.results[id].release_date)
      
      upcomming.innerHTML += `
          <div class="commingMovie">
          <img class='comming-movie-img' id="${data.results[id].id}" src="https://image.tmdb.org/t/p/w500/${data.results[id].poster_path}" alt="">
          </div>
          <div class='movieInfo'>
            <h1>${data.results[id].title}</h1>
            <p>${data.results[id].overview}</p>
            <p>${data.results[id].release_date}</p>
            <button class="upcomming-btn">Watch Trailer</button>
          </div>
        `;

      // upcomming trailer play
      let lastScrollPosition = 0;
      const trailerBtn = document.querySelector('.upcomming-trailer');

      // trailerBtn.addEventListener('click', () => {
      //   lastScrollPosition = window.scrollY;
      //   trailerHidden.classList.remove('trailer-hidden')
      //   videoAll(data.results[id].id, 'movie')
      //   window.scrollTo({
      //     top: 0,
      //     behavior: 'smooth',
      //   })
      // })

      // closeTrailer.addEventListener('click', () => {
      //   trailerHidden.classList.add('trailer-hidden');
      //   document.getElementById('trailerPlayer').src = "";
      //   window.scrollTo({
      //     top: lastScrollPosition,
      //     behavior: 'smooth',
      //   });
      // })

      // backgroung img
      const bkgImgUrl = `https://image.tmdb.org/t/p/w500/${data.results[id].poster_path}`;

      upcomming.style.backgroundImage = `linear-gradient(rgba(0, 0, 255, 0.3), rgba(255, 255, 0, 0.5)),url('${bkgImgUrl}')`;
    } catch (e) {
      console.error(e);
    }
  }
  upcommingMovie()

  //toTop btn
  const toTopBtn = document.getElementById('toTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      toTopBtn.classList.remove('hidden');
    } else {
      toTopBtn.classList.add('hidden');
    }
  });

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  function creatModal(movie, container) {
    const modal = document.querySelector('.modal');
    const modalContent = document.querySelector('.modal-content');
    container.onclick = () => {
      modal.style.display = 'block';
      videoAll(movie, 'movie')
    }
    window.onclick = (e) => {
      if (e.target == modal) {
        modal.style.display = 'none';
        trailerPlayer.innerHTML = '';
        trailerPlayer.src = '';
      }
    }
  }

  const trailerPlayer = document.querySelector('#trailerPlayer');
  async function videoAll(id, mediaType) {
    console.log('vidoeALL', id, mediaType)
    try {
      let res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}/videos?language=en-US`, options);
      let data = await res.json();
      // console.log('trailer',data.results)
      const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
      console.log(trailer)
      const youtubeUrl = `https://www.youtube.com/embed/${trailer.key}`
      trailerPlayer.src = youtubeUrl;



      // type: 'Trailer'
      // const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

      // if (trailer) {
      //   // build YouTube URL
      //   // const youtubeUrl = `https://www.youtube.com/embed/${trailer.key}`;
      //   // trailerPlayer.src = youtubeUrl;
      // } else {
      //   console.log('No trailer available for this movie.');
      //   // trailerPlayer.parentElement.innerHTML = '<p>No trailer available for this movie.</p>';
      // }
    } catch (e) {
      console.error(e);
    }
  }

  //Light/Dark mode
  const switchMode = document.querySelector('#switch-mode');
  const main = document.querySelector('main');
  switchMode.onclick = () => {
    main.classList.toggle('light-mode');
  }


})