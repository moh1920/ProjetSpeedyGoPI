package speedy.go.speedygo.forumManagment;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import speedy.go.speedygo.models.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long>, JpaSpecificationExecutor<Comment> {
    @Query("select post.comments from Post post where post.id= :postId ")
    Page<Comment> findByPostId(Pageable pageable, @Param("postId") Long postId);


}
