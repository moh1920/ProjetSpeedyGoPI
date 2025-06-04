package speedy.go.speedygo.stationManagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import speedy.go.speedygo.stationManagement.service.ImageService;


@RestController
@RequestMapping("/gestionStation/testImage")
public class ImageController {


    @Autowired
    private ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String url = imageService.upload(file);
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            e.printStackTrace(); // pour la console
            return ResponseEntity.status(500).body("Erreur : " + e.getMessage()); // réponse plus claire
        }
    }
}
