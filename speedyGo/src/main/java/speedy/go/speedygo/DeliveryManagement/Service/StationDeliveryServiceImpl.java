package speedy.go.speedygo.DeliveryManagement.Service;


import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import speedy.go.speedygo.DeliveryManagement.Repository.IStationRopository;
import speedy.go.speedygo.DeliveryManagement.model.Stationdelevery;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StationDeliveryServiceImpl implements IStationDeliveryService {

    private final IStationRopository stationDeliveryRepository;

    @Override
    public List<Stationdelevery> getAllStations() {
        return stationDeliveryRepository.findAll();
    }

    @Override
    public Optional<Stationdelevery> getStationById(Long id) {
        return stationDeliveryRepository.findById(id);
    }

    @Override
    public Stationdelevery createStation(Stationdelevery Stationdelevery) {
        return stationDeliveryRepository.save(Stationdelevery);
    }

    @Override
    @Transactional
    public Stationdelevery updateStation(Long id, Stationdelevery stationDelivery) {
        if (stationDelivery == null) {
            throw new IllegalArgumentException("Updated station cannot be null");
        }
        
        return stationDeliveryRepository.findById(id)
            .map(station -> {
                station.setName(stationDelivery.getName());
                station.setLocation(stationDelivery.getLocation());
                station.setCapacity(stationDelivery.getCapacity());
                station.setIsActive(stationDelivery.getIsActive());
                station.setContactPerson(stationDelivery.getContactPerson());
                station.setContactNumber(stationDelivery.getContactNumber());
                station.setWorkingHours(stationDelivery.getWorkingHours());
                station.setLatitude(stationDelivery.getLatitude());
                station.setLongitude(stationDelivery.getLongitude());
                return stationDeliveryRepository.save(station);
            })
            .orElseThrow(() -> new EntityNotFoundException("Station not found with id: " + id));
    }

    @Override
    public void deleteStation(Long id) {
        if (!stationDeliveryRepository.existsById(id)) {
            throw new RuntimeException("Station not found");
        }
        stationDeliveryRepository.deleteById(id);
    }
}
