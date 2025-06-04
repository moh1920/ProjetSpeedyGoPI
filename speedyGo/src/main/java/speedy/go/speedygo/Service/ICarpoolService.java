package speedy.go.speedygo.Service;

import speedy.go.speedygo.models.Carpooling;

import java.util.List;

public interface ICarpoolService {
    Carpooling addCarpool(Carpooling carpooling);
    List<Carpooling> getAllCarpools();
    Carpooling getCarpoolById(Long id);
    void deleteCarpoolById(Long id);
    Carpooling updateCarpool(Long id, Carpooling carpooling);

}
