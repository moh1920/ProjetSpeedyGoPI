package speedy.go.speedygo.DeliveryManagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import speedy.go.speedygo.user.User;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom du plan est obligatoire")
    private String planName;

    @NotNull(message = "Le prix ne peut pas être nul")
    @Positive(message = "Le prix doit être un nombre positif")
    private Double price;

    @NotNull(message = "La durée ne peut pas être nulle")
    @Min(value = 1, message = "La durée doit être d'au moins 1 jour")
    private Integer durationInDays;

    @NotNull(message = "Le statut actif est obligatoire")
    private Boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private User subscriber;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate startDate;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate endDate;

    @PrePersist
    @PreUpdate
    private void validateDates() {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("La date de début ne peut pas être après la date de fin.");
        }
    }
}
