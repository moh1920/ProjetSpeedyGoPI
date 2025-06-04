package speedy.go.speedygo.DeliveryManagement.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.DeliveryManagement.Repository.PaymentRepository;
import speedy.go.speedygo.models.Payment;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }
}