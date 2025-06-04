package speedy.go.speedygo.DeliveryManagement.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.DeliveryManagement.Service.IStationDeliveryService;
import speedy.go.speedygo.DeliveryManagement.model.Stationdelevery;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/station-deliveries/")
@RequiredArgsConstructor
public class StationDeliveryController {

    private final IStationDeliveryService stationDeliveryService;

    @GetMapping("getAllStations")
    public List<Stationdelevery> getAllStations() {
        return stationDeliveryService.getAllStations();
    }

    @GetMapping("getStationById/{id}")
    public Optional<Stationdelevery> getStationById(@PathVariable Long id) {
        return stationDeliveryService.getStationById(id);
    }

    @PostMapping( "createStation")
    public Stationdelevery createStation(@Valid @RequestBody Stationdelevery Stationdelevery) {
        return stationDeliveryService.createStation(Stationdelevery);
    }

    @PutMapping( "updateStation/{id}")
    public Stationdelevery updateStation(@PathVariable Long id, @RequestBody Stationdelevery updatedStation) {
        return stationDeliveryService.updateStation(id, updatedStation);
    }

    @DeleteMapping( "deleteStation/{id}")
    public void deleteStation(@PathVariable Long id) {
        stationDeliveryService.deleteStation(id);
    }
}
