package speedy.go.speedygo.Service;

import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.springframework.http.ResponseEntity;
import speedy.go.speedygo.models.GoogleMapsResponse;

import speedy.go.speedygo.models.TypeTaxiReservation;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class GoogleMapsService {
    // Inject the Google Maps API key from application.yml
    @Value("${google.maps.api.key}")
    private String googleMapsApiKey;


    private static final String URL = "https://maps.googleapis.com/maps/api/distancematrix/json";

    public Double calculateDistanceAndPrice(String departure, String arrival , TypeTaxiReservation type) {
        // Build the Google Maps API URL
        String url = UriComponentsBuilder.fromHttpUrl(URL)
                .queryParam("origins", departure)
                .queryParam("destinations", arrival)
                .queryParam("key",googleMapsApiKey)  // Pass the API key in the request
                .toUriString();

        // Call the Google Maps API using RestTemplate
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<GoogleMapsResponse> response = restTemplate.getForEntity(url, GoogleMapsResponse.class);

        // Calculate the price based on the distance (in km) from Google Maps
        double distanceInKm = response.getBody().getRows()[0].getElements()[0].getDistance().getValue() / 1000.0;


        double pricePerKm = 900; // Example: price per kilometer
        // Si c'est PREMIUM, ajouter 400 au prix par km
        if (type == TypeTaxiReservation.PREMIUM) {
            pricePerKm += 400;  // 900 + 400 = 1300 pour PREMIUM
        }

         double rawPrice = distanceInKm * pricePerKm;  // Return calculated price
        // Arrondir à 3 décimales
        BigDecimal bd = new BigDecimal(rawPrice);
        bd = bd.setScale(3, RoundingMode.HALF_UP);

        return bd.doubleValue();
    }
}
