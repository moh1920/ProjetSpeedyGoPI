package speedy.go.speedygo.DeliveryManagement.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.DeliveryManagement.Repository.TransactionRepository;
import speedy.go.speedygo.models.Transaction;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Transaction getTransactionById(String transactionId) {
        return transactionRepository.findByTransactionId(transactionId);
    }
}
