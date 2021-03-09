import Tags from './Tags.js';
import GetData from './GetData.js';
import Pages from './Pages.js';

let tags = new Tags();
let getData = new GetData();

const selectedSort = document.getElementById('selected-sort');
const gameDetails = document.getElementById('game-details');
const modal = document.getElementById("myModal");

let filterQuery = "games";
let isSort = false;
let isFilter = false;
let currentPage = 1;
let gameList = {};
let gameDetailsData = {};

//populates list on page load
function onLoad(){
	let page = 1;	

	getData.fetchData(filterQuery)	
		.then(data => {
			gameList = data;				
			tags.createTagList();
			createGameList(page);			
	});			
}

//generates game list
function createGameList(page){
	const tbody = document.getElementById('table-body');
	const nextBtn = document.getElementById('next_page');
	const prevBtn = document.getElementById('prev_page');
	const results = document.getElementById('num-results');

	let pages = new Pages(gameList.length, page);
	currentPage = page;

	tbody.innerHTML = "";
	
	results.innerHTML = gameList.length + " free game(s)"
	
	for(let i = (page-1) * pages.itemsPerPage; i < (page * pages.itemsPerPage) && i < gameList.length; i++){
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

	if(page == pages.numPages()){
		nextBtn.className = 'disabled';
	} else {
		nextBtn.className = 'active';
	}
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
		
	getData.fetchData(filterQuery)	
		.then(data => {
			gameList = data;	
			createGameList(page);			
	});			
}	

function sort(sort){
	let page = 1;		

	if(isFilter && !isSort){
		filterQuery += "&sort-by="				
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

	getData.fetchData(filterQuery + sort)	
		.then(data => {
			gameList = data;			
			createGameList(page);			
	});			
}

//generates game details for popup
function createGameDetails(){

	gameDetails.innerHTML = 
	`<h1 class="my-4">${gameDetailsData.title} <small>${gameDetailsData.genre}</small></h1>
	<div class="row">
	  <div class="col-sm-5">
		<img src="${gameDetailsData.thumbnail}" alt="">
	  </div>
	  <div class="col-sm-6">
		<h3 class="my-3">Game Description</h3>
		<p>${gameDetailsData.description}</p>
		<h3 class="my-3">Game Details</h3>
		<ul>
		  <li><label>Release Date:</label><span> ${gameDetailsData.release_date}</span></li>
		  <li><label>Genre:</label><span> ${gameDetailsData.genre}</span></li>
		  <li><label>Platform:</label><span> ${gameDetailsData.platform}</span></li>      
		  <li><label>Publisher:</label><span> ${gameDetailsData.publisher}</span></li>
		  <li><label>Developer:</label><span> ${gameDetailsData.developer}</span></li>
		  <li><a href="${gameDetailsData.game_url}">${gameDetailsData.game_url}</a></li>
		  
		</ul>
	  </div>
	</div>`;

	modal.style.display = "block";
};

//popup
document.getElementById('table-body').addEventListener('click', function(e){
    let selectedGame = e.target.closest('tr').id;	
	gameDetails.innerHTML = "";

	getData.fetchData("game?id=" + selectedGame)	
		.then(data => {
			gameDetailsData = data;							
			createGameDetails();
	});	    
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
document.getElementById('clear-btn').addEventListener('click', tags.clearTags);
document.getElementById('next_page').addEventListener('click', function(){		
	let pages = new Pages(gameList.length, currentPage);	
	createGameList(pages.nextPage());
});
document.getElementById('prev_page').addEventListener('click', function(){		
	let pages = new Pages(gameList.length, currentPage);	
	createGameList(pages.prevPage());
});
document.getElementById('name-sort').addEventListener('click', function(){sort("alphabetical")});
document.getElementById('date-sort').addEventListener('click', function(){sort("release-date")});
document.getElementById('pop-sort').addEventListener('click', function(){sort("popularity")});