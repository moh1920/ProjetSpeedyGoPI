package speedy.go.speedygo.stationManagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import speedy.go.speedygo.models.MaintenanceHistory;
import speedy.go.speedygo.stationManagement.repository.MaintenanceHistoryRepository;
import speedy.go.speedygo.stationManagement.service.impl.ICrudImpl;

import java.util.List;
@Service
public class MaintenanceHistoryService implements ICrudImpl<MaintenanceHistory> {

    @Autowired
    private MaintenanceHistoryRepository maintenanceHistoryRepository;
    @Override
    public MaintenanceHistory add(MaintenanceHistory value) {
        return maintenanceHistoryRepository.save(value);
    }

    @Override
    public List<MaintenanceHistory> getAll() {
        return maintenanceHistoryRepository.findAll();
    }

    @Override
    public MaintenanceHistory getById(Long id) {
        return maintenanceHistoryRepository.findById(id).get();
    }

    @Override
    public MaintenanceHistory update(MaintenanceHistory value) {
        for (MaintenanceHistory maintenanceHistory:maintenanceHistoryRepository.findAll()){
            if (maintenanceHistory.getId().equals(value.getId())){
                return maintenanceHistoryRepository.save(value);
            }
        }
        return value ;
    }

    @Override
    public void remove(Long id) {
         maintenanceHistoryRepository.deleteById(id);
    }

    public Page<MaintenanceHistory> getAll(Pageable pageable){
        return maintenanceHistoryRepository.findAll(pageable);
    }

}
