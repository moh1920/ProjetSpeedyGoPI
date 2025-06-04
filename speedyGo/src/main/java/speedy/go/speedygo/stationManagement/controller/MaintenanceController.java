package speedy.go.speedygo.stationManagement.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.models.Maintenance;
import speedy.go.speedygo.stationManagement.models.MaintenanceDTO;
import speedy.go.speedygo.stationManagement.service.MaintenanceService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/gestionStation/maintenance")
public class MaintenanceController {
    @Autowired
    private MaintenanceService maintenanceService ;

    @PostMapping("/addMaintenance")
    private ResponseEntity<?> addMaintenance(@RequestBody Maintenance maintenance){
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(maintenanceService.add(maintenance));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(e.getMessage());
        }
    }
    @GetMapping("/getAllMaintenance")
    private ResponseEntity<?> getAllMaintenance(
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
            Page<Maintenance> maintenances = maintenanceService.getAll(pageable);
            Page<MaintenanceDTO> dtoPage = maintenances.map(MaintenanceDTO::new);
            return ResponseEntity.ok(dtoPage);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/getByIdMaintenance")
    private ResponseEntity<?> getByIdMaintenance(@RequestParam Long id){
        try {
            return ResponseEntity.ok(maintenanceService.getById(id));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PutMapping("/updateMaintenance")
    private ResponseEntity<?> updateMaintenance(@RequestBody Maintenance maintenance,@RequestParam Long idMaintenance){
        try {
            return ResponseEntity.ok(maintenanceService.updateMaintenance(maintenance,idMaintenance));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @DeleteMapping("/deleteMaintenance")
    private ResponseEntity<?> deleteMaintenance(@RequestParam Long id){
        try {
            maintenanceService.remove(id);
            return ResponseEntity.status(HttpStatus.FOUND).build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping("affectMaintenanceToVehicle")
    public ResponseEntity<?> affectMaintenanceToVehicle(@RequestParam Long idMaintenance ,@RequestParam Long idVehicle){
        try {
            return ResponseEntity.ok(maintenanceService.affectMaintenanceToVehicle(idMaintenance,idVehicle));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(e.getMessage());
        }
    }
    @PostMapping("desaffectMaintenanceFromVehicle")
    public ResponseEntity<?> desaffectMaintenanceFromVehicle(@RequestParam Long idMaintenance){
            maintenanceService.desaffectMaintenanceFromVehicle(idMaintenance);
            return ResponseEntity.ok("desaffectMaintenanceFromVehicle");
    }




    @GetMapping("getMaintenanceCountPerVehicle")
    public ResponseEntity<?> getMaintenanceCountPerVehicle(){
        try {
            return ResponseEntity.ok(maintenanceService.getMaintenanceCountPerVehicle());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @GetMapping("getVehicleUsageAndMaintenanceStats")
    public ResponseEntity<?> getVehicleUsageAndMaintenanceStats(){
        try {
            return ResponseEntity.ok(maintenanceService.getVehicleUsageAndMaintenanceStats());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @GetMapping("/generate-csv")
    public ResponseEntity<String> generateCsv() throws IOException {
        String path = maintenanceService.writeCsvToDisk();
        return ResponseEntity.ok("Fichier CSV généré ici : " + path);
    }
    @GetMapping("/excel")
    public void downloadExcel(HttpServletResponse response) throws IOException {
        maintenanceService.writeExcel(response);
    }





}
