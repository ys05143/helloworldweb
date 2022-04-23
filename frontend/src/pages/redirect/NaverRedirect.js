import React from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import api from "../../api/api";

function NaverRedirect(){
    const location = useLocation();
    const navigate = useNavigate();

    //redirect Url에 포함된 인증code로 회원가입.
    function registerUserWithNaver(){
        if (!location.search){
            alert('로그인 실패');
            navigate("/");
        }
        else{
            const code = location.search.split('&')[0].split('=')[1];
            const state = location.search.split('&')[1].split('=')[1];

            api.registerUserWithNaver(code, state)
            .then( async (res) => {
                // SessionStorage에 jwt 저장
                window.sessionStorage.setItem("Auth", res);

                // 메인화면으로 이동
                navigate("/minihome");
            })
            .catch(e => {
                console.log(e);
                alert('회원가입 실패');
                navigate("/");
            })
        }
        
    } 

    React.useEffect(() => {
        registerUserWithNaver();
    }, []);
    

    return(
        <div>
            <h1>로그인 중...</h1>
        </div>
       
    )
}

export default NaverRedirect;