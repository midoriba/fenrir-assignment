from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests as rq
from settings import HOTPEPPER_API_KEY, GOURMET_API_URL
import xml.etree.ElementTree as ET

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/local-gourmet")
async def get_local_gourmet(latitude: float, longitude: float, search_range: int, start: int):
    params = {
        "key": HOTPEPPER_API_KEY,
        "lat": latitude,
        "lng": longitude,
        "range": search_range,
        "start": start
    }
    print(params)
    response = rq.get(GOURMET_API_URL, params=params).text
    response_tree = ET.fromstring(response)

    shops = []
    for shop in response_tree.findall("./hp:shop", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}):
        shops.append({
            "id": shop.find("hp:id", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "name": shop.find("hp:name", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "address": shop.find("hp:address", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "opening_time": shop.find("hp:open", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "catch": shop.find("hp:catch", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "opening_time": shop.find("hp:open", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "image": shop.find("hp:photo/hp:pc/hp:l", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "genre": {
                "name": shop.find("hp:genre/hp:name", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
                "catch": shop.find("hp:genre/hp:catch", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text
            },
            "access": shop.find("hp:access", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text
        })
    genre_counts = dict()
    for shop in shops:
        name = shop["genre"]["name"]
        if genre_counts.get(name, None):
            genre_counts[name] += 1
        else:
            genre_counts[name] = 1
    genres = sorted([{"name": name, "count": count} for name, count in genre_counts.items()], key=lambda x: x["count"], reverse=True)
    result = {
        "count": int(response_tree.find("./hp:results_available", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text),
        "start": int(response_tree.find("./hp:results_start", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text),
        "shops": shops,
        "genres": genres
    }
    return result

@app.get("/local-gourmet/{id}")
async def get_detail(id):
    params = {
        "key": HOTPEPPER_API_KEY,
        "id": id
    }
    response = rq.get(GOURMET_API_URL, params=params).text
    response_tree = ET.fromstring(response)

    shop = response_tree.findall("./hp:shop", {"hp": "http://webservice.recruit.co.jp/HotPepper/"})[0]
    return {
            "id": shop.find("hp:id", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "name": shop.find("hp:name", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "address": shop.find("hp:address", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "opening_time": shop.find("hp:open", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "catch": shop.find("hp:catch", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "opening_time": shop.find("hp:open", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "image": shop.find("hp:photo/hp:pc/hp:l", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
            "genre": {
                "name": shop.find("hp:genre/hp:name", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text,
                "catch": shop.find("hp:genre/hp:catch", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text
            },
            "access": shop.find("hp:access", {"hp": "http://webservice.recruit.co.jp/HotPepper/"}).text
        }
