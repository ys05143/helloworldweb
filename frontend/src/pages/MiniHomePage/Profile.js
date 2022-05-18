import React from "react";
import { useNavigate } from 'react-router';
import {  EditOutlined, LocationOn as LocationOnIcon, Edit as EditIcon  } from '@mui/icons-material';
import { Box ,Typography ,Badge ,IconButton} from '@mui/material';

function Profile({ userInfo }){

    const navigate = useNavigate();

    return(
        <Box sx={{flex: 1, marginTop: 5, textAlign: 'center'}}>
            <Box 
                display="flex" 
                width={300}
                alignItems="center"
                justifyContent="center"
                flex={1}
            >
                <Box sx={{width: 200, height: 200, borderRadius: 100, overflow: 'hidden', mb: 5}} >
                    <img src={userInfo.profileUrl} width={200} height={200} alt={'프로필 사진'}></img>
                </Box>
            </Box>
            <div style={{ padding: 7, display: 'flex', justifyContent: 'center' }} onClick={()=>{ if(userInfo.isOwner) navigate("/makeusername")}}>
                <Typography sx={{ fontWeight: 'bold' }}>{userInfo.userName}</Typography>
                {userInfo.isOwner && <EditOutlined sx={{ ml: 1 }}/>}
            </div>
            <Box sx={{ display: 'flex' , flexDirection: 'row' ,justifyContent: 'center', mt: 3 }}>

                <LocationOnIcon sx={{ color: 'gray'}}/>
                <Typography sx={{ color: 'gray' ,ml: 2 }}>서울, 대한민국</Typography>
            </Box>
            <Box sx={{ m: 2 ,display: 'flex' , flexDirection: 'row' ,justifyContent: 'center' }}>
                <Badge sx={{ m: 1 ,backgroundColor: 'green' ,p: 0.5 ,color: 'white'}}>Python</Badge>
                <Badge sx={{ m: 1 ,backgroundColor: 'orange' ,p: 0.5 ,color: 'white' }}>Java</Badge>
            </Box>
            {/* <h5>{userInfo.userName}의 블로그 입니다^^(고정)</h5> */}
        </Box>      
    )
}

export default Profile;