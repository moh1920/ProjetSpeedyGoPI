package speedy.go.speedygo.DeliveryManagement.Service;

import speedy.go.speedygo.DeliveryManagement.model.Stationdelevery;

import java.util.List;
import java.util.Optional;

public interface IStationDeliveryService {

    List<Stationdelevery> getAllStations();

    Optional<Stationdelevery> getStationById(Long id);

    Stationdelevery createStation(Stationdelevery Stationdelevery);

    Stationdelevery updateStation(Long id, Stationdelevery updatedStation);

    void deleteStation(Long id);
}
