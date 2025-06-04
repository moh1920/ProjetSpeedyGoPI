package speedy.go.speedygo.forumManagment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import speedy.go.speedygo.PromotionEventManagement.LoyaltyProgramRepository;
import speedy.go.speedygo.common.PageResponse;
import speedy.go.speedygo.email.EmailService;
import speedy.go.speedygo.email.EmailTemplateName;
import speedy.go.speedygo.file.FileStorageService;
import speedy.go.speedygo.googleAnalyseSentimentConfig.GoogleAnalyser;
import speedy.go.speedygo.models.Comment;
import speedy.go.speedygo.models.LoyaltyProgram;
import speedy.go.speedygo.models.Post;
import speedy.go.speedygo.models.Reaction;
import speedy.go.speedygo.stationManagement.service.ImageService;
import speedy.go.speedygo.user.User;
import speedy.go.speedygo.user.UserRepository;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final FileStorageService fileStorageService;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ReactionRepository reactionRepository;
    private final LoyaltyProgramRepository loyaltyProgramRepository;
    private final EmailService emailService;
    private final GoogleAnalyser googleAnalyser;
    private final ImageService imageService;
    private static final Logger logger = LoggerFactory.getLogger(PostService.class);
    public Long savePost(PostRequest request, Authentication authentication) throws IOException {
        User user= this.userRepository.findById(authentication.getName())
                .orElseThrow(()->new EntityNotFoundException("User not exist in the data base"));
        Post post = postMapper.toPost(request);
        post.setSenderPost(user);
       // String url = imageService.upload(request.file());
       // post.setMediaUrl(url);
        return postRepository.save(post).getId();
    }

    public Long duplicatePost(Long postId, Authentication authentication) {
        Post originalPost = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found in the database"));

        User user = this.userRepository.findById(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found in the database"));

        Post copiedPost = new Post();
        copiedPost.setTitle(originalPost.getTitle());
        copiedPost.setContent(originalPost.getContent());
        copiedPost.setVisibility(originalPost.isVisibility());
        copiedPost.setStatus(originalPost.getStatus());
        copiedPost.setSenderPost(user);
        copiedPost.setMediaUrl(originalPost.getMediaUrl());


        return postRepository.save(copiedPost).getId();
    }


    public PostResponse findPostById(Long postId){
        return postRepository.findById(postId)
                .map(postMapper::toPostResponse)
                .orElseThrow(()->new EntityNotFoundException("No post found with ID : "+postId));
    }

    public PageResponse<PostResponse> findAllPosts(int page, int size, Authentication connectedUser){
        Pageable pageable= PageRequest.of(page,size, Sort.by("createdDate").descending());
        User user= this.userRepository.findById(connectedUser.getName())
                .orElseThrow(()->new EntityNotFoundException("User not exist in the data base"));
        Page<Post> posts=postRepository.findAllDisplayablePosts(pageable, user.getId());
        List<PostResponse> postResponses=posts.stream()
                .map(postMapper::toPostResponse)
                .toList();
        return new PageResponse<>(
                postResponses,
                posts.getNumber(),
                posts.getSize(),
                posts.getTotalElements(),
                posts.getTotalPages(),
                posts.isFirst(),
                posts.isLast()
        );

    }

    public PageResponse<PostResponse> findAllPostsByOwner(int page,int size,Authentication connectedUser){
        Pageable pageable=PageRequest.of(page,size,Sort.by("createdDate").descending());
        Page<Post> posts=postRepository.findAll(PostSpecification.withOwnerId(connectedUser.getName()),pageable);
        List<PostResponse> postResponses=posts.stream()
                .map(postMapper::toPostResponse)
                .toList();
        return new PageResponse<>(
                postResponses,
                posts.getNumber(),
                posts.getSize(),
                posts.getTotalElements(),
                posts.getTotalPages(),
                posts.isFirst(),
                posts.isLast()
        );
    }

    public void uploadPostPicture(MultipartFile file,Authentication connectedUser,Long postId){
        Post post=postRepository.findById(postId)
                .orElseThrow(()->new EntityNotFoundException("No post found with ID : "+postId));
        var profilePicture=fileStorageService.saveFile(file, connectedUser.getName());
        post.setMediaUrl(profilePicture);
        postRepository.save(post);
    }

    public Long makeCommentToPost(Comment comment, Long postId, Authentication connectedUser){
        Post post = postRepository.findById(postId)
                .orElseThrow(()->new EntityNotFoundException("No post found with this id : "+postId));
            User user= this.userRepository.findById(connectedUser.getName())
                    .orElseThrow(()->new EntityNotFoundException("User not exist in the data base"));
            comment.setUser(user);
            comment.setPostComment(post);

        return commentRepository.save(comment).getId();
    }

    public PageResponse<Comment> findAllCommentForPost(int page, int size, Long postId){
        Pageable pageable=PageRequest.of(page,size,Sort.by("createdDate").descending());
        Page<Comment> comments=commentRepository.findByPostId(pageable,postId);
        List<Comment> commentList=comments.stream().toList();

        return new PageResponse<>(
                commentList,
                comments.getNumber(),
                comments.getSize(),
                comments.getTotalElements(),
                comments.getTotalPages(),
                comments.isFirst(),
                comments.isLast()
        );
    }

    public void deleteComment(Long commentId,Authentication connectedUser){
        Comment comment=this.commentRepository.findById(commentId)
                .orElseThrow(()->new EntityNotFoundException("Comment not found"));
        if (!connectedUser.getName().equals(comment.getUser().getId())){
            throw new RuntimeException("You can remove only your own comments");
        }else {
            this.commentRepository.deleteById(commentId);
        }
    }

    public void makeReactionForPost(Reaction reaction,Long postId,Authentication connectedUser){
        Post post = postRepository.findById(postId)
                .orElseThrow(()->new EntityNotFoundException("No post found with this id : "+postId));
        User user= this.userRepository.findById(connectedUser.getName())
                .orElseThrow(()->new EntityNotFoundException("User not exist in the data base"));
        reaction.setUser(user);

        List<Reaction> reactions=post.getReactions();
        reactions.add(reaction);
        post.setReactions(reactions);

        postRepository.save(post);
    }

    public void deleteReactionFromPost(Long reactionId,Authentication connectedUser){
        this.reactionRepository.deleteReactionByPostWithUserOwner(reactionId,connectedUser.getName());
    }

    public void deleteReactionByPostAndUser(Long postId, Authentication username) {
        Optional<Post> postOpt = postRepository.findById(postId);

        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            Optional<Reaction> reactionOpt = reactionRepository.findReactionFromPost(postId, username.getName());

            if (reactionOpt.isPresent()) {
                Reaction reaction = reactionOpt.get();
                post.getReactions().remove(reaction);
                postRepository.save(post);
                reactionRepository.delete(reaction);
            } else {
                throw new EntityNotFoundException("Reaction not found");
            }
        } else {
            throw new EntityNotFoundException("Post not found");
        }
    }



    public PageResponse<Reaction> findAllReactionForPost(int page, int size, Long postId){
        Pageable pageable=PageRequest.of(page,size,Sort.by("createdDate").descending());
        Page<Reaction> reactions=reactionRepository.findAllDisplayableReactions(pageable,postId);
        return new PageResponse<>(
                reactions.stream().toList(),
                reactions.getNumber(),
                reactions.getSize(),
                reactions.getTotalElements(),
                reactions.getTotalPages(),
                reactions.isFirst(),
                reactions.isLast()
        );
    }


    @Transactional
    public void deletePost(Long postId, Authentication connectedUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post non trouvé"));

        if (!post.getSenderPost().getId().equals(connectedUser.getName())) {
            throw new RuntimeException("Vous n'êtes pas le propriétaire de ce post");
        }

        List<Reaction> reactionsToRemove = new ArrayList<>(post.getReactions());
        for (Reaction reaction : reactionsToRemove) {
            post.getReactions().remove(reaction);
            reactionRepository.delete(reaction);
        }

        List<Comment> commentsToRemove = new ArrayList<>(post.getComments());
        for (Comment comment : commentsToRemove) {
            post.getComments().remove(comment);
            commentRepository.delete(comment);
        }

        postRepository.save(post);
        postRepository.delete(post);
    }

    public Post updatePost(Long postId,Post updatedPost,Authentication connectedUser){
        Post post = postRepository.findById(postId)
                .orElseThrow(()->new EntityNotFoundException("No post found with this id : "+postId));
        if (post.getSenderPost().getId().equals(connectedUser.getName())){

            post.setMediaUrl(updatedPost.getMediaUrl());
            post.setTitle(updatedPost.getTitle());
            post.setContent(updatedPost.getContent());
            post.setStatus(updatedPost.getStatus());
            post.setVisibility(updatedPost.isVisibility());

            return this.postRepository.save(post);
        }else
            throw new RuntimeException("You can only updated your own posts");

    }

    public Comment updateCommentForPost(Long commentId,Comment commentUpdated,Authentication authentication){
        Comment comment=this.commentRepository.findById(commentId)
                .orElseThrow(()->new EntityNotFoundException("Comment Not found"));

        if (comment.getUser().getId().equals(authentication.getName())){
            comment.setContent(commentUpdated.getContent());
            return this.commentRepository.save(comment);
        }else
            throw new RuntimeException("You can only update your own comment ");
    }


    @Scheduled(cron = "0 0 1 * * ?")
    @Transactional
    public void rewardTopForumUsers() throws MessagingException {
        List<String> topUsersEmails = postRepository.findTopForumContributors();
        List<User> users = userRepository.findUsersByEmails(topUsersEmails);

        for (User user : users) {
            String promoCode = generatePromoCode();

            LoyaltyProgram loyaltyProgram = new LoyaltyProgram();
            loyaltyProgram.setPartnerLoyaltyProgram(user);
            loyaltyProgram.setUsersWhoWonPoints(List.of(user));
            loyaltyProgram.setProgramName("Forum Star Reward");
            loyaltyProgram.setDescription("Merci pour votre contribution active au forum !");
            loyaltyProgram.setRewardType("Gift");
            loyaltyProgram.setPointsAccumulated(50); // ou une autre logique
            loyaltyProgram.setMembershipCondition("Top contributor of the day");
            loyaltyProgram.setActive(true);
            loyaltyProgram.setPromoCode(promoCode);
            loyaltyProgram.setStartDate(new Date());
            loyaltyProgram.setEndDate(Date.from(Instant.now().plus(7, ChronoUnit.DAYS)));

            loyaltyProgramRepository.save(loyaltyProgram);

            emailService.sendEmail(
                    user.getEmail(),
                    user.getFirstName() + " " + user.getLastName(),
                    EmailTemplateName.ACTIVATE_ACCOUNT,
                    null,
                    "Merci pour vos contributions sur notre forum ! Voici votre récompense : " + promoCode
            );
        }
    }
    private String generatePromoCode() {
        return "FORUM-" + UUID.randomUUID().toString().substring(0, 8);
    }


    @Scheduled(cron = "0 0 1 * * ?")
   // @Scheduled(fixedRate = 30000)
    @Transactional
    public void AnalyseSentimentForPostAndComments() throws Exception {
        int page = 0;
        int pageSize = 100;
        boolean hasNextPage = true;

        while (hasNextPage) {
            Pageable pageable = PageRequest.of(page, pageSize);
            Page<Post> posts = this.postRepository.findAll(pageable);

            if (posts.isEmpty()) {
                break;
            }

            List<Post> postsToUpdate = new ArrayList<>();
            List<Comment> commentsToUpdate = new ArrayList<>();

            for (Post post : posts) {
                try {
                    String postSentiment = googleAnalyser.analyzeSentiment(post.getTitle() + " " + post.getContent());
                    String postLabel = extractSentimentLabel(postSentiment);
                    post.setSentimentScore(postLabel);
                    postsToUpdate.add(post);

                    for (Comment comment : post.getComments()) {
                        try {
                            String commentSentiment = googleAnalyser.analyzeSentiment(comment.getContent());
                            String commentLabel = extractSentimentLabel(commentSentiment);
                            comment.setSentimentScore(commentLabel); // Save only the label (POSITIVE/NEGATIVE)
                            commentsToUpdate.add(comment);
                        } catch (Exception e) {
                            logger.error("Failed to analyze sentiment for comment with ID " + comment.getId(), e);
                        }
                    }
                } catch (Exception e) {
                    logger.error("Failed to analyze sentiment for post with ID " + post.getId(), e);
                }
            }

            this.postRepository.saveAll(postsToUpdate);
            this.commentRepository.saveAll(commentsToUpdate);

            page++;
        }
    }

    private String extractSentimentLabel(String sentimentResult) {
        if (sentimentResult == null || sentimentResult.trim().isEmpty()) {
            logger.warn("Received empty sentiment result");
            return "UNKNOWN";
        }

        if (!sentimentResult.trim().startsWith("{") && !sentimentResult.trim().startsWith("[")) {
            logger.warn("Received non-JSON sentiment result: " + sentimentResult);
            return "UNKNOWN";
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode sentimentNode = objectMapper.readTree(sentimentResult);

            if (sentimentNode.isArray() && sentimentNode.size() > 0) {
                JsonNode labelNode = sentimentNode.get(0).get(0).get("label");

                if (labelNode != null) {
                    return labelNode.asText();
                } else {
                    logger.warn("Label not found in sentiment result: " + sentimentResult);
                    return "UNKNOWN";
                }
            } else {
                logger.warn("Sentiment result is not an array or is empty: " + sentimentResult);
                return "UNKNOWN";
            }
        } catch (Exception e) {
            logger.error("Failed to parse sentiment result", e);
            return "UNKNOWN";
        }
    }






    //@Scheduled(cron = "0 0 1 * * ?")
   /* @Scheduled(fixedRate = 30000)
    public void analysePicture() throws Exception {
        List<Post> posts= this.postRepository.findAll();
        for (Post post:posts){
           boolean note= this.googleAnalyser.analyzeImage(post.getMediaUrl());
            Post postfounded=this.postRepository.findById(post.getId()).orElseThrow(()->new EntityNotFoundException("Post not found"));
            postfounded.setSentimentPictureScore(note);
            this.postRepository.save(postfounded);
        }
    }*/








}
