import { useState, useEffect} from "react";
import axios from "axios"
import { useParams } from "react-router-dom"

const DetailPage = () => {
    const {id} = useParams()
    const [shop, setShop] = useState({})

    useEffect(() => {
        searchGourmetById(id)
    }, [])

    const searchGourmetById = (latitude, longitude, range) => {
        console.log("詳細取得")
        axios.get(`http://localhost:8000/local-gourmet/${id}`)
        .then((response) => {
            console.log(JSON.stringify(response.data))
            setShop(response.data)
        })
    }

    return (
        <div className="shop-detail">
            <h2 className="shop-name">{shop.name}</h2>
            <img className="shop-image" src={shop.image} alt={shop.name+'の画像'}/>
            <p className="shop-opening-time">営業時間：{shop.opening_time}</p>
            <p className="shop-address">住所：{shop.address}</p>
        </div>
    )
}

export default DetailPage;