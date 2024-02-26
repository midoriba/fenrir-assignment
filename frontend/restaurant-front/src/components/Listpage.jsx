import React, { useState, useEffect } from "react";
import axios from "axios"
import { useSearchParams, Link} from "react-router-dom";
import "../css/main.css"

const GenreCard = (props) => {
    const [isSelected, setIsSelected] = useState(true)
    const name = props.genre.name
    const onButtonClicked = props.onButtonClicked

    const handleClick = () => {
        setIsSelected((prev) => {
            onButtonClicked(name, !prev)
            return !prev
        })
    }

    return (
        <div className={isSelected ? "genre-card genre-card-selected" : "genre-card"} onClick={handleClick}>
            <p>{name}</p>
        </div>
    )
}

const GenreSelectButton = ({genres, onSelectedGenreChange}) => {
    const [isActive, setIsActive] = useState(false)
    
    const handleClick = () => {
        setIsActive((prev) => !prev)
        console.log('genre clicked')
    }

    const onButtonClicked = (name, isSelected) => {
        onSelectedGenreChange(name, isSelected)
    }
    
    return (
        <div className="genre-select">
            <div className={isActive ? "genre-list" : "genre-list invisible"}>
                {genres.map((genre) => {
                    console.log(genre.name)    
                    return <GenreCard genre={genre} key={genre.name} onButtonClicked={onButtonClicked} />
                })}
            </div>
            <div className="genre-select-button" onClick={handleClick}>
                <p>絞</p>
            </div>
        </div>
    )
}

const ShopCard = (props) => {
    const shop = props.shop
    console.log(JSON.stringify(props.shop))
    return (
        <div className="shop-card">
            <p className="shop-name">{shop.name}</p>
            <img className="shop-image" src={shop.image} alt={shop.name+'の画像'}/>
            <p className="shop-opening-time">営業時間：{shop.opening_time}</p>
            <p className="shop-address">アクセス：{shop.access}</p>
            <Link to={`/detail/${shop.id}`}>詳細</Link>
        </div>
    )
}

const ListPage = () => {
    const [shops, setShops] = useState([])
    const [genres, setGenres] = useState([])
    const [genreVisibility, setGenreVisibility] = useState({"all": false})
    const [searchParams] = useSearchParams()
    
    useEffect(() => {
        console.log(searchParams)
        console.log(`取った ${searchParams.get("latitude")}, ${searchParams.get("longitude")}`)
        searchGourmetByPosition(searchParams.get("latitude"), searchParams.get("longitude"), searchParams.get("range"))
    }, [])

    const searchGourmetByPosition = (latitude, longitude, range) => {
        console.log("検索実行")
        axios.get("http://localhost:8000/local-gourmet", {
            params: {
                latitude: latitude,
                longitude: longitude,
                search_range: range
            }
        })
        .then((response) => {
            console.log(JSON.stringify(response.data.shops))
            setShops(response.data.shops)
            setGenres(response.data.genres)
            setGenreVisibility(() => {
                const res = {}
                response.data.genres.map((genre) => res[genre.name] = true)
                return res
            })
        })
    }

    const onSelectedGenreChange = (genreName, isSelected) => {
        setGenreVisibility((prev) => {
            const newState = {...prev, [genreName]: isSelected}
            if (Object.values(newState).includes(true)) {
                newState.all = false
            } else {
                newState.all = true
            }
            return newState
        })
    }
    
    return (
        <div>
            { shops.map((shop) => {
                console.log(shop.genre)
                if (genreVisibility.all || genreVisibility[shop.genre.name]) {
                    return <ShopCard shop={shop} key={shop.name}/>
                }
            }) }
            <GenreSelectButton genres={genres} onSelectedGenreChange={onSelectedGenreChange}/>
        </div>
    )
}

export default ListPage;