package speedy.go.speedygo.Panier;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import speedy.go.speedygo.models.Panier;
import speedy.go.speedygo.user.User;

import java.util.Optional;

@Repository
public interface PanierRepository extends JpaRepository<Panier,Long> {
    Optional<Panier> findByUser(User user);
}
