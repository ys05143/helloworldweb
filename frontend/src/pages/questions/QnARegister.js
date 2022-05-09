import React from 'react';
import { Box , Typography ,Button 
        ,Card ,TextField , Container
        ,IconButton
} from '@mui/material';
import { styled } from '@mui/material';
import { Code as CodeIcon } from '@mui/icons-material';
import CustomAppBar from '../../component/appbar/CustomAppBar';
import { useNavigate } from 'react-router';
import api from '../../api/api';

export default function(){
    const navigate = useNavigate();
    const [tags,setTags] = React.useState("");
    const [buttonTags,setButtonTags] = React.useState([]);
    const [title,setTitle] = React.useState("");
    const [content,setContent] = React.useState("");

    // 입력된 태그들 입력창 앞에 정렬하여 보여줌.
    const renderTags = () => {
        return(
            <Box sx={{ flexDirection: 'row', display: 'flex' }}>
                {
                    buttonTags.map( tag => {
                        return(
                            <Button sx={{ whiteSpace: 'nowrap' ,textTransform: 'none' }}>{tag}</Button>
                        )
                    })
                }
            </Box>
        );
    }
    // 태그에 글자 입력될때마다 호출하여 확인.
    const changeTags = (value) => {

        // 새로운 태그가 입력되었을 때 입력창 앞에 추가
        if( value.endsWith(',') ){
            let newTag = value.split(',')[0];
            let tmp = buttonTags;
            tmp.push(newTag);
            setButtonTags(tmp);
            setTags("");
        } else {
            setTags(value);
        }

    }

    // 본문 미리보기 
    const renderContentPreview = () => {
        let tmp = content.split("```");
        return(
            
                tmp.map( (text,index) => {
                    // 본문
                    if( index % 2 == 0){
                        return(
                            <pre style={{ fontFamily: "inherit" ,verticalAlign: 'middle' }}>
                                {renderStrongText(text)}
                            </pre>
                        );
                    }
                    // 코드
                    else {
                        text = text.replace('\n','');
                        return(
                            <Typography key={index} sx={{ p: 2 ,backgroundColor: 'rgb(240,240,240)' }}>
                                <pre style={{ fontFamily: 'inherit' }}>{text}</pre>
                            </Typography>
                        );
                    }
                })
                
        );

    }
    const renderStrongText = (value) => {
        let text = value;
        const regExp = /\*\*.{0,}\*\*/m;
        let s = [];

        // **text** 모두 찾을때까지
        while( text && text.length > 0 ){
            if( regExp.test(text) ){
                const startIndex = text.search(regExp);
                // normal text
                s.push({ "type" : "normal" , "text" : text.substring(0,startIndex) });
                let restText = text.substring(startIndex+2,text.length);
                const finIndex = restText.search(/\*\*/); 
                // // strong text
                s.push({ "type" : "strong", "text" : restText.substring(0,finIndex) })
                text = restText.substring(finIndex+2,restText.length);
            }
            else {
                s.push({ "type": "normal", "text" : text });
                text = "";
            }
        }
        console.log(s);
        return(
            s.map( item => {
                if( item.type === "normal") 
                    return <pre style={{ fontFamily: 'inherit' }}>{item.text}</pre>
                else if( item.type === "strong")
                    return <b style={{ fontFamily: 'inherit' ,fontWeight: 'bold'}}>{item.text}</b>
                    
            })
        )

    }

    function handleTextOptions(option){
        const selectedText = window.getSelection().toString();
        if( option === "code"){

            if( selectedText.length > 0 ){
                let s = content.split(selectedText);
                s[0] += "```\n";
                s[1] += "\n```\n";
                setContent( s[0] + selectedText + s[1] );
            }
            else
                setContent(content + "```\n 코드를 입력하세요. \n```\n");
        }
    }

    return(
        <Box sx={{ backgroundColor: 'rgb(240,240,240)'}}>
            
            <CustomAppBar />

            <Typography variant='h4' sx={{ p : 2 , pt: 5 }}>
                질문 작성하기
            </Typography>

            <Box sx={{ display: 'flex' , flexDirection: 'row'}}>
                <Card sx={{ m: 2 ,flex: 3 }}>
                    <Typography sx={{ p: 2 ,fontWeight: 'bold' }}>
                        제목
                    </Typography>
                    <Typography variant='body2' sx={{ paddingLeft : 2 ,fontSize: 12 }}>
                        구체적으로 말하고 다른 사람에게 질문을 하고 있다고 상상해 보세요.                    
                    </Typography>
                    <TextField 
                        sx={{ width: '90%' , m: 2 }}
                        size='small'
                        value={title}
                        onChange={ value => setTitle(value.target.value) }
                        placeholder='e.g. 리액트 질문'
                    />

                    <Typography sx={{ p: 2 ,fontWeight: 'bold' }}>
                        내용
                    </Typography>
                    <Typography variant='body2' sx={{ paddingLeft : 2 ,fontSize: 12 }}>
                        누군가가 귀하의 질문에 대답하는 데 필요한 모든 정보를 포함하세요.
                    </Typography>

                    <Box sx={{ width: '90%' , ml: 2 ,p: 2 ,border: 1 ,borderColor: 'lightgray' ,display: 'flex' ,flexDirection: 'row' ,height: 20 ,mt: 2 }}>
                        <IconButton title="코드 샘플"  onClick={() => handleTextOptions("strong")}>
                            <Typography sx={{ color: 'black' ,fontWeight: 'bold' }}>B</Typography>
                        </IconButton>
                        <IconButton title="코드 샘플"  onClick={() => handleTextOptions("code")}>
                            <CodeIcon sx={{ color: 'black' }}/>
                        </IconButton>
                    </Box>
                    <StyledForm>
                    <TextArea
                        sx={{ width: '90%' ,m: 2 ,height: 300 , p : 2 ,mt: 0 ,borderColor: 'lightgray' }}
                        value={content}
                        onChange={ event => setContent(event.target.value) }
                        size='small'
                    />
                    </StyledForm>

                    <Container>
                        {renderContentPreview()}
                    </Container>


                    <Typography sx={{ p: 2 ,fontWeight: 'bold' }}>
                        태그
                    </Typography>
                    <Typography variant='body2' sx={{ paddingLeft : 2 }}>
                        질문의 내용을 설명하는 최대 5개의 태그를 추가하세요.
                    </Typography>
                    <TextField 
                        sx={{ width: '90%' ,m:2 }}
                        value={tags}
                        onChange ={ (value) => { changeTags(value.target.value) } }
                        InputProps={{ startAdornment: renderTags() }}
                        size='small'
                        placeholder='e.g. React'
                    >
                    </TextField>

                    <Button 
                        variant='contained' 
                        sx={{ m: 2 }}
                        onClick={() => { 
                            let tmp = ""
                            buttonTags.map( tag => {
                                tmp += tag + ','
                            },[]);
                            if( api.registerQnA({ title: title ,content: content , type: "QNA" ,tags:  tmp }) )
                                navigate('/');
                        }}
                    >
                        작성하기
                    </Button>
                </Card>

                <Card sx={{ m:2 ,flex: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 22 ,m: 2 ,justifyContent: 'center', display: 'flex' }}>Tips</Typography>
                   
                   {
                       tipContents.map( tip => {
                           return(
                                <Card sx={{ m: 2 }}>
                                    <Container sx={{ backgroundColor: 'rgb(240,240,240)' ,p: 2 }}>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: 17 }}>{tip.header}</Typography>
                                    </Container>
                                    <Typography sx={{ m:2 }}>
                                        <pre style={{ fontFamily: 'inherit'}}>
                                            {tip.body}
                                        </pre>
                                    </Typography>
                                </Card>
                           );
                       })
                   }

                    
                </Card>
            </Box>

        </Box>
    );
}

const tipContents = [
    {
        header: '코드작성( ``` )',
        body: '```\nyour text here\n```'
    } ,
    {
        header: '태그작성( , )',
        body: 'react,react native,javascript'
    } ,
]

const TextArea = styled('textarea')({  

});
const StyledForm = styled('form')({
    flexGrow: 1 ,
});