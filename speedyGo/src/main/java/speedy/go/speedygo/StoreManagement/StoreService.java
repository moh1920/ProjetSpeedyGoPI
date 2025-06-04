package speedy.go.speedygo.StoreManagement;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import speedy.go.speedygo.models.Store;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class StoreService  {
    StoreRepository storeRepository;




    public Store createStore(Store store) {
        // Sauvegarder le store en base de données
        return storeRepository.save(store);
    }


    // Récupérer un store par ID
    public Optional<Store> getStoreById(int id) {
        return storeRepository.findById(id);
    }

    // Mettre à jour un store
    public Store updateStore(int id, Store storeDetails) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        store.setName(storeDetails.getName());
        store.setDescription(storeDetails.getDescription());
        store.setContact(storeDetails.getContact());
        store.setAddress(storeDetails.getAddress());
        store.setType(storeDetails.getType());
        store.setLogoUrl(storeDetails.getLogoUrl());
        store.setBackgroundImageUrl(storeDetails.getBackgroundImageUrl());
        store.setStatus(storeDetails.getStatus());

        return storeRepository.save(store);
    }

    // Supprimer un store
    public void deleteStore(int id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        storeRepository.delete(store);
    }
}