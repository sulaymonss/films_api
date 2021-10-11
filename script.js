let elTemplate = document.querySelector('#template').content;
let elList = document.querySelector('#list');
let elType = document.querySelector('#films_type');
let elForm = document.querySelector('#form');
let elSearch = document.querySelector('#search_input');
let elSelect = document.querySelector('#select');

const KEY = 'e7c881d2';

let pageCount = 1;


function renderMovies(arr, element){
    element.innerHTML = null;
    arr.forEach(movie =>{
        let cloneTemaplate = elTemplate.cloneNode(true);
        
        let newImg = cloneTemaplate.querySelector('.card__img');
        let newTitle = cloneTemaplate.querySelector('.card__title');
        
        newImg.setAttribute('src', movie.Poster);
        newImg.onerror = (e) => {
            e.target.src = 'https://via.placeholder.com/150?text=IMG+NOT+FOUND';
        };
        newTitle.textContent = movie.Title;
        
        element.appendChild(cloneTemaplate);
    })
}

if(pageCount <= 1){
    prev.disabled = true
}else{
    prev.disabled = false
}

next.addEventListener('click', () =>{
    pageCount++
    
    if(pageCount <= 1){
        prev.disabled = true
    }else{
        prev.disabled = false
    }
    
    fetchMovies()
});

prev.addEventListener('click', () =>{
    pageCount--
    if(pageCount <= 1){
        prev.disabled = true
    }else{
        prev.disabled = false
    }
    
    fetchMovies()
});

// render types
function renderTypes(filmsArr, element){
    element.innerHTML = null;   
    let result = [];
    
    filmsArr.forEach((film) =>{
        if(!result.includes(film.Type)){
            result.push(film.Type);
            result.sort();
        }
    })
    
    result.forEach((onlyType) =>{
        let newOption = document.createElement('option');
        newOption.textContent = onlyType;
        newOption.value = onlyType;
        
        element.appendChild(newOption);
    })
}



async function fetchMovies(){
    elList.innerHTML = '<img src="./spinner.svg" alt="spinner" class="spinner" width="270" height="270"/>'
    let response = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=hulk&page=${pageCount}`)
    data = await response.json()
    
    let total = Math.ceil(data.todtalResults / 10);
    
    if(pageCount == total){
        next.disabled = true
    }else{
        next.disabled = false
    }
    
    renderMovies(data.Search, elList);
    renderTypes(data.Search, elType); 
}

fetchMovies();

elForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    
    let searchValue = elSearch.value.trim();
    let typeValue = elType.value;
    
    // search from names
    const regex = new RegExp(searchValue, 'gi');
    
    const foundFilms = data.Search.filter((film) => film.Title.match(regex));
    
    // search from types
    
    let typedPokemons = [];	
    
    if(typeValue === 'all'){
        typedPokemons = foundFilms;
    }else{
        typedPokemons = foundFilms.filter((film) => film.Type.includes(typeValue));
    }
    
    elSearch.value = null;  
    
    renderMovies(typedPokemons, elList)
})