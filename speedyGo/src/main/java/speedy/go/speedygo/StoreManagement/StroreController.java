package speedy.go.speedygo.StoreManagement;

import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import speedy.go.speedygo.models.Store;
import speedy.go.speedygo.models.StoreStatus;
import speedy.go.speedygo.models.StoreType;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/store")
@AllArgsConstructor
public class StroreController {
StoreService storeService;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Store> createStore(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("contact") String contact,
            @RequestParam("address") String address,
            @RequestParam("type") String type,
            @RequestParam(value = "logoUrl", required = false) MultipartFile logoUrl,
            @RequestParam(value = "backgroundImageUrl", required = false) MultipartFile backgroundImageUrl) throws IOException {

        // 1. Sauvegarder l'image du logo si elle existe
        String logoFileName = null;
        if (logoUrl != null) {
            logoFileName = UUID.randomUUID().toString() + "_" + logoUrl.getOriginalFilename();
            Path logoPath = Paths.get("uploads/" + logoFileName);
            Files.write(logoPath, logoUrl.getBytes());
        }

        // 2. Sauvegarder l'image de fond si elle existe
        String backgroundFileName = null;
        if (backgroundImageUrl != null) {
            backgroundFileName = UUID.randomUUID().toString() + "_" + backgroundImageUrl.getOriginalFilename();
            Path backgroundPath = Paths.get("uploads/" + backgroundFileName);
            Files.write(backgroundPath, backgroundImageUrl.getBytes());
        }

        // 3. Créer un objet Store avec l'URL de l'image
        Store store = new Store();
        store.setName(name);
        store.setDescription(description);
        store.setContact(contact);
        store.setAddress(address);
        store.setType(StoreType.valueOf(type)); // Conversion de String à Enum
        store.setLogoUrl(logoFileName != null ? "/uploads/" + logoFileName : null); // URL du logo si existant
        store.setBackgroundImageUrl(backgroundFileName != null ? "/uploads/" + backgroundFileName : null); // URL de l'image de fond si existant

        // 4. Sauvegarder le store en base de données via le service
        Store savedStore = storeService.createStore(store);

        // 5. Retourner la réponse
        return ResponseEntity.ok(savedStore);
    }




    // Endpoint pour récupérer un store par ID
    @GetMapping("/{id}")
    public ResponseEntity<Store> getStoreById(@PathVariable int id) {
        Optional<Store> store = storeService.getStoreById(id);
        if (store.isPresent()) {
            return ResponseEntity.ok(store.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint pour mettre à jour un store
    @PutMapping("/{id}")
    public ResponseEntity<Store> updateStore(@PathVariable int id, @RequestBody Store storeDetails) {
        Store updatedStore = storeService.updateStore(id, storeDetails);
        return ResponseEntity.ok(updatedStore);
    }

    // Endpoint pour supprimer un store
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable int id) {
        storeService.deleteStore(id);
        return ResponseEntity.noContent().build();
    }
}