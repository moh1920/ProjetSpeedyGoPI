package speedy.go.speedygo.stationManagement.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import speedy.go.speedygo.models.Station;
import speedy.go.speedygo.models.VehicleRental;
import speedy.go.speedygo.stationManagement.models.VehicleRentalStats;
import speedy.go.speedygo.stationManagement.repository.RentalRepository;
import speedy.go.speedygo.stationManagement.repository.StationRepository;
import speedy.go.speedygo.stationManagement.repository.VehiculeRentalRepository;
import speedy.go.speedygo.stationManagement.service.impl.ICrudImpl;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.UUID;


@Service
public class VehicleRentalService implements ICrudImpl<VehicleRental> {
    @Autowired
    private VehiculeRentalRepository vehiculeRentalRepository;
    @Autowired
    private QRCodeService qrCodeService ;
    @Autowired
    private StationRepository stationRepository ;

    @Autowired
    private RentalRepository rentalRepository ;
    @Override
    public VehicleRental add(VehicleRental vehicule) {
        try {
            String uniqueId = (vehicule.getId() != null) ? vehicule.getId().toString() : UUID.randomUUID().toString();

            String qrCodeText = "http://localhost:4200/detaitsScooterBikeList/" + uniqueId ;

            String qrCodeBase64 = qrCodeService.generateQRCodeBase64(qrCodeText);

            vehicule.setQrCode(qrCodeBase64);


            vehicule.setCreatedAt(LocalDate.now());
            vehicule.setLastMaintenanceDate(LocalDate.now());
            vehicule.setUpdatedAt(LocalDate.now());

            return vehiculeRentalRepository.save(vehicule);
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Erreur lors de la génération du QR Code", e);
        }
    }



    @Override
    public List<VehicleRental> getAll() {
        return vehiculeRentalRepository.findAll();
    }

    @Override
    public VehicleRental getById(Long id) {
        return vehiculeRentalRepository.findById(id).get();
    }

    @Override
    @Transactional
    public VehicleRental update(VehicleRental value) {
        // Check if the vehicle rental exists
        VehicleRental existingVehicleRental = vehiculeRentalRepository.findById(value.getId())
                .orElseThrow(() -> new EntityNotFoundException("Vehicle Rental not found with id: " + value.getId()));

        // Update the existing vehicle rental's properties
        existingVehicleRental.setStatus(value.getStatus());
        existingVehicleRental.setBatteryLevel(value.getBatteryLevel());
        existingVehicleRental.setMileage(value.getMileage());
        existingVehicleRental.setQrCode(value.getQrCode());
        existingVehicleRental.setLastMaintenanceDate(value.getLastMaintenanceDate());
        existingVehicleRental.setTypeVehicleRental(value.getTypeVehicleRental());
        existingVehicleRental.setStation(value.getStation());
        existingVehicleRental.setCostOfVehicleByKm(value.getCostOfVehicleByKm());
        existingVehicleRental.setUpdatedAt(LocalDate.now());

        // Save and return the updated vehicle rental
        return vehiculeRentalRepository.save(existingVehicleRental);
    }

    @Override
    public void remove(Long id) {
        vehiculeRentalRepository.deleteById(id);
    }




    public byte[] getVehiculeQRCode(Long id) {
        VehicleRental vehicule = vehiculeRentalRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Véhicule non trouvé"));

        if (vehicule.getQrCode() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "QR Code non disponible");
        }

        // Vérifier si le QR Code est bien stocké en `bytea` ou en Base64
        byte[] qrCodeBytes;
        try {
            // Si c'est du Base64, on le décode
            qrCodeBytes = Base64.getDecoder().decode(vehicule.getQrCode());
        } catch (IllegalArgumentException e) {
            // Si ce n'est pas du Base64, alors on suppose que c'est déjà un `bytea`
            qrCodeBytes = vehicule.getQrCode().getBytes();
        }

        return qrCodeBytes;
    }

    public boolean affectVehicleToStation(Long idStation ,Long idVehicle ){
        try {
            VehicleRental vehicule = vehiculeRentalRepository.findById(idVehicle).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not Found"));
            Station station = stationRepository.findById(idStation).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "station not Found"));
            vehicule.setStation(station);
            vehiculeRentalRepository.save(vehicule);
            station.setCapacity(station.getCapacity() + 1);
            stationRepository.save(station);
            return true ;
        }catch (Exception e){
            return false ;
        }
    }
    public Page<VehicleRental> getAll(Pageable pageable) {
        // Utilisation de pageable pour récupérer les données paginées et triées
        return vehiculeRentalRepository.findAll(pageable);
    }
    public VehicleRental updateVehicleRental(VehicleRental value,Long idVehicle) {
        // Check if the vehicle rental exists
        VehicleRental existingVehicleRental = vehiculeRentalRepository.findById(idVehicle)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle Rental not found with id: " + value.getId()));

        // Update the existing vehicle rental's properties
        existingVehicleRental.setStatus(value.getStatus());
        existingVehicleRental.setBatteryLevel(value.getBatteryLevel());
        existingVehicleRental.setMileage(value.getMileage());
        existingVehicleRental.setQrCode(value.getQrCode());
        existingVehicleRental.setLastMaintenanceDate(value.getLastMaintenanceDate());
        existingVehicleRental.setTypeVehicleRental(value.getTypeVehicleRental());
        existingVehicleRental.setStation(value.getStation());

        // Save and return the updated vehicle rental
        return vehiculeRentalRepository.save(existingVehicleRental);
    }


    public byte[] generateQrCodeImage(String qrCodeText) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(qrCodeText, BarcodeFormat.QR_CODE, 200, 200);

        BufferedImage bufferedImage = new BufferedImage(200, 200, BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < 200; x++) {
            for (int y = 0; y < 200; y++) {
                bufferedImage.setRGB(x, y, bitMatrix.get(x, y) ? 0x000000 : 0xFFFFFF);
            }
        }

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "PNG", byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray(); // ← retourne un byte[]
    }




    //find top vehicle by distance traveled
    public List<VehicleRentalStats> findVehicleStats(){
        return vehiculeRentalRepository.findVehicleStats();
    }



    @Transactional
    public List<VehicleRental> getAllVehicleOnStation(Long idStation){
        return vehiculeRentalRepository.getVehicleRentalByStationId(idStation);
    }








}
