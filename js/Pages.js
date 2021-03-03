export default class Pages {
    constructor(listLength, currentPage){               
        this.listLength = listLength;  
        this.currentPage = currentPage;      
        this.itemsPerPage = 20;      
    }        
    numPages(){                  
        return Math.ceil(this.listLength / this.itemsPerPage);
    }
    prevPage(){            
        if(this.currentPage > 1){
            this.currentPage--;     
            return this.currentPage;       
        };
        return this.currentPage;
    }
    nextPage(){              
        let lastPage = this.numPages.bind(this);             
        if(this.currentPage < lastPage()){
            this.currentPage++;                                       
            return this.currentPage;
        };
        return this.currentPage;
    }    
}