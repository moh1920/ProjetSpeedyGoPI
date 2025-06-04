package speedy.go.speedygo.OrderManagement;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {
    private String shippingAddress;
    private String phoneNumber;
    private String deliveryMethod;
    private String paymentMethod;
    private Boolean paymentConfirmed;
}