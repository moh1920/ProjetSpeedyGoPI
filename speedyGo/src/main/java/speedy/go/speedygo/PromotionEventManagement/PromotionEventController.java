package speedy.go.speedygo.PromotionEventManagement;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import speedy.go.speedygo.dto.LoyaltyProgramDTO;
import speedy.go.speedygo.models.Event_Promotion;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pv")
@Tag(name = "Promotion and Event ")
public class PromotionEventController {
        private final PromotionEventService promotionEventService;



    @PostMapping(value = "/picture/{pv-id}",consumes = "multipart/form-data")
    public ResponseEntity<?> uploadPostCoverPicture(
            @PathVariable("pv-id") Long postId,
            @Parameter()
            @RequestPart("file") MultipartFile file ,
            Authentication connectedUser
    ){
        promotionEventService.uploadPostPicture(file,connectedUser,postId);
        return ResponseEntity.accepted().build();
    }

    @PostMapping
    public ResponseEntity<Long> createPromotion(
            @RequestBody Event_Promotion eventPromotion,
            @RequestParam Long productId,
            Authentication authentication) {



        Long promotionId = promotionEventService.savePV(eventPromotion, productId, authentication);
        return new ResponseEntity<>(promotionId, HttpStatus.CREATED);
    }


    @GetMapping("/{pvId}")
        public ResponseEntity<Event_PromotionDto> getPromotionById(@PathVariable Long pvId) {
            Event_PromotionDto eventPromotion = promotionEventService.getPVById(pvId);
            return new ResponseEntity<>(eventPromotion, HttpStatus.OK);
        }

        @GetMapping
        public ResponseEntity<List<Event_PromotionDto>> getAllPromotions() {
            List<Event_PromotionDto> eventPromotions = promotionEventService.getAllPromotions();
            return new ResponseEntity<>(eventPromotions, HttpStatus.OK);
        }

        @PutMapping("/{pvId}")
        public ResponseEntity<Event_PromotionDto> updatePromotion(@PathVariable("pvId") Long pvId,
                                                               @RequestBody Event_Promotion eventPromotionDetails,
                                                               Authentication authentication) {
            Event_PromotionDto updatedEventPromotion = promotionEventService.updatePV(pvId, eventPromotionDetails, authentication);
            return new ResponseEntity<>(updatedEventPromotion, HttpStatus.OK);
        }

        @DeleteMapping("/{pvId}")
        public ResponseEntity<Void> deletePromotion(@PathVariable("pvId") Long pvId, Authentication authentication) {
            promotionEventService.deletePV(pvId, authentication);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        @GetMapping("/loyaltyPrograms")
        public ResponseEntity<List<LoyaltyProgramDTO>> getAllLoyaltyProgram(){
            return ResponseEntity.ok(this.promotionEventService.getAllLoyaltyProgram());
        }
        @DeleteMapping("/loyaltyProgram/{idProgram}")
        public ResponseEntity<Void> deleteLoyaltyProgram(@PathVariable("idProgram") Long idProgram, Authentication connectedUser){
            this.promotionEventService.deleteLoyaltyProgram(idProgram,connectedUser);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

    @GetMapping("/loyaltyProgramDetails/{id}")
    public ResponseEntity<LoyaltyProgramDTO> getLoyaltyProgramById(@PathVariable("id") Long id, Authentication connectedUser) {
        LoyaltyProgramDTO dto = promotionEventService.findLoyaltyProgramById(id, connectedUser);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/calendarPV")
    public List<Event_PromotionDto> getFutureEvents() {
        return promotionEventService.findByStartDateAfter(LocalDate.now());
    }

}
