import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/main.css"

const SearchPage = () => {
    const navigate = useNavigate()
    const [searchCondition, setSearchCondition] = useState({range: 1})

    const generateQueryParameters = (parameters) => {
        if (Object.keys(parameters).length > 0){
            return "&"+Object.entries(parameters).map(([key, value]) => `${key}=${value}&`).join('&')
        } else {
            return ""
        }
    }

    const onSubmit = () => {
        getPosition()
    }

    const onGetPositionSuccess = (position) => {
        console.log('位置情報取得成功')
        navigate(`/result?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}${generateQueryParameters(searchCondition)}`)
    }

    const onGetPositionError = (position) => {
        console.log('位置情報取得エラー')
    } 

    const getPosition = () => {
        if (!navigator.geolocation) {
            console.log('位置情報取得不可');
        } else {
            navigator.geolocation.getCurrentPosition(onGetPositionSuccess, onGetPositionError);
        }
    }

    const rangeSelectItems = [
        {tag: "300m", value: 1},
        {tag: "500m", value: 2},
        {tag: "1000m", value: 3},
        {tag: "2000m", value: 4},
        {tag: "3000m", value: 5}
    ]

    const onRangeChange = (event) => {
        setSearchCondition((prev) => {
            return {...prev, range: event.target.value}
        })
    }

    return (
        <div className="search-box">
            <p className="search-heading">近くのレストランを見つけませんか</p>
            <div className="search-submit-button" onClick={onSubmit}><p>検索</p></div>
            <div className="search-conditions">
                <select onChange={onRangeChange}>
                    {rangeSelectItems.map((item) => <option value={item.value} key={item.value}>{item.tag}</option>)}
                </select>
            </div>
        </div>
    );
}

export default SearchPage;