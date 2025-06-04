package speedy.go.speedygo.forumManagment;

import org.springframework.data.jpa.domain.Specification;
import speedy.go.speedygo.models.Post;

public class PostSpecification {

    public static Specification<Post> withOwnerId(String ownerId){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("senderPost").get("id"),ownerId));
    }
}
