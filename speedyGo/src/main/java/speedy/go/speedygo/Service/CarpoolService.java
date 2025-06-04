package speedy.go.speedygo.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.Repository.CarpoolRepository;
import speedy.go.speedygo.models.Carpooling;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarpoolService implements  ICarpoolService{

    private final CarpoolRepository carpoolRepository;


    @Override
    public Carpooling addCarpool(Carpooling carpooling) {
        return carpoolRepository.save(carpooling);
    }

    @Override
    public List<Carpooling> getAllCarpools() {
        return carpoolRepository.findAll();
    }

    @Override
    public Carpooling getCarpoolById(Long id) {
        return carpoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carpool not found with id: " + id));
    }

    @Override
    public void deleteCarpoolById(Long id) {
        carpoolRepository.deleteById(id);
    }

    @Override
    public Carpooling updateCarpool(Long id, Carpooling carpooling) {
        Carpooling existingCarpool = carpoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carpool not found with id: " + id));

        // Update the fields only if the new value is not null
        if (carpooling.getDepartLocation() != null) {
            existingCarpool.setDepartLocation(carpooling.getDepartLocation());
        }
        if (carpooling.getArrivalLocation() != null) {
            existingCarpool.setArrivalLocation(carpooling.getArrivalLocation());
        }
        if (carpooling.getTime() != null) {
            existingCarpool.setTime(carpooling.getTime());
        }
        if (carpooling.getSeatsAvailable() != null) {
            existingCarpool.setSeatsAvailable(carpooling.getSeatsAvailable());
        }
        if (carpooling.getPricePerSeat() != null) {
            existingCarpool.setPricePerSeat(carpooling.getPricePerSeat());
        }

        // Save the updated carpool entity
        return carpoolRepository.save(existingCarpool);
    }


}
