package speedy.go.speedygo.googleAnalyseSentimentConfig;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/restaurants")
public class scrappingMapController {


        private final String API_KEY = "AIzaSyCidD4GBkYXMcyDIRWWUhfkZHT9noeXXzE";

        @GetMapping("/tendance")
        public ResponseEntity<String> getTendanceRestaurants(
                @RequestParam double lat,
                @RequestParam double lng) {
            String url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
                    + "?location=" + lat + "," + lng
                    + "&radius=3000"
                    + "&type=restaurant"
                    + "&key=" + API_KEY;

            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(url, String.class);

            return ResponseEntity.ok(response);
        }


}
