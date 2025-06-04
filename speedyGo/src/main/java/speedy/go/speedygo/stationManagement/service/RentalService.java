package speedy.go.speedygo.stationManagement.service;

import com.cloudinary.api.exceptions.NotFound;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import speedy.go.speedygo.models.*;
import speedy.go.speedygo.stationManagement.models.CustomerRentalStats;
import speedy.go.speedygo.stationManagement.models.GoogleDistanceMatrixResponse;
import speedy.go.speedygo.stationManagement.models.RentalDTO;
import speedy.go.speedygo.stationManagement.repository.RentalRepository;
import speedy.go.speedygo.stationManagement.repository.StationRepository;
import speedy.go.speedygo.stationManagement.repository.VehiculeRentalRepository;
import speedy.go.speedygo.stationManagement.service.impl.ICrudImpl;
import speedy.go.speedygo.user.User;
import speedy.go.speedygo.user.UserRepository;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.LongFunction;
import java.util.stream.Collectors;

@Service
public class RentalService   {


    private static final String OPENWEATHER_API_KEY = "6576cf72cbf76cf11ec299b42d9461f9";
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private VehicleRentalService vehicleRentalService ;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private RentalRepository rentalRepository ;
    @Autowired
    private VehiculeRentalRepository vehiculeRentalRepository ;
    @Autowired
    private StationRepository stationRepository ;
    @Autowired
    private UserRepository userRepository;

    @Value("${google.maps.api.key}")
    private String apiKey;
    public Rental add(Rental value, Authentication connectedUser) {

        User userConnected = this.userRepository.findById(connectedUser.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));



        if (value.getStartTime().isAfter(value.getEndTime())){
             throw new RuntimeException("the Start time must be after End Time");
        }


        value.setCustomer(userConnected);
        return rentalRepository.save(value);
    }


    public List<Rental> getAll() {

        return rentalRepository.findAll();
    }

    public Rental getById(Long id) {

        return rentalRepository.findById(id).get();
    }

    public Rental update(Rental value) {

        for (Rental rental:rentalRepository.findAll()){
            if (rental.getId().equals(value.getId())){
                return rentalRepository.save(value);
            }
        }
        return value ;
    }


    public void remove(Long id) {
        rentalRepository.deleteById(id);
    }



    public Page<Rental> getAll(Pageable pageable){

        return rentalRepository.findAll(pageable);
    }


    public Rental affecterStationStartRental(Long rentalId, Long idStartPoint) {

        Rental rental = rentalRepository.findById(rentalId).orElseThrow(()->new RuntimeException("Rental not found"));
        Station startingPoint = stationRepository.findById(idStartPoint).orElseThrow(()->new RuntimeException("station not found"));
        rental.setStartingPoint(startingPoint);
        return rentalRepository.save(rental);
    }


    public Rental affecterStationDestinatiionRental(Long rentalId,Long idDestination ) {

        Rental rental = rentalRepository.findById(rentalId).orElseThrow(()->new RuntimeException("Rental not found"));
        Station destination = stationRepository.findById(idDestination).orElseThrow(()->new RuntimeException("station not found"));
        rental.setDestination(destination);
        rental.getVehicleRental().getStation().setCapacity(rental.getVehicleRental().getStation().getCapacity() - 1);
        destination.setCapacity(destination.getCapacity()+1);
        stationRepository.save(rental.getVehicleRental().getStation());
        stationRepository.save(destination);

        return rentalRepository.save(rental);
    }
    public void affecterRentalToCustomer(String emailCustomer , Long idRental){

        Rental rental = rentalRepository.findById(idRental).orElseThrow(()->
                new RuntimeException("Not Found Rental"));
        User customer = userRepository.findByEmail(emailCustomer).orElseThrow(()->
                new RuntimeException("Not Found customer"));

        rental.setCustomer(customer);
        rentalRepository.save(rental);
    }
    public void affecterVehicleRentalToRental(Long idVehicleRental, Long idRental) {

        VehicleRental vehicleRental = vehiculeRentalRepository.findById(idVehicleRental)
                .orElseThrow(() -> new RuntimeException("Not Found Vehicle Rental"));
        Rental rental = rentalRepository.findById(idRental)
                .orElseThrow(() -> new RuntimeException("Not Found Rental"));

        List<Rental> rentalList = rentalRepository.findAllByVehicleRentalId(idVehicleRental);

        if( rentalList.isEmpty()){
            rental.setVehicleRental(vehicleRental);
            rental.setStartingPoint(vehicleRental.getStation());
            rentalRepository.save(rental);
        }else {
            for (Rental rentalVerification : rentalList) {
                boolean isTimeAvailable = rental.getEndTime().isBefore(rentalVerification.getStartTime()) ||
                        rental.getStartTime().isAfter(rentalVerification.getEndTime());

                if (isTimeAvailable) {
                    rental.setVehicleRental(vehicleRental);
                    rental.setStartingPoint(vehicleRental.getStation());
                    rentalRepository.save(rental);
                    return;
                }
            }


            throw new RuntimeException("Vehicle not affected because the time is not available");
        }


    }

    public void desVehicleRentalToRental(Long idRental){
        Rental rental = rentalRepository.findById(idRental).orElseThrow(()->
                new RuntimeException("Not Found Rental"));
        rental.setRentalStatus(false);
        rental.setVehicleRental(null);
        rentalRepository.save(rental);
    }

    public double getGoogleDistance(Float lat1, Float lon1, Float lat2, Float lon2) {
        String url = UriComponentsBuilder.fromHttpUrl("https://maps.googleapis.com/maps/api/distancematrix/json")
                .queryParam("origins", lat1 + "," + lon1)
                .queryParam("destinations", lat2 + "," + lon2)
                .queryParam("key", apiKey)
                .toUriString();

        GoogleDistanceMatrixResponse response = restTemplate.getForObject(url, GoogleDistanceMatrixResponse.class);

        if (response != null && response.getRows() != null && response.getRows().length > 0) {
            return response.getRows()[0].getElements()[0].getDistance().getValue() / 1000.0; // Distance en km
        } else {
            throw new RuntimeException("Erreur lors de la récupération de la distance");
        }
    }

    public Double calculCostOfRental(Long idRental) {



        Rental rental = rentalRepository.findById(idRental).orElseThrow(()->new RuntimeException("Not Found Rental"));
        Station destination = rental.getDestination();
        Station start = rental.getStartingPoint();

        double distance = getGoogleDistance(
                start.getLatitude(), start.getLongitude(),
                destination.getLatitude(), destination.getLongitude());

        double totalCost ;

        totalCost = distance * rental.getVehicleRental().getCostOfVehicleByKm() ;


        rental.setCost(totalCost);
        rental.setDistanceTraveled(distance);
        rentalRepository.save(rental) ;
        BigDecimal currentMileage = rental.getVehicleRental().getMileage();
        Double distanceTraveledDouble = rental.getDistanceTraveled(); // Suppose que c’est un Double
        BigDecimal distanceTraveled = distanceTraveledDouble != null
                ? BigDecimal.valueOf(distanceTraveledDouble)
                : BigDecimal.ZERO;
        rental.getVehicleRental().setMileage(currentMileage.add(distanceTraveled));
        vehiculeRentalRepository.save(    rental.getVehicleRental());
        sendEmailConfirmation(rental.getCustomer().getEmail(),"Facture de rental","La distance entre les stations est de " + distance + " km."+"Le coût de la location est de " + totalCost + " TND.");

        System.out.println("La distance entre les stations est de " + distance + " km.");
        System.out.println("Le coût de la location est de " + totalCost + " TND.");
        return totalCost ;
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






    public List<VehicleRental> tobTVehicleRentalByDate(LocalDateTime startDate, LocalDateTime endDate, Integer numberOfVehicles) {
        rentalRepository.deleteByVehicleRentalIsNull();

        List<VehicleRental> topVehicles = new ArrayList<>();
        List<Object[]> results = rentalRepository.findTopVehiclesByRentalCount(startDate, endDate);

        int count = 0;
        for (Object[] row : results) {
            if (count >= numberOfVehicles) break;

            Long vehicleId = (Long) row[0];
            // Tu peux créer une méthode dans un VehicleRentalRepository pour faire ça
            vehiculeRentalRepository.findById(vehicleId).ifPresent(topVehicles::add);

            count++;
        }

        return topVehicles;
    }


    public List<VehicleRental> lastVehicleRentalByDate(LocalDateTime startDate,LocalDateTime endDate,Integer numbreOfVehicle){
        rentalRepository.deleteByVehicleRentalIsNull();

        List<VehicleRental> lastVehicles = new ArrayList<>();
        List<Object[]> results = rentalRepository.findLeastVehiclesByRentalCount(startDate, endDate);

        int count = 0;
        for (Object[] row : results) {
            if (count >= numbreOfVehicle) break;

            Long vehicleId = (Long) row[0];
            // Tu peux créer une méthode dans un VehicleRentalRepository pour faire ça
            vehiculeRentalRepository.findById(vehicleId).ifPresent(lastVehicles::add);

            count++;
        }

        return lastVehicles;

    }


    private static final String GOOGLE_DIRECTIONS_API = "https://maps.googleapis.com/maps/api/directions/json";

    String getPolylineFromResponse(String response) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(response);

        // Vérification de la présence de routes
        JsonNode routes = root.path("routes");
        if (routes.isArray() && routes.size() > 0) {
            JsonNode overviewPolyline = routes.get(0).path("overview_polyline");
            if (overviewPolyline != null) {
                return overviewPolyline.path("points").asText();
            }
        }
        return null;
    }


    public String getRecommendedRoute(Long idRental) {
        RestTemplate restTemplate = new RestTemplate();
        Rental rental = rentalRepository.findById(idRental)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        String[] modes = {"bicycling", "driving", "walking"};
        String polyline = null;

        for (String mode : modes) {
            String url = UriComponentsBuilder.fromHttpUrl(GOOGLE_DIRECTIONS_API)
                    .queryParam("origin", rental.getStartingPoint().getLatitude() + "," + rental.getStartingPoint().getLongitude())
                    .queryParam("destination", rental.getDestination().getLatitude() + "," + rental.getDestination().getLongitude())
                    .queryParam("mode", mode)
                    .queryParam("key", apiKey)
                    .toUriString();

            try {
                String response = restTemplate.getForObject(url, String.class);

                polyline = getPolylineFromResponse(response);

                if (polyline != null) {
                    break;
                }
            } catch (Exception e) {
                System.out.println("Error with mode {}: {}"+ mode +" " +e.getMessage());
            }
        }

        if (polyline == null) {
            throw new RuntimeException("No route found for any mode.");
        }

        return polyline;
    }







    public void sendEmailWithQrAttachment(String toEmail, String subject, String body, byte[] qrCodeBytes) {
        try {
            byte[] primitiveBytes = new byte[qrCodeBytes.length];
            for (int i = 0; i < qrCodeBytes.length; i++) {
                primitiveBytes[i] = qrCodeBytes[i];
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("sayarim558@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body);

            helper.addAttachment("QRCode.png", new ByteArrayDataSource(primitiveBytes, "image/png"));

            mailSender.send(message);
            System.out.println("Email avec QR Code envoyé à : " + toEmail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }









    public Map<String, Object> getWeather(double lat, double lon) {
        String url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + OPENWEATHER_API_KEY + "&units=metric";
        return restTemplate.getForObject(url, Map.class);
    }

    public Map<String, Object> getMiddlePointWeather(Long idRental) {

        Rental rental = rentalRepository.findById(idRental)
                .orElseThrow(() -> new RuntimeException("Rental not found"));


        double midLat = rental.getStartingPoint().getLatitude() + rental.getStartingPoint().getLongitude()/ 2;
        double midLon = rental.getDestination().getLatitude() + rental.getDestination().getLongitude() / 2;

        return getWeather(midLat, midLon);
    }





    // fonction de stat :::
    // Top clients (par distance ou coût total)
    public List<CustomerRentalStats> findCustomerStats (){
        return rentalRepository.findCustomerStats() ;
    }

    public List<Map<String, Object>> compareMonthlyAvgDurations() {
        List<Rental> rentals = rentalRepository.findAll();

        Map<YearMonth, List<Rental>> rentalsByMonth = rentals.stream()
                .filter(r -> r.getStartTime() != null && r.getEndTime() != null)
                .collect(Collectors.groupingBy(r -> YearMonth.from(r.getStartTime())));

        Map<YearMonth, Double> avgDurations = new TreeMap<>();
        for (Map.Entry<YearMonth, List<Rental>> entry : rentalsByMonth.entrySet()) {
            double avg = entry.getValue().stream()
                    .mapToLong(r -> Duration.between(r.getStartTime(), r.getEndTime()).toMinutes())
                    .average()
                    .orElse(0);
            avgDurations.put(entry.getKey(), avg);
        }

        List<Map<String, Object>> response = new ArrayList<>();
        YearMonth previousMonth = null;
        Double previousAvg = null;

        for (Map.Entry<YearMonth, Double> entry : avgDurations.entrySet()) {
            YearMonth currentMonth = entry.getKey();
            Double currentAvg = entry.getValue();

            String trend;
            if (previousAvg == null) {
                trend = "N/A";
            } else if (currentAvg > previousAvg) {
                trend = "Croissance";
            } else if (currentAvg < previousAvg) {
                trend = "Décroissance";
            } else {
                trend = "Stable";
            }

            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", currentMonth.toString());
            monthData.put("average", currentAvg);
            monthData.put("trend", trend);

            response.add(monthData);

            previousAvg = currentAvg;
        }

        return response;
    }






















    @Scheduled(cron = "*/10 * * * * *")
    @Transactional
    public void rentalUpdateStatusAndVehicleStatus() throws Exception {
        rentalRepository.deleteByVehicleRentalIsNull();
        List<Rental> rentals = rentalRepository.findAll() ;

        for (Rental rentalUpdate : rentals){
            if (LocalDateTime.now().isAfter(rentalUpdate.getStartTime()) && LocalDateTime.now().isBefore(rentalUpdate.getEndTime())&& !rentalUpdate.getRentalStatus()){
                rentalUpdate.setRentalStatus(true);
                rentalRepository.save(rentalUpdate);
                rentalUpdate.getVehicleRental().setStatus(StatusVehicleRental.INACTIVE);

                BigDecimal currentMileage = rentalUpdate.getVehicleRental().getMileage();
                Double distanceTraveled = rentalUpdate.getDistanceTraveled();

                if (distanceTraveled != null) {
                    BigDecimal newMileage = currentMileage.add(BigDecimal.valueOf(distanceTraveled));
                    rentalUpdate.getVehicleRental().setMileage(newMileage);
                }

                vehiculeRentalRepository.save(rentalUpdate.getVehicleRental());

                this.sendEmailWithQrAttachment(
                        rentalUpdate.getCustomer().getEmail(),
                        "Rental Confirmation",
                        "The rental of the scooter or bike has started. Use this QR code to unlock",
                        vehicleRentalService.generateQrCodeImage(rentalUpdate.getVehicleRental().getQrCode())
                );
            }
        }

    }


    @Scheduled(cron = "*/10 * * * * *") // Toutes les 10 secondes
    @Transactional
    public void verificationEndOfRentalAndSendEmail() throws Exception {
        rentalRepository.deleteByVehicleRentalIsNull();
        List<Rental> rentalList = rentalRepository.findAll();

        for (Rental rental : rentalList) {

            if (LocalDateTime.now().isAfter(rental.getEndTime()) && rental.getRentalStatus()) {
                rental.setRentalStatus(false);
                rentalRepository.save(rental);
                rental.getVehicleRental().setStatus(StatusVehicleRental.ACTIVE);
                vehiculeRentalRepository.save(rental.getVehicleRental());
                System.out.println(" La voiture est maintenant disponible.");
                this.sendEmailConfirmation(
                        rental.getCustomer().getEmail(),
                        "Rental Ended",
                        "The rental has ended. Thank you for using our service!"
                );
            }
        }
    }



    public List<RentalDTO> getAllRentalByVehicle(Long idVehicle){
        List<Rental> rentals =rentalRepository.findAll();
        List<RentalDTO> rentalDTOS = new ArrayList<>() ;
        for (Rental rental: rentals){
            if (rental.getVehicleRental().getId().equals(idVehicle)){
                rentalDTOS.add(new RentalDTO(rental));
            }
        }
        return rentalDTOS;

    }



    @Transactional
    public List<RentalDTO> getAllRentalByCustomer(Authentication connectedUser){
        User userConnected = this.userRepository.findById(connectedUser.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));


        List<Rental> rentals = rentalRepository.findAllByCustomerId(userConnected.getId());
        List<RentalDTO> rentalDTOS = new ArrayList<>() ;
        for (Rental rental: rentals){
                rentalDTOS.add(new RentalDTO(rental));
        }
        return rentalDTOS;
    }


    public double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // rayon de la Terre en km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }






    public String getWeatherInDateRental(Long idRental) {
        Rental rental = rentalRepository.findById(idRental)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        double midLat = (rental.getStartingPoint().getLatitude() + rental.getDestination().getLatitude()) / 2;
        double midLon = (rental.getStartingPoint().getLongitude() + rental.getDestination().getLongitude()) / 2;

        String url = String.format(
                "https://api.openweathermap.org/data/2.5/forecast?lat=%f&lon=%f&appid=%s&units=metric",
                midLat, midLon, OPENWEATHER_API_KEY
        );

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        List<Map<String, Object>> forecasts = (List<Map<String, Object>>) response.get("list");

        LocalDateTime rentalDateTime = rental.getStartTime().withMinute(0).withSecond(0).withNano(0);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        Map<String, Object> closestForecast = null;
        long minDiff = Long.MAX_VALUE;

        for (Map<String, Object> forecast : forecasts) {
            String forecastDateStr = (String) forecast.get("dt_txt");
            LocalDateTime forecastDateTime = LocalDateTime.parse(forecastDateStr, formatter);
            long diff = Math.abs(Duration.between(rentalDateTime, forecastDateTime).toMinutes());

            if (diff < minDiff) {
                minDiff = diff;
                closestForecast = forecast;
            }
        }

        if (closestForecast != null) {
            Map<String, Object> main = (Map<String, Object>) closestForecast.get("main");
            Double temp = (Double) main.get("temp");
            String matchedDate = (String) closestForecast.get("dt_txt");
            return String.format("Température prévue pour %s : %.1f °C", matchedDate, temp);
        }

        return "Pas de prévision météo disponible.";
    }


}
