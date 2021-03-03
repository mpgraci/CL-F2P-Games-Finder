import Tags from './Tags.js';
let tags = new Tags();

const tbody = document.getElementById('table-body');
const nextBtn = document.getElementById('next_page');
const prevBtn = document.getElementById('prev_page');
const results = document.getElementById('num-results');
const selectedSort = document.getElementById('selected-sort');
const gameDetails = document.getElementById('game-details');
const modal = document.getElementById("myModal");

const url = "https://free-to-play-games-database.p.rapidapi.com/api/";
const headers = { 
	"method": "GET",	
	"headers": {
		"x-rapidapi-key": "wcChjWF6uPmshVrZelENA2X6bwmIp1EeuhfjsnpYsvCrl1zAtx",
		"x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com"
	}}

let gameList = {};

let currentPage = 1;
let itemsPerPage = 20;

let filterQuery = "games";
let isSort = false;
let isFilter = false;

//fetch
function fetchData(url) {
	return fetch(url, headers)
			.then(response => response.json())
			.catch(err => console.error(err));	
}

//populates list on page load
function onLoad(){
	let page = 1;

	fetchData(url + "games")	
		.then(data => {
			gameList = data;				
			tags.createTagList();
			createGameList(page);			
	});			
}

//generates game list
function createGameList(page){
	tbody.innerHTML = "";
	
	results.innerHTML = gameList.length + " free game(s)"
	
	for(let i = (page-1) * itemsPerPage; i < (page * itemsPerPage) && i < gameList.length; i++){
		let num = i+1;	

		tbody.innerHTML += `			
			<tr id=` + gameList[i].id +`>
				<td class="number text-center">` + num + `</td>
				<td class="image"><img src="` + gameList[i].thumbnail + `" alt=""></td>
				<td class="product"><strong>` + gameList[i].title + `</strong><br>` + gameList[i].short_description + `</td>
				<td class="rate text-right"><span><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i></span></td>
				<td class="price text-right">` + gameList[i].genre + `</td>				
			</tr>
			`;
	};

	//changes pagination styles
	if(page == 1){
		prevBtn.className = 'disabled';
	} else {
		prevBtn.className = 'active';
	}

	if(page == numPages()){
		nextBtn.className = 'disabled';
	} else {
		nextBtn.className = 'active';
	}
}

//pagination
function prevPage(){
	if(currentPage > 1){
		currentPage--;
		createGameList(currentPage);
	}
}
function nextPage(){	
	if(currentPage < numPages()){
		currentPage++;
		createGameList(currentPage);
	}
}
function numPages(){
	return Math.ceil(gameList.length / itemsPerPage);
}

//filter and sort
function applyFilter(){	
	let page = 1;

	//resets sort when new filter is applied
	if(isSort){
		isSort = false;
		selectedSort.innerHTML = "Order By";
	}
		
	if(tags.checkTags().length != 0) {
		isFilter = true;
		for(let i = 0; i < tags.checkTags().length; i++){		
			if(i < 1){				
				filterQuery = "filter?tag=" + tags.checkTags()[i];								
			} else {
				filterQuery += "." + tags.checkTags()[i];
			}						
		}	
	} else {
		isFilter = false;
		filterQuery = "games"
	}
		
	fetchData(url + filterQuery)	
		.then(data => {
			gameList = data;	
			createGameList(page);			
	});			
}	
function sort(sort){
	let page = 1;		

	if(isFilter && !isSort){
		filterQuery += "&sort-by="		
		console.log(filterQuery)
	} else if(isFilter && isSort){
		//do nothing
	} else {
		filterQuery = "games?sort-by="
	}
	
	isSort = true;

	switch(sort){
		case "alphabetical":
			selectedSort.innerHTML = "Name";
			break;
		case "release-date":
			selectedSort.innerHTML = "Release Date";
			break;
		case "popularity":
			selectedSort.innerHTML = "Popularity";
			break;
		default:
			selectedSort.innerHTML = "Order By";
	}	

	fetchData(url + filterQuery + sort)	
		.then(data => {
			gameList = data;			
			createGameList(page);			
	});			
}

//generates game details for popup
function createGameDetails(game){
	gameDetails.innerHTML = "";

	gameDetails.innerHTML = 
	`<h1 class="my-4">${gameList.title} <small>${gameList.genre}</small></h1>
	<div class="row">
	  <div class="col-sm-5">
		<img src="${gameList.thumbnail}" alt="">
	  </div>
	  <div class="col-sm-6">
		<h3 class="my-3">Game Description</h3>
		<p>${gameList.description}</p>
		<h3 class="my-3">Game Details</h3>
		<ul>
		  <li><label>Release Date:</label><span> ${gameList.release_date}</span></li>
		  <li><label>Genre:</label><span> ${gameList.genre}</span></li>
		  <li><label>Platform:</label><span> ${gameList.platform}</span></li>      
		  <li><label>Publisher:</label><span> ${gameList.publisher}</span></li>
		  <li><label>Developer:</label><span> ${gameList.developer}</span></li>
		  <li><a href="${gameList.game_url}">${gameList.game_url}</a></li>
		  
		</ul>
	  </div>
	</div>`;
};

//popup
document.getElementById('table-body').addEventListener('click', function(e){
    let selectedGame = e.target.closest('tr').id;	

	fetchData(url + "game?id=" + selectedGame)	
		.then(data => {
			gameList = data;							
			createGameDetails(selectedGame);
	});	
    modal.style.display = "block";
})

document.getElementsByClassName("close")[0].addEventListener('click', function() {
  modal.style.display = "none";
  gameDetails.innerHTML = "";
});

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
	gameDetails.innerHTML = "";
  }
}

//buttons and events
window.onload = onLoad();
document.getElementById('apply-btn').addEventListener('click', applyFilter);
document.getElementById('next_page').addEventListener('click', nextPage);
document.getElementById('prev_page').addEventListener('click', prevPage);
document.getElementById('name-sort').addEventListener('click', function(){sort("alphabetical")});
document.getElementById('date-sort').addEventListener('click', function(){sort("release-date")});
document.getElementById('pop-sort').addEventListener('click', function(){sort("popularity")});