package speedy.go.speedygo.forumManagment;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import speedy.go.speedygo.common.PageResponse;
import speedy.go.speedygo.models.Comment;
import speedy.go.speedygo.models.Post;
import speedy.go.speedygo.models.Reaction;
import speedy.go.speedygo.stationManagement.service.ImageService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
@RestController
@RequestMapping("posts")
@RequiredArgsConstructor
@Tag(name = "Post")
public class PostController {
    private final PostService postService;
    private final ImageService imageService;

    @GetMapping("/uploads/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable("filename") String filename) {
        try {
            Path imagePath = Paths.get("uploads", filename);
            byte[] imageBytes = Files.readAllBytes(imagePath);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/savePost")
    public ResponseEntity<Long> savePost(
            @Valid @RequestBody PostRequest request,
            Authentication connectedUser
    ) throws IOException {
       /* String url = imageService.upload(request.file());
        request.mediaUrl(url);*/
        return  ResponseEntity.ok(postService.savePost(request, connectedUser));
    }

    @GetMapping("/{post-id}")
    public ResponseEntity<PostResponse> findPostById(
            @PathVariable("post-id") Long postId
    ){
        return ResponseEntity.ok(postService.findPostById(postId));
    }
    @PostMapping("/{postId}/duplicate")
    public ResponseEntity<Long> duplicatePost(@PathVariable Long postId, Authentication authentication) {
        try {
            Long duplicatedPostId = postService.duplicatePost(postId, authentication);
            return ResponseEntity.ok(duplicatedPostId);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();  // Return 404 if the post is not found
        }
    }

        @GetMapping
    public ResponseEntity<PageResponse<PostResponse>> findAllPosts(
        @RequestParam(name = "page",defaultValue = "0",required = false) int page,
        @RequestParam(name = "size",defaultValue = "10",required = false) int size,
         Authentication connectedUser
    ){
        return ResponseEntity.ok(postService.findAllPosts(page, size, connectedUser));
    }


    @GetMapping("/owner")
    public ResponseEntity<PageResponse<PostResponse>> findAllPostsByOwner(@RequestParam(name = "page",defaultValue = "0",required = false) int page,
                                                                          @RequestParam(name = "size",defaultValue = "10",required = false) int size, Authentication connectedUser) {
        return ResponseEntity.ok(postService.findAllPostsByOwner(page, size, connectedUser));
    }

    @PostMapping(value = "/picture/{post-id}",consumes = "multipart/form-data")
    public ResponseEntity<?> uploadPostCoverPicture(
            @PathVariable("post-id") Long postId,
           @Parameter()
           @RequestPart("file") MultipartFile file ,
            Authentication connectedUser
    ){
        postService.uploadPostPicture(file,connectedUser,postId);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/add/comment/{postId}")
    public ResponseEntity<?> makeCommentToPost(@RequestBody Comment comment,@PathVariable("postId") Long postId, Authentication connectedUser) {
        return ResponseEntity.ok(postService.makeCommentToPost(comment, postId, connectedUser));
    }

    @GetMapping("/getCommentsByPost/{postId}")
    public ResponseEntity<PageResponse<Comment>> findAllCommentForPost(@RequestParam(name = "page",defaultValue = "0",required = false) int page,
                                                                       @RequestParam(name = "size",defaultValue = "10",required = false) int size,
                                                                       @PathVariable("postId") Long postId) {
        return ResponseEntity.ok(postService.findAllCommentForPost(page, size, postId));
    }

    @DeleteMapping("/removeComment/{commentId}")
    public void deleteComment(@PathVariable("commentId") Long commentId,Authentication connectedUser){

            this.postService.deleteComment(commentId,connectedUser);
    }

    @PostMapping("/makeReactionForPost/{postId}")
    public void makeReactionForPost(@RequestBody Reaction reaction,@PathVariable("postId") Long postId,Authentication connectedUser){
        this.postService.makeReactionForPost(reaction, postId, connectedUser);
    }

    @DeleteMapping("/deleteReactionFromPost/{reactionId}")
    public void deleteReactionFromPost(@PathVariable("reactionId") Long reactionId,Authentication connectedUser){
        this.postService.deleteReactionFromPost(reactionId, connectedUser);
    }
    @DeleteMapping("/posts/{postId}/reactions")
    public ResponseEntity<Void> deleteReaction(@PathVariable Long postId, Authentication authentication) {
        postService.deleteReactionByPostAndUser(postId, authentication);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/findAllReactionForPost/{postId}")
    public ResponseEntity<PageResponse<Reaction>> findAllReactionForPost( @RequestParam(name = "page",defaultValue = "0",required = false) int page,
                                                                          @RequestParam(name = "size",defaultValue = "10",required = false) int size,
                                                                          @PathVariable("postId") Long postId){
        return ResponseEntity.ok(this.postService.findAllReactionForPost(page, size, postId));
    }

    @DeleteMapping("deletePostByOwner/{postId}")
    public void deletePostByOwner(@PathVariable("postId") Long postId,Authentication connectedUser){
        this.postService.deletePost(postId, connectedUser);
    }

    @PutMapping("updatePost/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable("postId") Long postId,@RequestBody Post updatedPost, Authentication connectedUser){
       return ResponseEntity.ok(this.postService.updatePost(postId, updatedPost, connectedUser));
    }

    @PutMapping("updateCommentForPost/{commentId}")
    public ResponseEntity<?> updateCommentForPost(@PathVariable("commentId") Long commentId,@RequestBody Comment commentUpdated,Authentication authentication){
        return ResponseEntity.ok(this.postService.updateCommentForPost(commentId, commentUpdated, authentication));
    }



}
