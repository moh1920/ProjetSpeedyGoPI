package speedy.go.speedygo.stationManagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import speedy.go.speedygo.models.VehicleRental;
import speedy.go.speedygo.stationManagement.models.VehicleRentalStats;

import java.util.List;

public interface VehiculeRentalRepository extends JpaRepository<VehicleRental,Long> {
    VehicleRental  findVehicleRentalByQrCode(String codeQR);
    // Méthode pour récupérer les véhicules avec pagination et tri
    Page<VehicleRental> findAll(Pageable pageable);

    // Méthode pour récupérer tous les véhicules triés
    List<VehicleRental> findAll(Sort sort);


    @Query("SELECT new speedy.go.speedygo.stationManagement.models.VehicleRentalStats(" +
            "v.id, v.models, v.mileage, COUNT(r.id), SUM(r.distanceTraveled)) " +
            "FROM VehicleRental v " +
            "LEFT JOIN Rental r ON r.vehicleRental.id = v.id " +
            "GROUP BY v.id, v.models, v.mileage " +
            "ORDER BY SUM(r.distanceTraveled) DESC")
    List<VehicleRentalStats> findVehicleStats();



    List<VehicleRental> getVehicleRentalByStationId(Long idStation);


}
