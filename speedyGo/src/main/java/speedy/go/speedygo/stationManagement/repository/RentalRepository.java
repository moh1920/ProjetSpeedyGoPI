package speedy.go.speedygo.stationManagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import speedy.go.speedygo.models.Rental;
import speedy.go.speedygo.models.Station;
import speedy.go.speedygo.models.VehicleRental;
import speedy.go.speedygo.stationManagement.models.CustomerRentalStats;

import java.time.LocalDateTime;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental,Long> {
    Page<Rental> findAll(Pageable pageable);


    List<Rental> findAll(Sort sort);

    @Query("SELECT r.vehicleRental , r.endTime , r.id from Rental r")
    List<Object[]> getVehicleRental() ;


    List<Rental> findByEndTimeBefore(LocalDateTime dateLimit);



    List<Rental> findAllByRentalStatus(Boolean b);


    @Query("SELECT r.vehicleRental.id, COUNT(r) as rentalCount " +
            "FROM Rental r " +
            "WHERE r.startTime <= :endDate AND r.endTime >= :startDate " +
            "GROUP BY r.vehicleRental.id " +
            "ORDER BY rentalCount DESC")
    List<Object[]> findTopVehiclesByRentalCount(LocalDateTime startDate, LocalDateTime endDate);


    @Query("SELECT r.vehicleRental.id, COUNT(r) as rentalCount " +
            "FROM Rental r " +
            "WHERE r.startTime <= :endDate AND r.endTime >= :startDate " +
            "GROUP BY r.vehicleRental " +
            "ORDER BY rentalCount ASC")  // <-- ASC pour les moins loués
    List<Object[]> findLeastVehiclesByRentalCount(LocalDateTime startDate, LocalDateTime endDate);



    @Query("SELECT new speedy.go.speedygo.stationManagement.models.CustomerRentalStats (" +
            "r.customer.email, SUM(r.distanceTraveled) , SUM(r.cost) ) " +
            "FROM Rental r " +
            "GROUP BY r.customer.email " +
            "ORDER BY SUM(r.cost) DESC")
    List<CustomerRentalStats> findCustomerStats ();



    List<Rental> findAllByVehicleRentalId(Long IdVehicleRental);


    void deleteByVehicleRentalIsNull();


    List<Rental> findAllByCustomerId(String idCustomer);










}


