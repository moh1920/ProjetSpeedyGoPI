package speedy.go.speedygo.PromotionEventManagement;

import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import speedy.go.speedygo.DeliveryManagement.Repository.PaymentRepository;
import speedy.go.speedygo.ProductManagement.Repository.ProductRepository;
import speedy.go.speedygo.dto.LoyaltyProgramDTO;
import speedy.go.speedygo.email.EmailService;
import speedy.go.speedygo.email.EmailTemplateName;
import speedy.go.speedygo.file.FileStorageService;
import speedy.go.speedygo.keycloak.KeycloakAdminService;
import speedy.go.speedygo.models.Event_Promotion;
import speedy.go.speedygo.models.LoyaltyProgram;
import speedy.go.speedygo.models.Product;
import speedy.go.speedygo.notification.NotificationAPP;
import speedy.go.speedygo.notification.NotificationServices;
import speedy.go.speedygo.notification.NotificationStatus;
import speedy.go.speedygo.user.User;
import speedy.go.speedygo.user.UserRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromotionEventService {

    private final PromotionEventRepository promotionEventRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService ;
    private final EmailService emailService;
    private final PaymentRepository paymentRepository;
    private final LoyaltyProgramRepository loyaltyProgramRepository;
    private final NotificationServices notificationServices;
    private final KeycloakAdminService keycloakAdminService;


    public Long savePV(Event_Promotion eventPromotion, Long productId, Authentication connectedUser) {
        User user = this.userRepository.findById(connectedUser.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Product product = this.productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        eventPromotion.setPartnerEvent_Promotion(user);
        eventPromotion.setProducts(product);
      // Event_Promotion eventPromotions= this.promotionEventRepository.save(eventPromotion);
        notificationServices.sendNotificationApp(
                user.getId(),
        NotificationAPP.builder()
                .status(NotificationStatus.A)
                .message("PV added successfully")
                .title("Good")
                .build());
        return  this.promotionEventRepository.save(eventPromotion).getId();
    }
    public void uploadPostPicture(MultipartFile file, Authentication connectedUser, Long postId){
        Event_Promotion eventPromotion=promotionEventRepository.findById(postId)
                .orElseThrow(()->new EntityNotFoundException("No post found with ID : "+postId));
        var profilePicture=fileStorageService.saveFile(file, connectedUser.getName());
        eventPromotion.setImageUrl(profilePicture);
        promotionEventRepository.save(eventPromotion);
    }


    public Event_PromotionDto getPVById(Long pvId){
        Event_Promotion eventPromotion= this.promotionEventRepository.findById(pvId)
                .orElseThrow(() -> new EntityNotFoundException("PV not found"));
        return Event_PromotionDto.builder()
                .id(eventPromotion.getId())
                .imageUrl(eventPromotion.getImageUrl())
                .description(eventPromotion.getDescription())
                .partnerEventPromotionIds(eventPromotion.getPartnerEvent_Promotion().getId())
                .status(eventPromotion.getStatus().toString())
                .startDate(eventPromotion.getStartDate())
                .endDate(eventPromotion.getEndDate())
                .discount(eventPromotion.getDiscount())
                .typeEV_ep(eventPromotion.getTypeEV_ep().toString())
                .productId(eventPromotion.getProducts().getId())
                .build();
    }

    public List<Event_PromotionDto> getAllPromotions(){
        List<Event_Promotion> eventPromotions= this.promotionEventRepository.findAll();
        return eventPromotions.stream().map(eventPromotion -> Event_PromotionDto.builder()
                .id(eventPromotion.getId())
                .imageUrl(eventPromotion.getImageUrl())
                .startDate(eventPromotion.getStartDate())
                .endDate(eventPromotion.getEndDate())
                .status(eventPromotion.getStatus().toString())
                .typeEV_ep(eventPromotion.getTypeEV_ep().toString())
                .description(eventPromotion.getDescription())
                .discount(eventPromotion.getDiscount())
                .partnerEventPromotionIds(eventPromotion.getPartnerEvent_Promotion().getId())
                .productId(eventPromotion.getProducts().getId())
                .build()).toList();
    }
    public Event_PromotionDto updatePV(Long pvId, Event_Promotion eventPromotionDetails, Authentication connectedUser) {
        Event_Promotion eventPromotion = this.promotionEventRepository.findById(pvId)
                .orElseThrow(() -> new EntityNotFoundException("PV not found"));

        eventPromotion.setTypeEV_ep(eventPromotionDetails.getTypeEV_ep());
        eventPromotion.setProducts(eventPromotionDetails.getProducts());
        eventPromotion.setDescription(eventPromotionDetails.getDescription());
        eventPromotion.setDiscount(eventPromotionDetails.getDiscount());
        eventPromotion.setImageUrl(eventPromotionDetails.getImageUrl());
        eventPromotion.setStartDate(eventPromotionDetails.getStartDate());
        eventPromotion.setEndDate(eventPromotionDetails.getEndDate());
        eventPromotion.setStatus(eventPromotionDetails.getStatus());
        eventPromotion.setCreatedDate(eventPromotionDetails.getCreatedDate());
        eventPromotion.setLastModifiedDate(eventPromotionDetails.getLastModifiedDate());

        Event_Promotion saved = this.promotionEventRepository.save(eventPromotion);

        return new Event_PromotionDto(
                saved.getId(),
                saved.getTypeEV_ep().toString(),
                saved.getDescription(),
                saved.getDiscount(),
                saved.getImageUrl(),
                saved.getStartDate(),
                saved.getEndDate(),
                saved.getStatus().toString(),
                null, // ou mapper les IDs depuis saved.getCustomerEvent_Promotion()
                saved.getPartnerEvent_Promotion() != null ? saved.getPartnerEvent_Promotion().getId().toString() : null,
                saved.getProducts() != null ? saved.getProducts().getId() : null
        );
    }


    @Transactional
    public void deletePV(Long pvId, Authentication connectedUser) {
        Event_Promotion eventPromotion = this.promotionEventRepository.findById(pvId)
                .orElseThrow(() -> new EntityNotFoundException("PV not found"));

        User partner = eventPromotion.getPartnerEvent_Promotion();
        if (partner != null) {
            partner.getEventPromotionsPartner().remove(eventPromotion);
            eventPromotion.setPartnerEvent_Promotion(null);
        }

        this.promotionEventRepository.save(eventPromotion);
        this.promotionEventRepository.delete(eventPromotion);
    }





  /*  @Transactional
    public void deletePV(Long pvId, Authentication connectedUser){
        Event_Promotion eventPromotion = this.promotionEventRepository.findById(pvId)
                .orElseThrow(() -> new EntityNotFoundException("PV not found"));

        this.userRepository.deleteByEventPromotionId(eventPromotion);

        eventPromotion.setPartnerEvent_Promotion(null);
        this.promotionEventRepository.save(eventPromotion);

        this.promotionEventRepository.deleteById(pvId);
    }*/



    @Scheduled(cron = "0 0 0 * * ?")
    //@Scheduled(fixedRate = 30000)
    @Transactional
    public void removeAllExpiredPromotions(){
        this.promotionEventRepository
                .markAllExpiredPromotions();
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void findTopThreeBestClient() throws MessagingException {
        List<String> emails = this.paymentRepository.findTopThreeClient();

        List<User> users = this.userRepository.findUsersByEmails(emails);

        if (users.size() != emails.size()) {
            System.out.println("Un ou plusieurs utilisateurs n'ont pas été trouvés.");
        }

        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);

            String promoCode = generatePromoCode();

            LoyaltyProgram loyaltyProgram = new LoyaltyProgram();
            loyaltyProgram.setPartnerLoyaltyProgram(user);
            loyaltyProgram.setUsersWhoWonSpecialPromotions(List.of(user));
            loyaltyProgram.setProgramName("Exclusive Loyalty Program");
            loyaltyProgram.setDescription("Exceptional promotion for your loyalty.");
            loyaltyProgram.setRewardType("Discount");
            loyaltyProgram.setPointsAccumulated(0);
            loyaltyProgram.setStartDate(new Date());
            loyaltyProgram.setEndDate(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000));

            loyaltyProgram.setPromoCode(promoCode);

            loyaltyProgramRepository.save(loyaltyProgram);

            this.emailService.sendEmail(
                    emails.get(i),
                    user.getFirstName() + " " + user.getLastName(),
                    EmailTemplateName.ACTIVATE_ACCOUNT,
                    null,
                    "You have a special discount for your loyalty! Promo Code: " + promoCode
            );
        }
    }


    private String generatePromoCode() {
        return "PROMO-" + UUID.randomUUID().toString().substring(0, 8);
    }
    @Scheduled(cron = "0 0 0 * * ?")
   // @Scheduled(fixedRate = 30000)
    public void getUsersInactifAndSendEmail() {
        log.info("fonction en cours d'execution");
        List<Map<String, Object>> users = keycloakAdminService.getUsers();
        List<User> usersInactif = new ArrayList<>();

        Instant oneMonthAgo = Instant.now().minus(30, ChronoUnit.DAYS);

        for (Map<String, Object> userMap : users) {
            String userId = (String) userMap.get("id");
            String email = (String) userMap.get("email");
            String firstName = (String) userMap.get("firstName");
            String lastName = (String) userMap.get("lastName");

            List<Map<String, Object>> sessions = keycloakAdminService.getUserSessions(userId);

            boolean isInactive = sessions.stream().allMatch(session -> {
                Long lastAccess = (Long) session.get("lastAccess");
                if (lastAccess == null) return true;
                Instant lastAccessDate = Instant.ofEpochMilli(lastAccess);
                return lastAccessDate.isBefore(oneMonthAgo);
            });

            if (isInactive && !sessions.isEmpty()) {
                User user = new User();
                user.setId(userId);
                user.setEmail(email);
                user.setFirstName(firstName);
                user.setLastName(lastName);
                usersInactif.add(user);
            }
        }
        usersInactif.forEach(user -> {
            System.out.println("User inactive : " + user.getEmail());
            String promotion=generatePromoCode();

            LoyaltyProgram loyaltyProgram = new LoyaltyProgram();
            loyaltyProgram.setPartnerLoyaltyProgram(user);
            loyaltyProgram.setUsersWhoWonSpecialPromotions(List.of(user));
            loyaltyProgram.setProgramName("Exclusive Loyalty Program");
            loyaltyProgram.setDescription("Exceptional promotion for your loyalty.");
            loyaltyProgram.setRewardType("Discount");
            loyaltyProgram.setPointsAccumulated(0);
            loyaltyProgram.setStartDate(new Date());
            loyaltyProgram.setEndDate(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000));

            loyaltyProgram.setPromoCode(promotion);

            loyaltyProgramRepository.save(loyaltyProgram);
            try {
                this.emailService.sendEmail(
                        user.getEmail(),
                        user.getFirstName() + " " + user.getLastName(),
                        EmailTemplateName.ACTIVATE_ACCOUNT,
                        "Hello " + user.getFirstName() + ",\n\n" +
                                "We’ve noticed that you haven’t used SpeedyGo for a while, and we hope everything is going well on your end.\n\n" +
                                "We would love to understand why you’ve been less active recently. Your feedback is valuable to us and helps us improve our service. Feel free to let us know if you’ve encountered any issues or have suggestions.\n\n" +
                                "To thank you for your loyalty, we are offering you a **20% discount code** valid for your next rental:  \n" +
                                promotion +
                                "\nThis code is valid until [expiration date], so make sure to take advantage of it soon!\n\n" +
                                "Looking forward to seeing you back on SpeedyGo!\n\n" +
                                "The SpeedyGo Team\n" +
                                "support@speedygo.tn\n",
                        "We'd love to hear from you – A surprise awaits!"
                );
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        });
    }

    public List<LoyaltyProgramDTO> getAllLoyaltyProgram(){
       return this.loyaltyProgramRepository.findAll()
               .stream().map(loyaltyProgram -> LoyaltyProgramDTO.builder()
                       .id(loyaltyProgram.getId())
                       .programName(loyaltyProgram.getProgramName())
                       .description(loyaltyProgram.getDescription())
                       .isActive(loyaltyProgram.isActive())
                       .rewardType(loyaltyProgram.getRewardType())
                       .pointsAccumulated(loyaltyProgram.getPointsAccumulated())
                       .promoCode(loyaltyProgram.getPromoCode())
                       .startDate(loyaltyProgram.getStartDate())
                       .endDate(loyaltyProgram.getEndDate())
                       .membershipCondition(loyaltyProgram.getMembershipCondition())
                       .usersWhoWonSpecialPromotionsEmails(
                               loyaltyProgram.getUsersWhoWonSpecialPromotions().stream()
                                       .map(User::getEmail)
                                       .toList()
                       )
                       .usersWhoWonPointsEmails(loyaltyProgram.getUsersWhoWonPoints().stream().map(User::getEmail).toList())
                       .build()).toList();
    }

    public void deleteLoyaltyProgram(Long idProgram,Authentication connectedUser){
        LoyaltyProgram loyaltyProgram=this.loyaltyProgramRepository.findById(idProgram)
                .orElseThrow(()->new EntityNotFoundException("Loyalty program not found"));

        this.loyaltyProgramRepository.deleteById(idProgram);
    }

    public LoyaltyProgramDTO findLoyaltyProgramById(Long id, Authentication connectedUser) {
        LoyaltyProgram loyaltyProgram = this.loyaltyProgramRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Loyalty Program not found with id: " + id));

        return LoyaltyProgramDTO.builder()
                .id(loyaltyProgram.getId())
                .programName(loyaltyProgram.getProgramName())
                .description(loyaltyProgram.getDescription())
                .isActive(loyaltyProgram.isActive())
                .rewardType(loyaltyProgram.getRewardType())
                .pointsAccumulated(loyaltyProgram.getPointsAccumulated())
                .promoCode(loyaltyProgram.getPromoCode())
                .startDate(loyaltyProgram.getStartDate())
                .endDate(loyaltyProgram.getEndDate())
                .membershipCondition(loyaltyProgram.getMembershipCondition())
                .usersWhoWonSpecialPromotionsEmails(
                        loyaltyProgram.getUsersWhoWonSpecialPromotions().stream()
                                .map(User::getEmail)
                                .toList()
                )
                .usersWhoWonPointsEmails(
                        loyaltyProgram.getUsersWhoWonPoints().stream()
                                .map(User::getEmail)
                                .toList()
                )
                .build();
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteAllExpiredLoyaltyProgram() {
        Date now = new Date();
        List<Long> idsOfExpiredPrograms = this.loyaltyProgramRepository.findAll().stream()
                .filter(loyaltyProgram -> loyaltyProgram.getEndDate().before(now))
                .map(LoyaltyProgram::getId)
                .toList();
        this.loyaltyProgramRepository.deleteAllById(idsOfExpiredPrograms);
    }


    public List<Event_PromotionDto> findByStartDateAfter(LocalDate now) {
        return promotionEventRepository.findByStartDateAfter(now).stream().map(eventPromotion -> Event_PromotionDto.builder()
                .id(eventPromotion.getId())
                .imageUrl(eventPromotion.getImageUrl())
                .startDate(eventPromotion.getStartDate())
                .endDate(eventPromotion.getEndDate())
                .status(eventPromotion.getStatus().toString())
                .typeEV_ep(eventPromotion.getTypeEV_ep().toString())
                .description(eventPromotion.getDescription())
                .discount(eventPromotion.getDiscount())
                .partnerEventPromotionIds(eventPromotion.getPartnerEvent_Promotion().getId())
                .productId(eventPromotion.getProducts().getId())
                .build()).toList();
    }
}
