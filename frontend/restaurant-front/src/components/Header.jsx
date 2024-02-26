import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate('/')
    }
    return (
        <div className="header" onClick={handleClick}>
            <h1>グルメサーチ</h1>
        </div>
    )
}

export default Header