package speedy.go.speedygo.forumManagment;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import speedy.go.speedygo.models.Reaction;

import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction,Long> {

    @Modifying
    @Query("delete from Reaction r where r.id= :reactionId and r.user.id= :userId")
    @Transactional
    void deleteReactionByPostWithUserOwner(@Param("reactionId") Long reactionId,@Param("userId") String userId);

    @Query("select post.reactions from Post post where post.id= :postId" )
    Page<Reaction> findAllDisplayableReactions(Pageable pageable,@Param("postId") Long postId);

    @Query("SELECT r FROM Reaction r WHERE r.user.id = :name AND r IN (SELECT p.reactions FROM Post p WHERE p.id = :postId)")
    Optional<Reaction> findReactionFromPost(@Param("postId") Long postId, @Param("name") String name);




}
