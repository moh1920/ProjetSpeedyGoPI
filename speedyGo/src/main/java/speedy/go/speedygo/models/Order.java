package speedy.go.speedygo.models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import speedy.go.speedygo.user.User;

import java.util.Date;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "customer_order")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;


    private Double pickupLatitude;
    private Double pickupLongitude;

    private Double deliveryLatitude;
    private Double deliveryLongitude;
    private Boolean homeDelivery;
    private String deliveryAddress;
    private Date estimatedDeliveryDate;
    private String paymentMethod;
    private Boolean paymentConfirmed;
    private String transactionId;
    @OneToMany(mappedBy = "order")
    @JsonIgnore
    private List<OrderItem> orderItems;

    @OneToMany(mappedBy = "orderHistory")
    @JsonIgnore

    private List<History> histories ;
    @ManyToOne
    @JsonIgnore

    private Store store;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<HistoriqueProduit> historiqueCommandes;

    @ManyToOne
    @JsonIgnore
    private User client;


}
