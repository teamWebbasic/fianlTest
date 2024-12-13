import config from '../config/apiKey.js';

const APIKEY = config.key;
const results = JSON.parse(localStorage.getItem(`searchResults`));

// dom var
//  subpage
const resultTit = document.querySelector(`.h2Tit`);
const button = document.querySelector(`#searchBtn`);
const logo = document.querySelector(`#h1Logo`);
const reSearch = document.querySelector(`#textSearch`);

const noKeyword = document.querySelector('#nonKeywordDialog');
const btnCloseDialog = document.querySelector('.diaClose');


// serachResult 페이지 화면 내용 뿌려주기
function displayResults(result) {
    
    // 보낸 로컬스토리지에서 다시 불러와 뿌려주기.
    const searchKeyWord = localStorage.getItem('inKeyWord');
    
    const resultArea = document.querySelector(`#DisplayListArea .imgList`);
    
    resultArea.innerHTML = '';
    
    if(searchKeyWord && resultTit){
        resultTit.textContent = `${searchKeyWord} (으)로 검색한 결과입니다.`
    }

    try {
        result.forEach((item) => {
            
            const box = document.createElement('div');
            box.classList.add('imgItem');
            
            const img = document.createElement('img');
            img.src = item.webformatURL;
            img.alt = item.tags;
            
            box.appendChild(img);
            
            resultArea.appendChild(box);
        });
        
    } catch (error) {
        console.error(error);
    }
}


displayResults(results);

logo.addEventListener('click', ()=>{
    window.location.href = 'index.html';
    /* key값이 비워져 있지 않을경우를 이용하여 메인화면 이동시 스토리지를 비워줌  */ 
    
    if(localStorage.getItem('inKeyWord') !== null){
        localStorage.clear();
    }
})

textSearch.addEventListener('keydown', (e)=>{
    // reSearch input값을 가져와 양끝 공백 제거후 메게변수로 넘겨줌
    const keyword = reSearch.value.trim();
    
    if(e.key === 'Enter') {
        if(!keyword){
            noKeyword.showModal();
            return;
        } 
        calling(keyword);
    }
});

const calling = async(keyword) =>{
    try{
        const response = await fetch(`https://pixabay.com/api/?key=${APIKEY}&q=${keyword}&image_type=photo`);
        
        if(!response.ok){
            throw new Error('API 연동 실패');
        }
        
        const result = await response.json();
        
        localStorage.setItem('searchResults', JSON.stringify(result.hits));
        localStorage.setItem('inKeyWord', keyword);
        window.location.reload();
        
    }catch(error){
        console.log(error);
    }
        
}

document.querySelector(`#reSearch`).addEventListener('submit', function(e) {
    e.preventDefault(); // 폼 제출 방지
  });

button.addEventListener('click', ()=>{
    const keyword = reSearch.value.trim(); // 검색어의 양끝 공백 제거

    if(!keyword){
        noKeyword.showModal();
        return;
    } 

    calling(keyWord);
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