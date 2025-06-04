package speedy.go.speedygo.DeliveryManagement.Controller;

import com.stripe.Stripe;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import speedy.go.speedygo.DeliveryManagement.Service.NotificationService;
import speedy.go.speedygo.DeliveryManagement.Service.PaymentService;
import speedy.go.speedygo.DeliveryManagement.Service.TransactionService;
import speedy.go.speedygo.DeliveryManagement.Service.SubscriptionService;
import speedy.go.speedygo.models.Payment;
import speedy.go.speedygo.models.Transaction;
import speedy.go.speedygo.DeliveryManagement.model.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/api")
public class PaymentController {

    @Value("${spring.stripe.secret-key}")
    private String secretKey;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private SubscriptionService subscriptionService;
    @Autowired
    private NotificationService notificationService;

    static class PaymentRequest {
        public String email;
        public Long amount;
        public int planId;  
    }

    @PostMapping("/payment-intent")
    
    public Map<String, String> createPaymentIntent(@RequestBody PaymentRequest request) {
        Stripe.apiKey = secretKey;

        String userEmail = (request.email != null) ? request.email : "unknown@example.com";
        Long amount = (request.amount != null) ? request.amount : 5000L;
        int planId = request.planId;  

        try {
            // Create a new Stripe customer
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                    .setEmail(userEmail)
                    .build();
            Customer customer = Customer.create(customerParams);

            // Create a Payment Intent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount)
                    .setCurrency("usd")
                    .setCustomer(customer.getId())
                    .setReceiptEmail(userEmail)
                    .putMetadata("user_email", userEmail)
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            // Create and save Payment object
            Payment payment = new Payment();
            payment.setPaymentIntentId(intent.getId());
            payment.setUserEmail(userEmail);
            payment.setAmount(amount);
            payment.setCurrency("usd");
            payment.setStatus(intent.getStatus());
            payment.setCreatedTimestamp(intent.getCreated());

            paymentService.savePayment(payment);

            // Create and save Transaction object
            Transaction paymentTransaction = new Transaction();
            paymentTransaction.setTransactionId(payment.getPaymentIntentId());
            paymentTransaction.setAmount(amount);
            paymentTransaction.setCurrency("usd");
            paymentTransaction.setTransactionType("payment");
            paymentTransaction.setStatus(intent.getStatus());
            paymentTransaction.setCreatedTimestamp(intent.getCreated());
            paymentTransaction.setPayment(payment);

            transactionService.saveTransaction(paymentTransaction);
                Subscription newSubscription = new Subscription();
                newSubscription.setPlanName(getPlanNameById(planId));
                newSubscription.setPrice(amount.doubleValue());
                newSubscription.setDurationInDays(getPlanDurationById(planId));
                newSubscription.setStartDate(LocalDate.now());
                newSubscription.setEndDate(LocalDate.now().plusDays(getPlanDurationById(planId)));
                newSubscription.setIsActive(true);
            subscriptionService.createSubscription(newSubscription, userEmail);

            Map<String, String> response = new HashMap<>();
            response.put("client_secret", intent.getClientSecret());
            response.put("payment_intent_id", intent.getId());
            response.put("user_email", userEmail);
            notificationService.sendingNotification(userEmail, notification.builder().message("Payment successful").status(satusnotif.PAYED).orderid(payment.getPaymentIntentId()).build());



            return response;
        } catch (Exception e) {
            throw new RuntimeException("Stripe Payment Failed: " + e.getMessage());
        }
    }

    private String getPlanNameById(int planId) {
        switch (planId) {
            case 1:
                return "Basic Pack";
            case 2:
                return "Standard Pack";
            case 3:
                return "Premium Pack";
            case 4:
                return "Ultimate Pack";
            default:
                throw new IllegalArgumentException("Invalid plan ID");
        }
    }

    private int getPlanDurationById(int planId) {
        switch (planId) {
            case 1:
                return 30; 
            case 2:
                return 60; 
            case 3:
                return 90; 
            case 4:
                return 120; 
            default:
                throw new IllegalArgumentException("Invalid plan ID");
        }
    }
}