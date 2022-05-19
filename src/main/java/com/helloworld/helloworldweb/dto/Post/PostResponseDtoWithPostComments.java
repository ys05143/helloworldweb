package com.helloworld.helloworldweb.dto.Post;

import com.helloworld.helloworldweb.domain.*;
import com.helloworld.helloworldweb.dto.PostComment.PostCommentResponseDto;
import com.helloworld.helloworldweb.dto.User.UserResponseDto;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class PostResponseDtoWithPostComments {
    private Long id;
    private UserResponseDto userResponseDto;
    private Category category;
    private String title;
    private String content;
    private String tags;
    private String createdTime;
    private String modifiedTime;
    private List<PostCommentResponseDto> postCommentResponseDtos = new ArrayList<>();
    private List<PostImageResponseDto> postImageResponseDtos = new ArrayList<>();
    private boolean IsOwner;
    private boolean IsSolved;

    // 한 게시물 전체를 표현하기 위해 필요한 정보
    public PostResponseDtoWithPostComments(Post post, User caller) {
        this.id = post.getId();
        this.userResponseDto = new UserResponseDto(post.getUser(), caller);
        this.category = post.getCategory();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.tags = post.getTags();
        this.createdTime = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(post.getCreatedTime());
        this.modifiedTime = post.getModifiedTime() != null ? DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(post.getModifiedTime()) : null;
        this.postCommentResponseDtos = postCommentsToResponseDtos(post.getPostComments(),caller);
        this.postImageResponseDtos = postImageResponseDtos(post.getPostImages());
        this.IsOwner = checkIsOwner(post.getUser(),caller);
        this.IsSolved = post.isSolved();
    }

    //post의 PostComment List를 PostCommentResponseDto의 List로 바꿔주는함수.
    private List<PostCommentResponseDto> postCommentsToResponseDtos(List<PostComment> postComments)
    {
        List<PostCommentResponseDto> responseDtos = new ArrayList<>();
        for( PostComment p : postComments)
        {
            responseDtos.add(new PostCommentResponseDto(p));
        }
        return responseDtos;
    }

    private List<PostCommentResponseDto> postCommentsToResponseDtos(List<PostComment> postComments, User caller)
    {
        List<PostCommentResponseDto> responseDtos = new ArrayList<>();
        for( PostComment p : postComments)
        {
            responseDtos.add(new PostCommentResponseDto(p,caller));
        }
        return responseDtos;
    }

    private List<PostImageResponseDto> postImageResponseDtos(List<PostImage> postImages) {
        List<PostImageResponseDto> responseDtos = new ArrayList<>();
        for( PostImage postImage : postImages) {
            responseDtos.add(new PostImageResponseDto(postImage));
        }
        return responseDtos;
    }

    private boolean checkIsOwner(User owner, User caller){
        return owner.getId() == caller.getId();
    }
}
