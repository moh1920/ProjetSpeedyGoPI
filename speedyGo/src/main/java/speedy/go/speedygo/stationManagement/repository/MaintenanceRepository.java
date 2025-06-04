package speedy.go.speedygo.stationManagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import speedy.go.speedygo.models.Maintenance;
import speedy.go.speedygo.stationManagement.models.MaintenanceCountDTO;
import speedy.go.speedygo.stationManagement.models.VehicleUsageStatsDTO;

import java.util.List;

public interface MaintenanceRepository extends JpaRepository<Maintenance,Long> {
    Page<Maintenance> findAll(Pageable pageable);
    List<Maintenance> findAll(Sort sort);

    @Query("SELECT m.emailTechnician FROM Maintenance m WHERE m = :maintenance")
    public String getEmailTechnicianBy(@Param("maintenance") Maintenance maintenance);


    @Query("SELECT new speedy.go.speedygo.stationManagement.models.MaintenanceCountDTO(" +
            "m.vehicleRentalMaintenance.id , COUNT(*)) " +
            "FROM Maintenance m " +
            "GROUP BY m.vehicleRentalMaintenance.id")
    List<MaintenanceCountDTO> getMaintenanceCountPerVehicle();



    @Query("SELECT new speedy.go.speedygo.stationManagement.models.VehicleUsageStatsDTO(" +
            "v.id, " +
            "COUNT(r.id), " +
            "v.mileage, " +
            "MAX(m.scheduledDate)) " +
            "FROM VehicleRental v " +
            "LEFT JOIN Rental r ON r.vehicleRental.id = v.id " +
            "LEFT JOIN Maintenance m ON m.vehicleRentalMaintenance.id = v.id " +
            "GROUP BY v.id")
    List<VehicleUsageStatsDTO> getVehicleUsageAndMaintenanceStats();

}
