package speedy.go.speedygo.DeliveryManagement.model;

import java.time.LocalDate;

public record SubscriptionDto(
        Long id,
        Integer durationInDays,
        Double price,
        String planName,
        Boolean isActive,
        LocalDate startDate,
        LocalDate endDate,
        String subscriberEmail
) {}
