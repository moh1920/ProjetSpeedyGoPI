package speedy.go.speedygo.stationManagement.controller;

import io.micrometer.core.instrument.config.validate.ValidationException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import speedy.go.speedygo.models.VehicleRental;
import speedy.go.speedygo.stationManagement.service.ImageService;
import speedy.go.speedygo.stationManagement.service.VehicleRentalService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/gestionStation/vehicleRental")
public class VehicleRentalController {
    @Autowired
    private VehicleRentalService vehicleRentalService;


    @Autowired
    private ImageService imageService;

    @PostMapping(value = "/addVehicleRental", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    private ResponseEntity<?> addVehicleRental(@RequestPart VehicleRental vehicleRental, BindingResult bindingResult,
                                               @RequestParam("file") MultipartFile file    ) throws IOException {



        String url = imageService.upload(file);
        vehicleRental.setImageUrl(url);

        if (bindingResult.hasErrors()) {
            List<String> errorMessages = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessages);
        }
        try {
            vehicleRentalService.add(vehicleRental);
            return ResponseEntity.ok(vehicleRentalService.add(vehicleRental));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(e.getMessage());
        }
    }

    @GetMapping("/getAllVehicleRental")
    public ResponseEntity<?> getAllVehicleRental(
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

            Page<VehicleRental> vehicleRentals = vehicleRentalService.getAll(pageable);

            return ResponseEntity.ok(vehicleRentals);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getByIdVehicleRental")
    private ResponseEntity<?> getByIdVehicleRental(@RequestParam Long id) {
        try {
            return ResponseEntity.ok(vehicleRentalService.getById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/updateVehicleRental")
    public ResponseEntity<?> updateVehicleRental(@Valid @RequestBody VehicleRental vehicleRental, @RequestParam Long idVehicle) {
        try {
            // Validate input
            if (vehicleRental == null || idVehicle == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Invalid vehicle rental data: ID must be provided");
            }

            // Perform update
            VehicleRental updatedVehicleRental = vehicleRentalService.updateVehicleRental(vehicleRental, idVehicle);

            return ResponseEntity.ok(updatedVehicleRental);
        } catch (EntityNotFoundException e) {
            // Specific handling for when the entity is not found
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Vehicle Rental not found: " + e.getMessage());
        } catch (ValidationException e) {
            // Handling validation errors
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Validation error: " + e.getMessage());
        } catch (Exception e) {
            // Generic error handling
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }

    @DeleteMapping("/deleteVehicleRental")
    private ResponseEntity<?> deleteVehicleRental(@RequestParam Long id) {
        try {
            vehicleRentalService.remove(id);
            return ResponseEntity.status(HttpStatus.ACCEPTED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("VehicleRental not found with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the VehicleRental.");
        }
    }

    @GetMapping("/{id}/qrcode")
    public ResponseEntity<byte[]> getVehiculeQRCode(@PathVariable Long id) {
        byte[] qrCodeImage = vehicleRentalService.getVehiculeQRCode(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=qrcode.png")
                .contentType(MediaType.IMAGE_PNG)
                .body(qrCodeImage);
    }

    @PostMapping("/affectVehicleToStation")
    public ResponseEntity<?> affectVehicleToStation(@RequestParam Long idStation, @RequestParam Long idVehicle) {
        try {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(vehicleRentalService.affectVehicleToStation(idStation, idVehicle));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(e.getMessage());
        }
    }


    @GetMapping("/findVehicleStats")
    public ResponseEntity<?> findVehicleStats() {
        try {
            return ResponseEntity.ok(vehicleRentalService.findVehicleStats());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/getAllVehicleOnStation")
    public ResponseEntity<?>  getAllVehicleOnStation(@RequestParam Long idStation) {
        try {
            return ResponseEntity.ok(vehicleRentalService.getAllVehicleOnStation(idStation));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


}
