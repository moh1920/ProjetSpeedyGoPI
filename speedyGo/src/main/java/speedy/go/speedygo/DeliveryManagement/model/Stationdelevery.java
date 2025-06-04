package speedy.go.speedygo.DeliveryManagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
public class Stationdelevery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de la station est obligatoire")
    @Size(max = 100, message = "Le nom ne peut pas dépasser 100 caractères")
    private String name;

    @NotBlank(message = "L'emplacement est obligatoire")
    private String location;

    @NotNull(message = "La capacité ne peut pas être vide")
    @Min(value = 1, message = "La capacité doit être d'au moins 1")
    private Integer capacity;

    @NotNull(message = "Le statut actif est obligatoire")
    private Boolean isActive;

    @NotBlank(message = "Le nom du contact est obligatoire")
    @Size(max = 100, message = "Le nom du contact ne peut pas dépasser 100 caractères")
    private String contactPerson;

    @NotBlank(message = "Le numéro de contact est obligatoire")
    @Pattern(regexp = "^[0-9]{8,15}$", message = "Le numéro de contact doit contenir entre 8 et 15 chiffres")
    private String contactNumber;

    @NotBlank(message = "Les heures de travail sont obligatoires")
    private String workingHours;

    @NotNull(message = "La latitude est obligatoire")
    @DecimalMin(value = "-90.0", message = "La latitude doit être entre -90 et 90")
    @DecimalMax(value = "90.0", message = "La latitude doit être entre -90 et 90")
    private Double latitude;

    @NotNull(message = "La longitude est obligatoire")
    @DecimalMin(value = "-180.0", message = "La longitude doit être entre -180 et 180")
    @DecimalMax(value = "180.0", message = "La longitude doit être entre -180 et 180")
    private Double longitude;

    @OneToMany(mappedBy = "stationdelevery", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vehicule> vehicles;
}
