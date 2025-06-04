package speedy.go.speedygo.stationManagement.controller;

import ch.qos.logback.classic.net.SocketReceiver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.models.MaintenanceHistory;
import speedy.go.speedygo.stationManagement.repository.MaintenanceHistoryRepository;
import speedy.go.speedygo.stationManagement.service.MaintenanceHistoryService;

@RestController
@RequestMapping("/gestionStation/maintenanceHistory")
public class MaintenanceHistoryController {

    @Autowired
    private MaintenanceHistoryService maintenanceHistoryService ;

    @PostMapping("addMaintenanceHistory")
    private ResponseEntity<?> addMaintenanceHistory(@RequestBody MaintenanceHistory maintenanceHistory){
        try {
            return ResponseEntity.status((HttpStatus.CREATED)).body(maintenanceHistoryService.add(maintenanceHistory));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body(e.getMessage());
        }
    }
    @GetMapping("getAllMaintenanceHistory")
    private ResponseEntity<?> getAllMaintenanceHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortOrder
    ){
        try {
            Sort sort = Sort.by(Sort.Order.asc(sortBy));
            if ("DESC".equalsIgnoreCase(sortBy)){
                sort = Sort.by(Sort.Order.desc(sortBy));
            }

            Pageable pageable = PageRequest.of(page,size,sort);
            Page<MaintenanceHistory> maintenanceHistories = maintenanceHistoryService.getAll(pageable);

            return ResponseEntity.ok(maintenanceHistories);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("getByIdMaintenanceHistory")
    private ResponseEntity<?> getByIdMaintenanceHistory(@RequestParam Long id){
        try {
            return ResponseEntity.status((HttpStatus.FOUND)).body(maintenanceHistoryService.getById(id));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping("updateMaintenanceHistory")
    private ResponseEntity<?> updateMaintenanceHistory(@RequestBody MaintenanceHistory maintenanceHistory){
        try {
            return ResponseEntity.status((HttpStatus.FOUND)).body(maintenanceHistoryService.update(maintenanceHistory));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @DeleteMapping("deleteMaintenanceHistory")
    private ResponseEntity<?> deleteMaintenanceHistory(@RequestParam Long id){
        try {
            maintenanceHistoryService.remove(id);
            return ResponseEntity.status((HttpStatus.FOUND)).build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


}
