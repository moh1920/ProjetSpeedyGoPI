package speedy.go.speedygo.DeliveryManagement.Controller;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.DeliveryManagement.Service.IVehiculeService;
import speedy.go.speedygo.DeliveryManagement.model.Vehicule;

import java.util.List;

@RestController
@RequestMapping("/vehicle")
@AllArgsConstructor
public class VehiculeController  {
     IVehiculeService vehiculeService;

    @PostMapping("/addVehicle")
    public Vehicule addVehicle(@RequestBody Vehicule Vehicule) {
        return vehiculeService.addVehicle(Vehicule);
    }

    @GetMapping("getVehicleById/{id}")
    public Vehicule getVehicleById(@PathVariable long id) {
        return vehiculeService.getVehicleById(id);
    }

    @GetMapping("getAllVehicles/{id}")
    public List<Vehicule> getAllVehicles() {
        return vehiculeService.getAllVehicles();
    }

    @PutMapping("updateVehicle/{id}")
    public Vehicule updateVehicle(@PathVariable long id, @RequestBody Vehicule updatedVehicle) {
        return vehiculeService.updateVehicle(id, updatedVehicle);
    }

    @DeleteMapping("deleteVehicle/{id}")
    public void deleteVehicle(@PathVariable long id) {
        vehiculeService.deleteVehicle(id);
    }
}