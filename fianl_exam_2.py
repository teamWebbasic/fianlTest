import requests
import os
import json
import urllib.parse

def fetch_and_generate_html(q, save_path, max_images=10):
    # API 세부 정보
    API_KEY = '47423541-a63a0ce2842c85c1958a2fcb5'
    image_type = "photo"
    
    # Pixabay API URL 생성
    encoded_query = urllib.parse.quote(q)
    url = f'https://pixabay.com/api/?key={API_KEY}&q={encoded_query}&image_type={image_type}&per_page={max_images}'

    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # 요청 성공 여부 확인
        data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"요청 실패: {e}")
        return
    except json.JSONDecodeError:
        print("JSON 응답 디코드 오류")
        return

    if 'hits' not in data or not data['hits']:
        print("이미지를 찾을 수 없습니다.")
        return

    # HTML 생성
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pixabay Image Results</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                padding: 0;
                background-color: #f9f9f9;
            }
            .gallery {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                justify-content: center;
            }
            .gallery img {
                max-width: 200px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .image-container {
                text-align: center;
            }
            .image-container a {
                text-decoration: none;
                color: #333;
            }
        </style>
    </head>
    <body>
        <h1>검색 결과: {q}</h1>
        <div class="gallery">
    """
    
    # 이미지 데이터 추가
    for item in data['hits']:
        img_url = item.get('webformatURL')
        page_url = item.get('pageURL')
        if img_url and page_url:
            html_content += f"""
            <div class="image-container">
                <a href="{page_url}" target="_blank">
                    <img src="{img_url}" alt="{q}">
                </a>
            </div>
            """

    # HTML 닫기
    html_content += """
        </div>
    </body>
    </html>
    """

    # HTML 저장
    with open(save_path, "w", encoding="utf-8") as html_file:
        html_file.write(html_content)
    print(f"{save_path} 파일로 결과를 저장했습니다.")

def main():
    base_path = "D:/study/front/final exam/img"

    while True:
        # 사용자 입력 받기
        q = input("검색할 이미지 키워드를 입력하세요 (종료하려면 'q' 입력): ").strip()
        if q.lower() == 'q':
            print("프로그램을 종료합니다.")
            break
        
        # 키워드 기반 HTML 파일 저장 경로 설정
        save_path = os.path.join(base_path, f"{q}_results.html")
        os.makedirs(base_path, exist_ok=True)

        # HTML 생성 및 저장
        fetch_and_generate_html(q, save_path)

if __name__ == "__main__":
    main()
