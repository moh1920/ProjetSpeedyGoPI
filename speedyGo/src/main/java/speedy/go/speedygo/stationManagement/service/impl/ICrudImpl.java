package speedy.go.speedygo.stationManagement.service.impl;

import java.util.List;

public interface ICrudImpl<T> {
    T add(T value);      // Use T as defined at the interface level
    List<T> getAll();     // No need for <T> before List<T>, since T is already defined
    T getById(Long id);       // Use the same T for return type
    T update(T value);    // Same for update
    void remove(Long id);    // Same for remove
}