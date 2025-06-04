package speedy.go.speedygo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.Repository.TaxiRepository;
import speedy.go.speedygo.models.Taxi;
import speedy.go.speedygo.user.User;
import speedy.go.speedygo.user.UserRepository;

import java.util.List;

@Service
public class TaxiService implements  ITaxiService{
    @Autowired
    private TaxiRepository taxiRepository;
    @Autowired
    private UserRepository userRepository;
    @Override
    public Taxi addTaxi(Taxi taxi) {
        return taxiRepository.save(taxi);
    }

    @Override
    public List<Taxi> getAllTaxis() {
        return taxiRepository.findAll();
    }

    @Override
    public Taxi getTaxiById(Long id) {
        return taxiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Taxi not found with id: " + id));
    }

    @Override
    public void deleteTaxiById(Long id) {
        taxiRepository.deleteById(id);

    }

    @Override
    public Taxi updateTaxi(Long id, Taxi taxi) {
        Taxi existingTaxi = taxiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Taxi not found with id: " + id));

        if (taxi.getModel() != null) {
            existingTaxi.setModel(taxi.getModel());
        }

        if (taxi.getLicensePlate() != null) {
            existingTaxi.setLicensePlate(taxi.getLicensePlate());
        }

        if (taxi.getTypeTaxi() != null) {
            existingTaxi.setTypeTaxi(taxi.getTypeTaxi());
        }

        if (taxi.isAvailable() != existingTaxi.isAvailable()) {
            existingTaxi.setAvailable(taxi.isAvailable());
        }


        return taxiRepository.save(existingTaxi);
    }
}
