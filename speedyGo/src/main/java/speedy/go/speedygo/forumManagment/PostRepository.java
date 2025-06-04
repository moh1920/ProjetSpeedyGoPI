package speedy.go.speedygo.forumManagment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import speedy.go.speedygo.models.Post;

import java.util.List;

public interface PostRepository extends JpaRepository<Post,Long>, JpaSpecificationExecutor<Post> {

    @Query("select post from Post post where post.status='ACTIF' and post.visibility=true and post.senderPost.id!= :userId" )
    Page<Post> findAllDisplayablePosts(Pageable pageable,@Param("userId") String userId);

    @Modifying
    @Query("delete FROM Post  post where post.id= :postId and  post.senderPost.id= :ownerId")
    @Transactional
    void deletePostByOwner(@Param("postId") Long postId,@Param("ownerId") String ownerId);

    @Query(value = "SELECT u.email FROM ( SELECT p.sender_post_id AS user_id, COUNT(*) AS activity_count FROM post p GROUP BY p.sender_post_id UNION ALL SELECT c.sender_comment_id AS user_id, COUNT(*) AS activity_count FROM comment c GROUP BY c.sender_comment_id ) AS combined_activity JOIN users u ON u.id = combined_activity.user_id GROUP BY u.email ORDER BY SUM(combined_activity.activity_count) DESC LIMIT 3", nativeQuery = true)
    List<String> findTopForumContributors();

}
