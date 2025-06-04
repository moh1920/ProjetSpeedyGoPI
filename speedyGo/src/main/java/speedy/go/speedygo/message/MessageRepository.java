package speedy.go.speedygo.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import speedy.go.speedygo.models.Chat;
import speedy.go.speedygo.models.Message;
import speedy.go.speedygo.models.MessageConstants;
import speedy.go.speedygo.models.MessageState;

import java.util.Collection;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Long> {
    @Query(name = MessageConstants.FIND_MESSAGES_BY_CHAT_ID)
    List<Message> findMessagesByChatId(String chatId);

    @Query(name = MessageConstants.SET_MESSAGES_TO_SEEN_BY_CHAT)
    @Modifying
    void setMessagesToSeenByChatId(@Param("chatId") String chatId,@Param("newState") MessageState state);
}
