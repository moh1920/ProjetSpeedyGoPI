package speedy.go.speedygo.Controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.Service.ITaxiService;
import speedy.go.speedygo.Service.TaxiService;
import speedy.go.speedygo.models.Carpooling;
import speedy.go.speedygo.models.Taxi;

import java.util.List;

@RestController
@RequestMapping("/taxi")
@AllArgsConstructor
public class TaxiController {

    ITaxiService iTaxiService;

    @Autowired
    private TaxiService taxiService ;
    @PostMapping("/add")
    @Operation(summary = "Add a new Taxi")
    public ResponseEntity<?> addTaxi(@RequestBody Taxi taxi) {
        try {
           return ResponseEntity.ok().body(taxiService.addTaxi(taxi)) ;
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }

    @GetMapping("/all")
    @Operation(summary = "All the Taxis")
    public List<Taxi> getAllTaxis() {
        return iTaxiService.getAllTaxis();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Find taxi by id")
    public Taxi getTaxiById(@PathVariable Long id) {
        return iTaxiService.getTaxiById(id);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a taxi by id")
    public void deleteTaxiById(@PathVariable Long id) {
        iTaxiService.deleteTaxiById(id);

    }

    @PutMapping("/{id}")
    @Operation(summary = "update a taxi by id")
    public Taxi updateTaxi(@PathVariable long id, @RequestBody Taxi taxi) {
        return iTaxiService.updateTaxi(id, taxi);
    }

}

