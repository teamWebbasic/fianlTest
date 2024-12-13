import config from '../config/apiKey.js';

const APIKEY = config.key;
const results = JSON.parse(localStorage.getItem(`searchResults`));

// dom var
const button = document.querySelector(`#searchBtn`);
const searchBox = document.querySelector(`#SearchBox`);
const noKeyword = document.querySelector('#nonKeywordDialog');
const btnCloseDialog = document.querySelector('.diaClose');  

const getPixa = async(keyWord) => {
    // API 호출 및 ajax로 검색어 및 결과 넘겨주기
    try{
        const response = await fetch(
            `https://pixabay.com/api/?key=${APIKEY}&q=${keyWord}&image_type=photo`
        );
        
        if(!response.ok){
            throw new Error(`api 연동 실패`);
        }
        const result = await response.json();
        
        localStorage.setItem('searchResults', JSON.stringify(result.hits));
        localStorage.setItem('inKeyWord', keyWord);
        window.location.href = 'searchResult.html';
    }catch(e){
        console.log(e);
    }
}

// serachResult 페이지 화면 내용 뿌려주기
function displayResults(result) {
    const resultArea = document.querySelector(`#DisplayListArea .imgList`);
    
    try {
        result.forEach((item) => {
            
            const box = document.createElement('div');
            box.classList.add('imgItem');
            
            const img = document.createElement('img');
            img.src = item.previewURL;
            img.alt = item.tags;
            
            box.appendChild(img);
            
            resultArea.appendChild(box);
        });
        
    } catch (error) {
        console.error(error);
    }
}

displayResults(results);

// enter 방지를 위한 preventDefalut
document.querySelector('#SearchArea').addEventListener('submit', function(e) {
    e.preventDefault(); // 폼 제출 방지
  });
  

button.addEventListener('click', ()=>{
    const keyWord = searchBox.value.trim(); // 검색어의 양끝 공백 제거
    
    if(!keyWord){
        // alert 으로 간단하게 해결 할 수 있지만 뭐든 도전해보고자 해서 dialog 이용
        //alert('검색어를 입력해주세요!');
        noKeyword.showModal();
        return;
    } 
    
    getPixa(keyWord);
});

noKeyword.addEventListener('click', (e) => {
    // 버블링을 이용한 화면 밖 클릭시 닫힘 이벤트 
    if(e.target.nodeName === 'DIALOG'){
        noKeyword.close();
    }
})

btnCloseDialog.addEventListener('click', () =>{
    // 검색어 입력 경고 창 닫기
    noKeyword.close();
})