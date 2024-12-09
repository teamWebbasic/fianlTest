import config from '../config/apiKey.js';

const APIKEY = config.key;
const button = document.querySelector(`#searchBtn`);
const searchBox = document.querySelector(`#SearchBox`);
const results = JSON.parse(localStorage.getItem(`searchResults`));

const getPixa = async(keyWord) => {
    
    try{
        const response = await fetch(
            `https://pixabay.com/api/?key=${APIKEY}&q=${keyWord}&image_type=photo`
        );
        
        if(!response.ok){
            throw new Error(`api 연동 실패`);
        }
        const result = await response.json();
        
        localStorage.setItem('searchResults', JSON.stringify(result.hits));
        window.location.href = 'searchResult.html';
    }catch(e){
        console.log(e);
    }
}

function displayResults(result) {
    const resultArea = document.querySelector(`#DisplayListArea .imgList`);
    
    try {
        result.forEach((item) => {
            const img = document.createElement('img');
            img.src = item.previewURL;
            img.alt = item.tags;
            
            resultArea.appendChild(img);
        });
        
    } catch (error) {
        console.log(error);
    }
}

displayResults(results);

// enter 방지를 위한 preventDefalut
document.querySelector('#SearchArea').addEventListener('submit', function(e) {
    e.preventDefault(); // 폼 제출 방지
  });
  

button.addEventListener('click', ()=>{
    const keyWord = searchBox.value.trim();
    
    if(!keyWord){
        alert('검색어를 입력해주세요!');
        return;
    } 
    
    getPixa(keyWord);
});