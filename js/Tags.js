export default class Tags {
    constructor(){
        this.tagList = ["mmorpg", "shooter", "strategy", "moba", "racing", "sports", "social", "sandbox", "open-world",
                        "survival", "pvp", "pve", "pixel", "voxel", "zombie", "turn-based", "first-person", "third-Person", "top-down", "tank", "space", 
                        "sailing", "side-scroller", "superhero", "permadeath", "card", "battle-royale", "mmo", "mmofps", "mmotps", "3d", "2d", "anime", "fantasy", "sci-fi", "fighting",
                        "action-rpg", "action", "military", "martial-arts", "flight", "low-spec", "tower-defense", "horror", "mmorts"];
    }
    
    createTagList(){	
        //checks for duplicates
        let distinct = [];	
        let unique = [];
        const filters = document.getElementById('filter-list');

        for(let i in this.tagList){			
            if( !unique[this.tagList[i]]){
                distinct.push(this.tagList[i]);
                unique[this.tagList[i]] = 1;	                
                filters.innerHTML += `
                    <li>
                    <div class="checkbox">                        
                        <label><input name="tags" type="checkbox" class="icheck" value="` + this.tagList[i] + `"> ` + this.tagList[i] + `</label>
                    </div>
                    </li>`
            }
        };
    }

    checkTags(){
        const checkboxes = document.querySelectorAll('input[name="tags"]:checked'), values = [];
        Array.prototype.forEach.call(checkboxes, function(el){
            values.push(el.value);
        });
        return values;
    }

    clearTags(){
        const checkboxes = document.querySelectorAll('input[name="tags"]:checked');               
        Array.prototype.forEach.call(checkboxes, function(el){
             el.checked = false;
        });
    }
}