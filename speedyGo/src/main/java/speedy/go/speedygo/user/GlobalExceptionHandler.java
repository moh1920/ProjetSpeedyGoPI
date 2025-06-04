package speedy.go.speedygo.user;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

//@RestControllerAdvice
public class GlobalExceptionHandler {

/*    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());  }
*///@ExceptionHandler(MethodArgumentNotValidException.class)
/*public Map<String, String> handleValidationException(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
        errors.put(error.getField(), error.getDefaultMessage());
    }
    return errors;
}*/

}