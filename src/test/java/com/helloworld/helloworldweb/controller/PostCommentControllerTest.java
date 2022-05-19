package com.helloworld.helloworldweb.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.helloworld.helloworldweb.domain.Category;
import com.helloworld.helloworldweb.domain.Post;
import com.helloworld.helloworldweb.domain.Role;
import com.helloworld.helloworldweb.domain.User;
import com.helloworld.helloworldweb.dto.PostComment.PostCommentRequestDto;
import com.helloworld.helloworldweb.jwt.JwtTokenProvider;
import com.helloworld.helloworldweb.repository.PostRepository;
import com.helloworld.helloworldweb.repository.UserRepository;
import com.helloworld.helloworldweb.service.PostCommentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class PostCommentControllerTest {

    @Autowired
    JwtTokenProvider jwtTokenProvider;
    @Autowired
    PostCommentService postCommentService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PostRepository postRepository;
    @Autowired
    ObjectMapper objectMapper;
    @Autowired
    MockMvc mvc;

    String testEmail = "test@email.com";

//    @BeforeEach
//    void registerUser() {
//        User user = User.builder()
//                .email(testEmail)
//                .repo_url(" ")
//                .profileUrl(" ")
//                .nickName(testEmail)
//                .role(Role.USER)
//                .posts(new ArrayList<>())
//                .build();
//        userRepository.save(user);
//        userRepository.flush();
//
//    }

    @Test
    void registerPostCommentTest() throws Exception
    {
        //given
        User user = User.builder()
                .email(testEmail)
                .repo_url(" ")
                .profileUrl(" ")
                .nickName(testEmail)
                .role(Role.USER)
                .posts(new ArrayList<>())
                .subComments(new ArrayList<>())
                .build();

        Post post = Post.builder()
                .postComments(new ArrayList<>())
                .title("hello")
                .content("i dont know!!!")
                .tags("java")
                .category(Category.QNA)
                .build();

        post.updateUser(user);
        User savedUser = userRepository.save(user);
        Post savedPost = postRepository.save(post);

        String accessToken = jwtTokenProvider.createToken(savedUser.getEmail(),Role.USER);

        PostCommentRequestDto requestDto = new PostCommentRequestDto(savedPost.getId(),"123123");

        String body = objectMapper.writeValueAsString(requestDto);

        //when

        mvc.perform(
                post("/api/postcomment")
                        .header("Auth",accessToken)
                        .content(body)
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding(StandardCharsets.UTF_8))
        //then
                .andExpect(status().isOk());



    }


}
