package speedy.go.speedygo.stationManagement.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.models.Rental;
import speedy.go.speedygo.models.Station;
import speedy.go.speedygo.models.VehicleRental;
import speedy.go.speedygo.stationManagement.models.CustomerRentalStats;
import speedy.go.speedygo.stationManagement.models.PositionRequest;
import speedy.go.speedygo.stationManagement.models.RentalDTO;
import speedy.go.speedygo.stationManagement.service.RentalService;
import speedy.go.speedygo.stationManagement.service.StationService;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/gestionStation/rental")
public class RentalController {
    @Autowired
    private RentalService rentalService ;
    @Autowired
    private StationService stationService ;

    @PostMapping("addRental")
    private ResponseEntity<?> addRental(@Valid @RequestBody Rental rental, BindingResult bindingResult,
                                        Authentication connectedUser) {
        if (bindingResult.hasErrors()) {
            // Collecting the validation error messages
            List<String> errorMessages = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());
        }

        try {
            return ResponseEntity.ok(rentalService.add(rental,connectedUser));
        } catch (Exception e) {
            // Return an appropriate error status if there's an exception during the process
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body(e.getMessage());
        }
    }

    @GetMapping("getAllRental")
    private ResponseEntity<?> getAllRental(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortOrder
    ) {
        try {
            Sort sort = Sort.by(Sort.Order.asc(sortBy));
            if ("DESC".equalsIgnoreCase(sortOrder)) {
                sort = Sort.by(Sort.Order.desc(sortBy));
            }

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Rental> rentals = rentalService.getAll(pageable);
            List<RentalDTO> rentalDTOs = rentals.stream().map(RentalDTO::new).collect(Collectors.toList());

            // Ajouter des informations de pagination
            Map<String, Object> response = new HashMap<>();
            response.put("rentals", rentalDTOs);
            response.put("currentPage", rentals.getNumber());
            response.put("totalItems", rentals.getTotalElements());
            response.put("totalPages", rentals.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 🔹 Récupérer une location par ID (convertie en DTO)
    @GetMapping("getRentalById/{id}")
    public ResponseEntity<RentalDTO> getRentalById(@PathVariable("id") Long id) {
        Rental rental = rentalService.getById(id);
        return ResponseEntity.ok(new RentalDTO(rental));
    }
    @PutMapping("updateRental")
    private ResponseEntity<?> updateRental(@RequestBody Rental rental){
        try {
            return ResponseEntity.status(HttpStatus.FOUND).body(rentalService.update(rental));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @DeleteMapping("deleteRental")
    private ResponseEntity<?> deleteRental(@RequestParam Long id){
        try {
            rentalService.remove(id);
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Rental not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the rental.");
        }
    }

    @PostMapping("affecterStationStartRental")
    public ResponseEntity<?> affecterStationStartRental(@RequestParam Long rentalId,@RequestParam Long idStartStation ){
        try {
            return ResponseEntity.ok(rentalService.affecterStationStartRental(rentalId,idStartStation));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping("affecterStationDestinationRental")
    public ResponseEntity<?> affecterStationDestinationRental(@RequestParam Long rentalId,@RequestParam Long idDestination){
        try {
            return ResponseEntity.ok(rentalService.affecterStationDestinatiionRental(rentalId,idDestination));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping("affecterRentalToCustomer")
    public ResponseEntity<?> affecterRentalToCustomer(@RequestParam String emailCustomer , @RequestParam Long idRental){
        try {
            rentalService.affecterRentalToCustomer(emailCustomer,idRental);
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("affecterVehicleRentalToRental")
    public ResponseEntity<?> affecterVehicleRentalToRental(@RequestParam Long idVehicleRental ,@RequestParam Long idRental){
        try {
            rentalService.affecterVehicleRentalToRental(idVehicleRental,idRental);
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping("/calculCostOfRental")
    public ResponseEntity<?> calculCostOfRental(@RequestParam Long idRental) {
        double cost = rentalService.calculCostOfRental(idRental);
        return ResponseEntity.ok(cost);
    }


    @GetMapping("/getTopVehicles")
    public ResponseEntity<?> getTopVehicles(
            @RequestParam()
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSSSS")
            LocalDateTime startDate,
            @RequestParam()
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSSSS")
            LocalDateTime endDate,
            @RequestParam() Integer numberOfVehicles) {

        List<VehicleRental> topVehicles = rentalService.tobTVehicleRentalByDate(startDate, endDate, numberOfVehicles);

        if (topVehicles.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(topVehicles);
    }

    @GetMapping("/getLeastRentedVehicles")
    public ResponseEntity<?> getLeastRentedVehicles(
            @RequestParam("startDate")
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSSSS")
            LocalDateTime startDate,
            @RequestParam()
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSSSSS")
            LocalDateTime endDate,
            @RequestParam() Integer numberOfVehicles) {

        List<VehicleRental> leastVehicles = rentalService.lastVehicleRentalByDate(startDate, endDate, numberOfVehicles);

        if (leastVehicles.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(leastVehicles);
    }


    @GetMapping("/recommenderTrajet/{idRental}")
    public ResponseEntity<String> getRecommendedRoute(@PathVariable Long idRental) {
        try {
            String polyline = rentalService.getRecommendedRoute(idRental);
            return ResponseEntity.ok(polyline);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("No recommended route found: " + e.getMessage());
        }
    }


    @GetMapping("/getWeatherBetweenStations/{idRental}")
    public ResponseEntity<?> getWeatherBetweenStations(
            @PathVariable("idRental") Long idRental) {

        try {
            Map<String, Object> weather = rentalService.getMiddlePointWeather(idRental);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur : " + e.getMessage());
        }
    }

    @GetMapping("/getCustomerStats")
    public ResponseEntity<?> getCustomerStats() {
        try {
            List<CustomerRentalStats> stats = rentalService.findCustomerStats();
            return ResponseEntity.ok(stats);

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }
    @GetMapping("/avgDurationMinutes")
    public ResponseEntity<?> avgDurationMinutes() {
        try {
            return ResponseEntity.ok(rentalService.compareMonthlyAvgDurations());

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }



    @GetMapping("getAllRentalByVehicle/{id}")
    public ResponseEntity<List<RentalDTO>> getAllRentalByVehicle(@PathVariable("id") Long idVehicle) {
        try {

            return ResponseEntity.ok(rentalService.getAllRentalByVehicle(idVehicle));

        } catch (Exception e) {
            // Tu peux aussi logguer l'erreur ici si tu utilises SLF4J
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @GetMapping("getAllRentalByCustomer")
    public ResponseEntity<?> getAllRentalByCustomer(Authentication connectedUser){
        try {
            return ResponseEntity.ok(rentalService.getAllRentalByCustomer(connectedUser));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }




    @PostMapping("/nearest-station")
    public ResponseEntity<Station> findNearestStation(@RequestBody PositionRequest position) {
        double userLat = position.getLatitude();
        double userLng = position.getLongitude();

        List<Station> stations = stationService.getAll();
        Station nearest = null;
        double minDistance = Double.MAX_VALUE;

        for (Station station : stations) {
            double distance = rentalService.haversine(userLat, userLng, station.getLatitude(), station.getLongitude());
            if (distance < minDistance) {
                minDistance = distance;
                nearest = station;
                System.out.println(nearest.getName());
            }
        }

        return ResponseEntity.ok(nearest);
    }

    @GetMapping("/rental/{id}")
    public ResponseEntity<String> getWeatherForRental(@PathVariable Long id) {
        try {
            String result = rentalService.getWeatherInDateRental(id);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }










}
