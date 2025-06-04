package speedy.go.speedygo.stationManagement.controller;

import io.micrometer.core.instrument.config.validate.ValidationException;
import jakarta.persistence.EntityNotFoundException;
import jdk.jshell.Snippet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.models.Station;
import speedy.go.speedygo.stationManagement.service.StationService;


@RestController
@RequestMapping("/gestionStation/station")
public class StationController {
    @Autowired
    private StationService stationService ;

    @PostMapping("/addStation")
    private ResponseEntity<?> addStation(@RequestBody Station station){
           try {
               return ResponseEntity.status(HttpStatus.CREATED).body(stationService.add(station));
           }catch (Exception e){
               return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body(e.getMessage());
           }
    }
    @GetMapping("/getAllStation")
    private ResponseEntity<?> getAllStation(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortOrder
    ){
        try {
            Sort sort =Sort.by(Sort.Order.asc(sortBy));
            if ("DESC".equalsIgnoreCase(sortOrder)){
                sort = Sort.by(Sort.Order.desc(sortBy));
            }

            Pageable pageable = PageRequest.of(page,size,sort);
            Page<Station> stations = stationService.getAll(pageable);
            return ResponseEntity.ok(stations.getContent());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/getByIdStation")
    private ResponseEntity<?> getByIdStation(@RequestParam Long id){
        try {
            return ResponseEntity.ok(stationService.getById(id));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping("/updateStation")
    public ResponseEntity<?> updateStation(@RequestBody Station station, @RequestParam Long idStation) {
        try {
            Station updatedStation = stationService.updateStation(station, idStation);
            return ResponseEntity.ok(updatedStation);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }
    @DeleteMapping("/deleteStation")
    public ResponseEntity<?> deleteStation(@RequestParam Long id) {
        try {
            stationService.remove(id);
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Station not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the station.");
        }
    }



}
