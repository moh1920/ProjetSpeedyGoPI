package speedy.go.speedygo.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import speedy.go.speedygo.models.Event_Promotion;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,String> {
    @Query(name = UserConstants.FIND_USER_BY_EMAIL)
    Optional<User> findByEmail(@Param("email") String email);
    @Query(name = UserConstants.FIND_USER_BY_PUBLIC_ID)
    Optional<User> findByPublicId(String publicId);

    @Query(name = UserConstants.FIND_ALL_USERS_EXCEPT_SELF)
    List<User> findAllUsersExceptSelf(@Param("publicId") String publicId);
    @Query("SELECT u FROM User u WHERE u.email IN :emails")
    List<User> findUsersByEmails(@Param("emails") List<String> emails);
   /* @Modifying
    @Transactional
    @Query("DELETE FROM User p WHERE p.eventPromotionsPartner in :pvId")
    void deleteByEventPromotionId(@Param("pvId") Event_Promotion pvId);*/

}
