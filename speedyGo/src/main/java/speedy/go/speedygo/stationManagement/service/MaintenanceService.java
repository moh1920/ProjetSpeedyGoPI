package speedy.go.speedygo.stationManagement.service;


import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.models.*;
import speedy.go.speedygo.stationManagement.models.MaintenanceCountDTO;
import speedy.go.speedygo.stationManagement.models.VehicleUsageStatsDTO;
import speedy.go.speedygo.stationManagement.repository.MaintenanceHistoryRepository;
import speedy.go.speedygo.stationManagement.repository.MaintenanceRepository;
import speedy.go.speedygo.stationManagement.repository.VehiculeRentalRepository;
import speedy.go.speedygo.stationManagement.service.impl.ICrudImpl;

import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
@Service
public class MaintenanceService implements ICrudImpl<Maintenance> {
    @Autowired
    private MaintenanceRepository maintenanceRepository ;
    @Autowired
    private VehiculeRentalRepository vehiculeRentalRepository ;
    @Autowired
    private MaintenanceHistoryRepository maintenanceHistoryRepository ;

    @Override
    public Maintenance add(Maintenance value) {
        return maintenanceRepository.save(value);
    }

    @Override
    public List<Maintenance> getAll() {
        return maintenanceRepository.findAll();
    }

    @Override
    public Maintenance getById(Long id) {
        return maintenanceRepository.findById(id).get();
    }

    @Override
    public Maintenance update(Maintenance value) {
        for (Maintenance maintenance:maintenanceRepository.findAll()){
            if (maintenance.getId().equals(value.getId())){
                return maintenanceRepository.save(value);
            }
        }
        return value ;
    }

    @Override
    public void remove(Long id) {
        maintenanceRepository.deleteById(id);
    }



    public Maintenance affectMaintenanceToVehicle(Long idMaintenance, Long idVehicle) {
        Maintenance maintenance = maintenanceRepository.findById(idMaintenance)
                .orElseThrow(() -> new RuntimeException("Maintenance non trouvée"));

        VehicleRental vehicle = vehiculeRentalRepository.findById(idVehicle)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));

        if (vehicle.getStatus().equals(StatusVehicleRental.ACTIVE)){
            vehicle.setStatus(StatusVehicleRental.MAINTENANCE);
            vehicle.setLastMaintenanceDate(maintenance.getEstimatedCompletionTime());
            vehiculeRentalRepository.save(vehicle);



            maintenance.setVehicleRentalMaintenance(vehicle);

            return maintenanceRepository.save(maintenance);
        }else {
            throw new RuntimeException("The vehicle is on Rental ");
        }

    }
    public void desaffectMaintenanceFromVehicle(Long idMaintenance) {

        Maintenance maintenance = maintenanceRepository.findById(idMaintenance)
                .orElseThrow(() -> new RuntimeException("Maintenance non trouvée"));

        maintenance.getVehicleRentalMaintenance().setStatus(StatusVehicleRental.ACTIVE);
        vehiculeRentalRepository.save(maintenance.getVehicleRentalMaintenance());

        maintenance.setVehicleRentalMaintenance(null);
        maintenanceRepository.save(maintenance);
    }


    public Page<Maintenance> getAll(Pageable pageable){
        return maintenanceRepository.findAll(pageable);
    }

    public Maintenance updateMaintenance(Maintenance value,Long idMaintenance) {
        return maintenanceRepository.findById(idMaintenance)
                .map(existingMaintenance -> {
                    // Selectively update fields
                    existingMaintenance.setStatus(value.getStatus());
                    existingMaintenance.setScheduledDate(value.getScheduledDate());
                    existingMaintenance.setMaintenanceType(value.getMaintenanceType());
                    existingMaintenance.setCost(value.getCost());
                    existingMaintenance.setTechnicianName(value.getTechnicianName());
                    existingMaintenance.setEstimatedCompletionTime(value.getEstimatedCompletionTime());

                    return maintenanceRepository.save(existingMaintenance);
                })
                .orElse(value);
    }
    @Autowired
    private JavaMailSender mailSender;



  // @Scheduled(cron = "*/10 * * * * *")
    public void sendMaintenanceConfirmationEmails() {
        List<Maintenance> maintenancesList = maintenanceRepository.findAll();

        for (Maintenance maintenance : maintenancesList) {
            if (maintenance.getEstimatedCompletionTime().equals(LocalDate.now().plusDays(1)) && (maintenance.getStatus().equals(StatusMaintenanceVehicle.Pending) ||maintenance.getStatus().equals(StatusMaintenanceVehicle.In_progress) )  ) {
                String technicianEmail = maintenanceRepository.getEmailTechnicianBy(maintenance);
                sendEmailConfirmation(technicianEmail, "Maintenance Confirmation",
                        "The maintenance with ID: " + maintenance.getId() + " scheduled for tomorrow, of type: "
                                + maintenance.getMaintenanceType() + ", for the vehicle model: "
                                + maintenance.getVehicleRentalMaintenance().getTypeVehicleRental());
            }else {
                System.out.println("n'est pas de mise maintenance demain");
            }
            if (maintenance.getEstimatedCompletionTime().equals(LocalDate.now()) && (maintenance.getStatus().equals(StatusMaintenanceVehicle.Pending) ||maintenance.getStatus().equals(StatusMaintenanceVehicle.In_progress) )) {
//                MaintenanceHistory maintenanceHistory = new MaintenanceHistory();
//
//                maintenanceHistory.setMaintenances(maintenance);
//                maintenanceHistory.setCost(maintenance.getCost());
//                maintenanceHistory.setDescription("The maintenance with ID: " + maintenance.getId() + " scheduled for tomorrow, of type: "
//                        + maintenance.getMaintenanceType() + ", for the vehicle model: "
//                        + (maintenance.getVehicleRentalMaintenance() != null ? maintenance.getVehicleRentalMaintenance().getTypeVehicleRental() : "Unknown"));
//
//                long repairDuration = ChronoUnit.DAYS.between(maintenance.getScheduledDate(), maintenance.getEstimatedCompletionTime());
//                repairDuration = repairDuration < 0 ? 0 : repairDuration;  // S'assurer que la durée n'est pas négative
//                maintenanceHistory.setRepairDuration(repairDuration);


//                maintenanceHistoryRepository.save(maintenanceHistory);
                maintenance.setStatus(StatusMaintenanceVehicle.Completed);
                maintenance.getVehicleRentalMaintenance().setStatus(StatusVehicleRental.ACTIVE);
                maintenanceRepository.save(maintenance);
                vehiculeRentalRepository.save(maintenance.getVehicleRentalMaintenance());



            }else {
                System.out.println("n'est pas de mise maintenance aujourd huis");
            }
        }

    }


    // Méthode pour envoyer un email de confirmation
    private void sendEmailConfirmation(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("sayarim558@gmail.com"); // Remplacez par votre adresse email
        message.setTo(toEmail);
        message.setText(body);
        message.setSubject(subject);
        mailSender.send(message);
        System.out.println("Confirmation email sent to: " + toEmail);
    }







    // fonction stat

    public List<MaintenanceCountDTO> getMaintenanceCountPerVehicle(){
        return maintenanceRepository.getMaintenanceCountPerVehicle();
    }

    public List<VehicleUsageStatsDTO> getVehicleUsageAndMaintenanceStats(){
        return maintenanceRepository.getVehicleUsageAndMaintenanceStats();
    }





    private final String exportDir = "C:\\Users\\21655\\Downloads\\speedyGoFinaaaaaaaaaaaalllllllll\\speedyGo\\uploads";

    public String writeCsvToDisk() throws IOException {
        List<Maintenance> data = maintenanceRepository.findAll();

        Path exportPath = Paths.get(exportDir);
        if (!Files.exists(exportPath)) {
            Files.createDirectories(exportPath);
        }

        String filename = "maintenance_" + System.currentTimeMillis() + ".csv";
        Path filePath = exportPath.resolve(filename);

        try (BufferedWriter writer = Files.newBufferedWriter(filePath)) {
            // Header
            writer.write("id,cost,email_technician,estimated_completion_time,maintenance_type,scheduled_date,status,technician_name,vehicle_rental_maintenance_models");
            writer.newLine();

            // Data
            for (Maintenance m : data) {
                writer.write(String.format("%d,%.2f,%s,%s,%s,%s,%s,%s,%s",
                        m.getId(),
                        m.getCost(),
                        m.getEmailTechnician(),
                        m.getEstimatedCompletionTime(),
                        m.getMaintenanceType(),
                        m.getScheduledDate(),
                        m.getStatus(),
                        m.getTechnicianName(),
                        m.getVehicleRentalMaintenance().getModels()
                ));
                writer.newLine();
            }
        }

        return filePath.toString(); // retourne le chemin complet du fichier
    }


    public void writeExcel(HttpServletResponse response) throws IOException {
        List<Maintenance> data = maintenanceRepository.findAll();

        // Préparer réponse HTTP
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=maintenance.xlsx");

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Maintenance");

        Row header = sheet.createRow(0);
        String[] columns = {
                "id", "cost", "email_technician", "estimated_completion_time",
                "maintenance_type", "scheduled_date", "status", "technician_name",
                "vehicle_rental_maintenance_models"
        };
        for (int i = 0; i < columns.length; i++) {
            header.createCell(i).setCellValue(columns[i]);
        }

        int rowIdx = 1;
        for (Maintenance m : data) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(m.getId());
            row.createCell(1).setCellValue(m.getCost().doubleValue());
            row.createCell(2).setCellValue(m.getEmailTechnician());
            row.createCell(3).setCellValue(m.getEstimatedCompletionTime().toString());
            row.createCell(4).setCellValue(m.getMaintenanceType());
            row.createCell(5).setCellValue(m.getScheduledDate().toString());
            row.createCell(6).setCellValue(m.getStatus().toString());
            row.createCell(7).setCellValue(m.getTechnicianName());
            row.createCell(8).setCellValue(m.getVehicleRentalMaintenance().getModels());
        }

        Path exportPath = Paths.get(exportDir);
        if (!Files.exists(exportPath)) {
            Files.createDirectories(exportPath);
        }

        String filename = "maintenance_" + System.currentTimeMillis() + ".xlsx";
        Path filePath = exportPath.resolve(filename);

        try (FileOutputStream out = new FileOutputStream(filePath.toFile())) {
            workbook.write(out);
        }

        workbook.write(response.getOutputStream());
        workbook.close();
    }











}
