package speedy.go.speedygo.forumManagment;

import org.springframework.stereotype.Service;
import speedy.go.speedygo.dto.CommentDTO;
import speedy.go.speedygo.dto.ReactionDTO;
import speedy.go.speedygo.models.Comment;
import speedy.go.speedygo.models.Post;
import speedy.go.speedygo.models.Reaction;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostMapper {
    public Post toPost(PostRequest request) {
        return Post.builder()
                .id(request.id())
                .title(request.title())
                .content(request.content())
                .status(request.status())
                .visibility(request.visibility())
                .mediaUrl(request.mediaUrl())
                .build();
    }

    public PostResponse toPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .mediaUrl(post.getMediaUrl())
                .status(post.getStatus())
                .visibility(post.isVisibility())
                .createdDate(post.getCreatedDate())
                .reactions(reactionToReactionDto(post.getReactions()))
                .comments(commentsToCommentDto(post.getComments()))
                .sentimentScore(post.getSentimentScore())
                //.sentimentPictureScore(post.isSentimentPictureScore())
                .build();
    }
    private List<CommentDTO> commentsToCommentDto(List<Comment> comments) {
        return comments.stream()
                .map(comment -> CommentDTO.builder()
                        .id(comment.getId())
                        .content(comment.getContent())
                        .userId(comment.getUser().getId())
                        .sentimentScore(comment.getSentimentScore())
                        //.createdDate(comment.getCreatedDate().toString())
                        .build())
                .collect(Collectors.toList());
    }


    private List<ReactionDTO> reactionToReactionDto(List<Reaction> reactions) {
        return reactions.stream()
                .map(reaction -> ReactionDTO.builder()
                        .id(reaction.getId())
                        .typeReaction(reaction.getTypeReaction().toString())
                        .userId(reaction.getUser().getId())
                        .build())
                .collect(Collectors.toList());
    }

}
