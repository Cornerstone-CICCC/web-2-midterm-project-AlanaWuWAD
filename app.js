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
        dialog.showModal(); //dialog method
      })

    } catch (e) {
      console.error(e);
    }
  };

  // Trending movies and TV
  const trendingVideos = document.querySelector('.trendingAll');
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
        creatModal(data.results[i].id, img, data, i)
      }
    } catch (e) {
      console.error(e);
    }
  }
  trendingAll()


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
        let popStar = parseFloat(data.results[i].vote_average.toFixed(1));

        trendingMovie.innerHTML += `
          <div class="movieName"><p>${data.results[i].title}</p>
          <img class='moviesTop10' id="${data.results[i].id}" src="https://image.tmdb.org/t/p/w300/${data.results[i].backdrop_path}" alt="">
          <div class="movieDetail">
                <p>Release Date: ${dataDetail.release_date}</p>
                <p>Popular: ${popStar} /10</p>
                <p>Runtime: ${Math.floor(dataDetail.runtime / 60)} hr ${dataDetail.runtime % 60}min</p>
            </div>
          </div>
           
        `;
      }
      const movieInstruction = document.querySelector('.instruction');
      const moviesTop10 = document.querySelectorAll('.moviesTop10');
      moviesTop10.forEach((img, i) => {
        img.addEventListener('click', async (e) => {
          const id = e.target.id;
          // console.log('click',i)
          const mediaType = 'movie';
          const modal = document.querySelector('.modal');
          videoAll(id, mediaType);
          addInstruction(data, movieInstruction, i, 'movie')
          modal.style.display = 'flex';
        })
      })
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
    } catch (e) {
      console.error(e);
    }
  }

  //Trending shows
  const trendingShow = document.querySelector('.trendingShow');
  const showUrl = 'https://api.themoviedb.org/3/trending/tv/day?language=en-US';

  async function showsTop10() {
    try {
      let res = await fetch(showUrl, options);
      let data = await res.json();
      // console.log(data.results)


      let count = 0;
      let i = 0;
      while (count < 10 && i < data.results.length) {
        let dataDetail = await movieDetail(data.results[i].id, 'tv');
        let popStar = parseFloat(data.results[i].vote_average.toFixed(1));

        if (data.results[i].backdrop_path) {
          trendingShow.innerHTML += `
          <div class="showName"><p>${data.results[i].name}</p>
          <img class='showsTop10' id="${data.results[i].id}" src="https://image.tmdb.org/t/p/w300/${data.results[i].backdrop_path}" alt="">
          <div class="movieDetail">
                <p>Release Date: ${dataDetail.first_air_date}</p>
                <p>Popular: ${popStar} /10</p>
                <p>Country: ${dataDetail.origin_country}</p>
            </div>
          </div>
        `;
          count++;
          const movieInstruction = document.querySelector('.instruction');

          document.querySelectorAll('.showsTop10').forEach((img, i) => {
            img.addEventListener('click', async (e) => {
              const id = e.target.id; // 獲取點擊的圖片 ID
              const mediaType = 'tv';
              const modal = document.querySelector('.modal');

              videoAll(id, mediaType);
              modal.style.display = 'flex';
              addInstruction(data, movieInstruction, i, 'tv')

            })
          })
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
      while (data.results[id].release_date < '2024-11-31') {
        id = Math.random() * 10 | 0;
      }
      console.log('upup', data.results[id])
      console.log('upup-id', id);

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
      const movieInstruction = document.querySelector('.instruction');
      const upcommingBtn = document.querySelector('.upcomming-btn');
      const mediaType = 'movie'
      upcommingBtn.onclick = () => {
        const modal = document.querySelector('.modal');
        videoAll(data.results[id].id, mediaType);
        addInstruction(data, movieInstruction, id, mediaType)
        modal.style.display = 'flex';
      }

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

  // modal pop-up
  const trailerPlayer = document.querySelector('#trailerPlayer');
  function creatModal(movie, container, data, i) {
    console.log('popup', data.results[i])
    const modal = document.querySelector('.modal');
    const movieInstruction = document.querySelector('.instruction');
    const mediaType = data.results[i].media_type;

    container.onclick = () => {
      modal.style.display = 'block';
      videoAll(movie, mediaType);
      // addInstruction(data, container, i,data.results[i].media_type)
      let popStar = parseFloat(data.results[i].vote_average.toFixed(1));
      if (data.results[i].media_type == 'tv') {
        movieInstruction.innerHTML = `
        <h3 id='ins-name'>${data.results[i].name}</h3>
        <h3>Overview: </h3>
        <p>${data.results[i].overview}</p>
        <h3>Type: ${data.results[i].media_type}</h3> 
        <h3>Popularity: ${popStar} /10 </h3>
        <h3>Release Date: ${data.results[i].first_air_date}</h3>
      `;
      }
      if (data.results[i].media_type == 'movie') {
        movieInstruction.innerHTML = `
        <h3 id='ins-name'>${data.results[i].title}</h3>
        <h3>Overview: </h3>
        <p>${data.results[i].overview}</p>
        <h3>Type: ${data.results[i].media_type}</h3> 
        <h3>Popularity: ${popStar} /10 </h3>
        <h3>Release Date: ${data.results[i].release_date}</h3>
      `;
      }

    }
    window.onclick = (e) => {
      if (e.target == modal) {
        modal.style.display = 'none';
        trailerPlayer.innerHTML = '';
        trailerPlayer.src = '';
      }
    }
  }

  async function videoAll(id, mediaType) {
    // console.log('vidoeALL', id, mediaType)
    try {
      let res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}/videos?language=en-US`, options);
      let data = await res.json();
      console.log('trailer', data.results)
      const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
      console.log('trailer', trailer)
      const youtubeUrl = `https://www.youtube.com/embed/${trailer.key}`
      trailerPlayer.src = youtubeUrl;

    } catch (e) {
      console.error(e);
    }
  }

  //Light/Dark mode
  const switchMode = document.querySelector('#switch-mode');
  const main = document.querySelector('main');
  const modalContent = document.querySelector('.modal-content')
  switchMode.onclick = () => {
    main.classList.toggle('light-mode');
    modalContent.classList.toggle('light-mode');
  }

  // for pop-up info
  function addInstruction(data, container, i, media_type) {
    console.log('func', data.results[i])
    let popStar = parseFloat(data.results[i].vote_average.toFixed(1));
    if (media_type == 'tv') {
      container.innerHTML = `
        <h3 id='ins-name'>${data.results[i].name}</h3>
        <h3>Overview: </h3>
        <p>${data.results[i].overview}</p>
        <h3>Type: ${media_type}</h3> 
        <h3>Popularity: ${popStar} /10 </h3>
        <h3>Release Date: ${data.results[i].first_air_date}</h3>
      `;
    }
    if (media_type == 'movie') {
      container.innerHTML = `
        <h3 id='ins-name'>${data.results[i].title}</h3>
        <h3>Overview: </h3>
        <p>${data.results[i].overview}</p>
        <h3>Type: ${media_type}</h3> 
        <h3>Popularity: ${popStar} /10 </h3>
        <h3>Release Date: ${data.results[i].release_date}</h3>
      `;
    }

  }

})