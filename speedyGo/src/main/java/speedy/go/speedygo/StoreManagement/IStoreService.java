package speedy.go.speedygo.StoreManagement;

import speedy.go.speedygo.ProductManagement.ProductResponse;
import speedy.go.speedygo.common.PageResponse;
import speedy.go.speedygo.models.Product;
import speedy.go.speedygo.models.Store;

import java.util.Optional;

public interface IStoreService {
    Store createStore(Store store);
    Optional<Store> getStoreById(int id);


    Store updateStore(int id, Store storeDetails);

    void deleteStore(int id);
}
