import React, {useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router";

export default function GithubRedirect(){
    const navigate = useNavigate()
    const cid = "105e0b50eefc27b4dc81";
    const cpwd = "ce4d0a93a257529e78a8804f322ca629b1d7cba6"

    useEffect(()=>
    {
        let code = window.location.search.split("code=")[1];

        axios({
            url:"http://localhost:8080/user/register/github",
            params:{"code":code},
            method:"POST"
        }).then(res=>{
            console.log(res)
            let token = res.headers.auth
            // SessionStorage에 jwt 저장
            window.sessionStorage.setItem("Auth",token);
            // 메인화면으로 이동
            navigate("/")

             }).catch(e=>{
            console.log(e);
        })
    })

    return(
        <div>
            로그인 중입니다.
        </div>
    );
}