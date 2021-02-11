const tbody = document.getElementById('table-body');
const filters = document.getElementById('filter-list');

const url = "https://free-to-play-games-database.p.rapidapi.com/api/games";
const headers = { 
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "wcChjWF6uPmshVrZelENA2X6bwmIp1EeuhfjsnpYsvCrl1zAtx",
		"x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com"
	}}

let gameList = {};

//fetch
function fetchData(url) {
	return fetch(url, headers)
			.then(response => response.json())
			.catch(err => console.error(err));	
}

fetchData(url)	
		.then(data => {
			gameList = data;	
			createGameList();
			createFilterList();			
});	

//generates HTML
function createGameList(){
	for(i = 0; i < 20; i++){
		let num = i+1;				
		tbody.innerHTML += `			
			<tr>
				<td class="number text-center">` + num + `</td>
				<td class="image"><img src="` + gameList[i].thumbnail + `" alt=""></td>
				<td class="product"><strong>` + gameList[i].title + `</strong><br>` + gameList[i].short_description + `</td>
				<td class="rate text-right"><span><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-half-o"></i></span></td>
				<td class="price text-right">` + gameList[i].genre + `</td>
			</tr>
			`
	};
}

//creates filter list based on entire game list from API
function createFilterList(){	
	let distinct = [];	
	let unique = [];

	for(i in gameList){			
		if( !unique[gameList[i].genre]){
			distinct.push(gameList[i].genre);
			unique[gameList[i].genre] = 1;			
			console.log(distinct)
			filters.innerHTML += `
				<div class="checkbox">
            		<label><input type="checkbox" class="icheck"> ` + gameList[i].genre + `</label>
            	</div>`	
		}
	};
}

function applyFilter(){			
	fetchData(url)	
		.then(data => {
			gameList = data;	
			createGameList();			
	});			
}	

document.getElementById('apply-btn').addEventListener('click', applyFilter)