package speedy.go.speedygo.DeliveryManagement.Service;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.DeliveryManagement.Repository.IVehiculeRopository;
import speedy.go.speedygo.DeliveryManagement.model.Vehicule;

import java.util.List;

@Service
@AllArgsConstructor
public class VehiculeService implements IVehiculeService {

    @Autowired
    private IVehiculeRopository vehiculeRepository;

    @Override
    public Vehicule addVehicle(Vehicule Vehicule) {
        return vehiculeRepository.save(Vehicule);
    }

    @Override
    public Vehicule getVehicleById(long id) {
        return vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicule not found!"));
    }

    @Override
    public List<Vehicule> getAllVehicles() {
        return vehiculeRepository.findAll();
    }

    @Override
    public Vehicule updateVehicle(long id, Vehicule updatedVehicle) {
        Vehicule existingVehicule = getVehicleById(id);
        existingVehicule.setModel(updatedVehicle.getModel());
        existingVehicule.setCapacity(updatedVehicle.getCapacity());
        existingVehicule.setType(updatedVehicle.getType());
        return vehiculeRepository.save(existingVehicule);
    }

    @Override
    public void deleteVehicle(long id) {
        Vehicule vehicule = getVehicleById(id);
        vehiculeRepository.delete(vehicule);
    }








}
