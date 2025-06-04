package speedy.go.speedygo.Service;

import speedy.go.speedygo.models.Carpooling;
import speedy.go.speedygo.models.Taxi;

import java.util.List;

public interface ITaxiService {

    Taxi addTaxi(Taxi taxi);
    List<Taxi> getAllTaxis();
    Taxi getTaxiById(Long id);
    void deleteTaxiById(Long id);
    Taxi updateTaxi(Long id, Taxi taxi);

}
