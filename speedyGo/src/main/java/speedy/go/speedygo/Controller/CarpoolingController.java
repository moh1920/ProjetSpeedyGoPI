package speedy.go.speedygo.Controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import speedy.go.speedygo.Service.ICarpoolService;
import speedy.go.speedygo.models.Carpooling;

import java.util.List;

@RestController
@RequestMapping("/carpooling")
@RequiredArgsConstructor
public class CarpoolingController {
    private final ICarpoolService iCarpoolService;

    @PostMapping("/add")
    @Operation(summary = "Add a new carpooling post")
    public @ResponseBody Carpooling addCarpool(@RequestBody Carpooling carpooling) {
        return iCarpoolService.addCarpool(carpooling);
    }

    @GetMapping("/all")
    @Operation(summary = "All the carpooling post")
    public List<Carpooling> getAllCarpools() {
        return iCarpoolService.getAllCarpools();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Find carpool by id")
    public Carpooling getCarpoolById(@PathVariable Long id) {
        return iCarpoolService.getCarpoolById(id);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a post carpool by id")
    public void deleteCarpoolById(@PathVariable Long id) {
        iCarpoolService.deleteCarpoolById(id);

    }

    @PutMapping("/{id}")
    @Operation(summary = "update a post carpool by id")
    public Carpooling updateCarpool(@PathVariable long id, @RequestBody Carpooling carpooling) {
        return iCarpoolService.updateCarpool(id, carpooling);
    }

}
