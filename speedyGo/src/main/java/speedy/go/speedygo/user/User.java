package speedy.go.speedygo.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.springframework.stereotype.Component;
import speedy.go.speedygo.common.BaseAuditingEntity;
import speedy.go.speedygo.models.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Users")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@NamedQueries({
        @NamedQuery(
                name = UserConstants.FIND_USER_BY_EMAIL,
                query = "SELECT u FROM User u WHERE u.email = :email"
        ),
        @NamedQuery(
                name = UserConstants.FIND_ALL_USERS_EXCEPT_SELF,
                query = "SELECT u FROM User u WHERE u.id != :publicId"
        ),
        @NamedQuery(
                name = UserConstants.FIND_USER_BY_PUBLIC_ID,
                query = "SELECT u FROM User u WHERE u.id = :publicId"
        )
})
public class User extends BaseAuditingEntity {
    private static final int LAST_ACTIVATE_INTERVAL = 5;
    @Id
    private String id;

    private String firstName;

    private String lastName;

    @Column(unique = true)
    private String email;
    private LocalDateTime lastSeen;

    private String password;
    private boolean isActive;
    @Enumerated(EnumType.STRING)
    private Role role;
    @Enumerated(EnumType.STRING)
    private PartnerType partnerType;
    private String address;
    private String licence;
    private String insurance;
    private String criminalRecord;
    private short rating;
    private boolean availability;
    @ManyToMany
    private List<ReservationTrip> reservationTripsCarpooling;
    @OneToMany
    private List<ReservationTrip> reservationTripsTaxi;
    @OneToOne
    private ReservationTrip reservationTripDriver;


    @ManyToMany
    private List<Notification> notifications ;
    @OneToMany(mappedBy = "customerReview")
    private List<Review> reviewsCustomer ;
    @OneToMany(mappedBy = "driverReview")
    private List<Review> reviewsDriver ;

    @OneToMany(mappedBy = "driverSupportTicket")
    private List<SupportTicket> supportTicketsDriver;
    @OneToMany(mappedBy = "customerSupportTicket")
    private List<SupportTicket> supportTicketsCustomer;

    @OneToMany(mappedBy = "partnerLoyaltyProgram")
    private List<LoyaltyProgram> loyaltyProgramsPartner;
    @ManyToMany
    private List<LoyaltyProgram> loyaltyProgramsCustomer ;

    @OneToMany(mappedBy = "driverParcel")
    private List<Parcel> parcelsDriver ;
    @OneToMany(mappedBy = "customerParcel")
    private  List<Parcel> parcelsCustomer;

    @ManyToMany(mappedBy = "customerEvent_Promotion")
    @JsonIdentityReference
    private List<Event_Promotion> eventPromotionsCustomer;
    @OneToMany(mappedBy = "partnerEvent_Promotion")
    @JsonIdentityReference
    private List<Event_Promotion> eventPromotionsPartner ;

    @OneToMany(mappedBy = "sender")
    private List<Chat> chatsAsSender;

    @OneToMany(mappedBy = "recipient")
    private List<Chat> chatsAsRecipient;

    @ManyToMany
    private List<Product> productsCustomer ;
    @OneToMany
    private List<Product> productsPartner;


    @OneToOne
    private Station stationManagment ;


    @OneToMany(mappedBy = "customer")
    private List<Rental> rentals ;


    @ManyToMany(mappedBy = "receiverPost")
    private List<Post> postListReceiver ;
    @OneToMany(mappedBy = "senderPost")
    private List<Post> postSender ;

    @Transient
    public boolean isUserOnline() {
        return lastSeen != null && lastSeen.isAfter(LocalDateTime.now().minusMinutes(LAST_ACTIVATE_INTERVAL));
    }

}
