export default class GetData {
    constructor(){        
        this.url = "https://free-to-play-games-database.p.rapidapi.com/api/";
        this.headers = { 
            "method": "GET",	
            "headers": {
                "x-rapidapi-key": "wcChjWF6uPmshVrZelENA2X6bwmIp1EeuhfjsnpYsvCrl1zAtx",
                "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com"
            }}
    }
    fetchData(param) {
        return fetch(this.url + param, this.headers)
                .then(response => response.json())
                .catch(err => console.error(err));	
    }
}