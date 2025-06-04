package speedy.go.speedygo.stationManagement.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.models.Station;
import speedy.go.speedygo.stationManagement.repository.StationRepository;
import speedy.go.speedygo.stationManagement.service.impl.ICrudImpl;

import java.time.LocalDate;
import java.util.List;
@Service
public class StationService implements ICrudImpl<Station> {

    @Autowired
    private StationRepository stationRepository ;
    
    @Override
    public Station add(Station value) {
        value.setCreatedAt(LocalDate.now());
        value.setUpdatedAt(LocalDate.now());
        return stationRepository.save(value);
    }

    @Override
    public List<Station> getAll() {
        return stationRepository.findAll();
    }

    @Override
    public Station getById(Long id) {
        return stationRepository.findById(id).get();
    }

    @Override
    public Station update(Station value) {
        for(Station station: stationRepository.findAll()){
            if (station.getId().equals(value.getId())){
                stationRepository.save(value);
            }
        }
        return value;
    }

    @Override
    public void remove(Long id) {
       stationRepository.deleteById(id);
    }

    public Page<Station> getAll(Pageable pageable){
        return stationRepository.findAll(pageable);
    }



    @Transactional
    public Station updateStation(Station value, Long idStation) {



        // Find the existing station by ID
        Station existingStation = stationRepository.findById(idStation)
                .orElseThrow(() -> new EntityNotFoundException("Station not found with id: " + idStation));


        // Update the existing station's properties
        existingStation.setName(value.getName());
        existingStation.setLatitude(value.getLatitude());
        existingStation.setLongitude(value.getLongitude());
        existingStation.setIs_active(value.getIs_active());
        existingStation.setCapacity(value.getCapacity());
        existingStation.setUpdatedAt(LocalDate.now());

        // Add other relevant setters as needed

        // Save the updated station
        return stationRepository.save(existingStation);
    }



}
