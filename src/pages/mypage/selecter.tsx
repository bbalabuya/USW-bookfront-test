import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./selecter.css";
import { Link } from "react-router-dom";


const Selecter=()=>{
    return(
        <div className="box-container">
            <div className="title">마이페이지</div>
            <div className="box-item"></div>
            <div className="line"/>
            <div className="category-box">
                <Link to="/mypage/my_info">내 정보</Link>
                <Link to="/mypage/selling_book">판매중인 상품</Link>
                <Link to="/mypage/bought">구매한 상품</Link>
                <Link to="/mypage/like">내가 찜한 목록</Link>
            </div>
        </div>
    )
}
export default Selecter;